import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Compass, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Divider } from '../../components/ui';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithGitHub, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    const { ok, error: authError } = await login(form.email, form.password);
    if (ok) navigate('/dashboard');
    else setError(authError ?? 'Invalid credentials. Please try again.');
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    setSocialLoading(provider);
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithGitHub();
      // OAuth redirects the browser — no further action needed here
    } catch {
      setError('OAuth sign-in failed. Please try again.');
      setSocialLoading(null);
    }
  };

  const demoLogin = () => {
    setForm({ email: 'demo@explorex.app', password: 'demo123456' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&h=1200&fit=crop" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">ExploreX</span>
          </Link>
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Every Journey<br />Deserves a Story
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Join over 128,000 travelers and sports enthusiasts sharing their experiences with the world.
            </p>
            <div className="flex items-center gap-3">
              {['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="w-10 h-10 rounded-full ring-2 ring-white/50 object-cover" style={{ marginLeft: i > 0 ? '-12px' : 0 }} />
              ))}
              <span className="text-white/80 text-sm font-medium ml-2">+12K this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900">ExploreX</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back!</h1>
              <p className="text-slate-500">Sign in to continue your adventures</p>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                id="btn-google-login"
                onClick={() => handleSocialLogin('google')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === 'google' ? (
                  <svg className="w-4 h-4 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Google
              </button>
              <button
                id="btn-github-login"
                onClick={() => handleSocialLogin('github')}
                disabled={!!socialLoading || loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === 'github' ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <Github className="w-4 h-4" />
                )}
                GitHub
              </button>
            </div>

            <Divider text="or continue with email" />

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                icon={<Mail className="w-4 h-4" />}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary-600 font-medium hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" variant="gradient" className="w-full" loading={loading}>
                Sign in to ExploreX
              </Button>

              <button type="button" onClick={demoLogin} className="w-full py-2.5 text-sm text-slate-500 hover:text-primary-600 transition-colors font-medium">
                🚀 Fill demo credentials
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
