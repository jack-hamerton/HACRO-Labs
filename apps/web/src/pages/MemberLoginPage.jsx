import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';

const MemberLoginPage = () => {
  const navigate = useNavigate();
  const { loginMember } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginMember(formData.identity, formData.password);
      toast.success('Login successful!');
      navigate('/member-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Member Login - HACRO Hub</title>
        <meta name="description" content="Log in to your HACRO Hub member account to access your dashboard." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20 sm:pt-24">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Member login</h1>
            <p className="text-muted-foreground">Access your member dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="form-section">
            <div className="space-y-6">
              <div>
                <label className="form-label">Email or phone number</label>
                <input
                  type="text"
                  name="identity"
                  value={formData.identity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Email or phone number"
                  required
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Link to="/member-forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

export default MemberLoginPage;

