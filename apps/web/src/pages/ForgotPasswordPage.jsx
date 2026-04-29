import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await apiServerClient.fetch('/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process request');
      }
      
      setSuccess(true);
      toast.success('If the email exists, a reset link has been sent.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password - Admin Portal</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 admin-theme px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl relative z-10">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h2>
              <p className="text-slate-600 mb-8">We've sent password reset instructions to your email address. The link expires in 1 hour.</p>
              <Link to="/admin-login" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</h2>
                <p className="mt-2 text-sm text-slate-500">Enter your admin email to receive reset instructions.</p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="admin@hacrolabs.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </button>
                
                <div className="text-center">
                  <Link to="/admin-login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
