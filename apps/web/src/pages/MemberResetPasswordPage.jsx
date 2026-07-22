import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';

const MemberResetPasswordPage = () => {
  const { token: routeToken } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState(routeToken ? 'reset-token' : 'request-otp');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState(routeToken || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [maxResends, setMaxResends] = useState(3);
  const [expiresAt, setExpiresAt] = useState(null);
  const [blockUntil, setBlockUntil] = useState(null);
  const [message, setMessage] = useState('');

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isMatch = password && password === confirmPassword;
  const isValid = hasLength && hasUpper && hasLower && hasNumber && hasSpecial && isMatch;

  useEffect(() => {
    if (routeToken) {
      setPhase('reset-token');
      setResetToken(routeToken);
    }
  }, [routeToken]);

  useEffect(() => {
    if (!blockUntil) return;
    const timer = window.setInterval(() => {
      if (Date.now() >= blockUntil) {
        setBlockUntil(null);
        setResendCount(0);
        setMessage('You may now request a new OTP again.');
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [blockUntil]);

  const expiresCountdown = useMemo(() => {
    if (!expiresAt) return null;
    const remaining = Math.max(0, expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [expiresAt]);

  const blockCountdown = useMemo(() => {
    if (!blockUntil) return null;
    const remaining = Math.max(0, blockUntil - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }, [blockUntil]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await apiServerClient.fetch('/members/password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to send OTP');
      }

      setPhase('verify-otp');
      setResendCount(data.resendCount || 1);
      setMaxResends(data.maxResends || 3);
      setExpiresAt(data.expiresAt ? Number(data.expiresAt) : Date.now() + 30 * 60 * 1000);
      setMessage(data.message || 'OTP sent to your phone.');
      toast.success('OTP sent. Enter it below within 30 minutes.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phone || blockUntil) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await apiServerClient.fetch('/members/password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setBlockUntil(Date.now() + 24 * 60 * 60 * 1000);
        }
        throw new Error(data.error || 'Unable to resend OTP');
      }

      setPhase('verify-otp');
      setResendCount(data.resendCount || resendCount + 1);
      setExpiresAt(data.expiresAt ? Number(data.expiresAt) : Date.now() + 30 * 60 * 1000);
      setMessage(data.message || 'OTP resent.');
      toast.success('OTP resent successfully.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phone || !otp) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await apiServerClient.fetch('/members/password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setResetToken(data.resetToken);
      setPhase('reset');
      setExpiresAt(data.expiresAt ? Number(data.expiresAt) : Date.now() + 30 * 60 * 1000);
      setMessage('OTP verified. Set your new password now.');
      toast.success('OTP verified. You may now reset your password.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isValid || !resetToken) return;

    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/members/password/reset-password-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password, passwordConfirm: confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/member-login'), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canResend = !blockUntil && resendCount < maxResends;

  return (
    <>
      <Helmet><title>Reset Password</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl relative z-10">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Updated</h2>
              <p className="text-slate-600 mb-8">Your password has been successfully reset.</p>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-[hsl(var(--primary)_/_0.06)] rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-[hsl(var(--primary))]" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {phase === 'request-otp' && 'Enter your registered phone and request an OTP.'}
                  {phase === 'verify-otp' && 'Enter the OTP sent to your phone, then choose a new password.'}
                  {phase === 'reset' && 'Set a new password for your account.'}
                  {phase === 'reset-token' && 'Use your reset token to set a new password.'}
                </p>
              </div>

              {message && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </div>
              )}

              {(phase === 'request-otp' || phase === 'verify-otp') && (
                <form className="mt-8 space-y-6" onSubmit={phase === 'request-otp' ? handleRequestOtp : handleVerifyOtp}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">Registered Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        placeholder="07XXXXXXXX"
                      />
                    </div>

                    {phase === 'verify-otp' && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1">OTP Code</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                          placeholder="Enter 6-digit code"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading || (phase === 'verify-otp' && !otp)}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white btn-primary disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : phase === 'request-otp' ? 'Send OTP' : 'Verify OTP'}
                    </button>

                    {phase === 'verify-otp' && (
                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={loading || !canResend}
                          className="w-full inline-flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-50"
                        >
                          Resend OTP ({resendCount}/{maxResends})
                        </button>
                        {expiresCountdown && <p className="text-xs text-slate-500">Expires in {expiresCountdown}</p>}
                        {blockUntil && <p className="text-xs text-rose-600">Resend blocked for {blockCountdown}</p>}
                      </div>
                    )}
                  </div>
                </form>
              )}

              {(phase === 'reset' || phase === 'reset-token') && (
                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1">Confirm Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2">
                    <p className="font-semibold text-slate-700 mb-1">Password Requirements:</p>
                    <p className={hasLength ? 'text-green-600' : 'text-slate-500'}>✓ At least 8 characters</p>
                    <p className={hasUpper ? 'text-green-600' : 'text-slate-500'}>✓ One uppercase letter</p>
                    <p className={hasLower ? 'text-green-600' : 'text-slate-500'}>✓ One lowercase letter</p>
                    <p className={hasNumber ? 'text-green-600' : 'text-slate-500'}>✓ One number</p>
                    <p className={hasSpecial ? 'text-green-600' : 'text-slate-500'}>✓ One special character</p>
                    <p className={password && isMatch ? 'text-green-600 font-medium' : 'text-slate-500'}>✓ Passwords match</p>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white btn-primary disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                  </button>
                </form>
              )}

              <div className="text-center mt-4">
                <Link to="/member-forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  Go back to request OTP
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberResetPasswordPage;
