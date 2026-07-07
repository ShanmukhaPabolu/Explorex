import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Compass, Github, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Divider } from '../../components/ui';

export default function SignupPage() {
  const { signup, loginWithGoogle, loginWithGitHub, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please accept the terms of service.'); return; }
    const { ok, error: authError } = await signup(form.name, form.email, form.password);
    if (ok) {
      // Supabase sends a confirmation email by default
      setEmailSent(true);
    } else {
      setError(authError ?? 'Sign up failed. Please try again.');
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github') => {
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

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400'];

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Check your email!</h1>
          <p className="text-slate-500 mb-2">
            We've sent a confirmation link to <strong>{form.email}</strong>.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Click the link in the email to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&h=1200&fit=crop" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white">ExploreX</span>
          </Link>
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Your Adventure<br />Starts Here
            </h2>
            <div className="space-y-4">
              {[
                { icon: '✍️', text: 'Write and share travel blogs with a global audience' },
                { icon: '🤖', text: 'Use AI to plan perfect trips within your budget' },
                { icon: '🏆', text: 'Join sports communities and earn achievement badges' },
                { icon: '🌍', text: 'Discover hidden gems recommended by real travelers' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-white/80 text-sm">{item.text}</p>
                </div>
              ))}
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
              <h1 className="text-2xl font-black text-slate-900 mb-1">Create your account</h1>
              <p className="text-slate-500">Free forever · No credit card required</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                id="btn-google-signup"
                onClick={() => handleSocialSignup('google')}
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
                id="btn-github-signup"
                onClick={() => handleSocialSignup('github')}
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

            <Divider text="or sign up with email" />

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input label="Full name" type="text" placeholder="Alex Morgan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} icon={<User className="w-4 h-4" />} />
              <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} icon={<Mail className="w-4 h-4" />} />

              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-9 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-slate-200'}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-2">{strengthLabels[strength]}</span>
                  </div>
                )}
              </div>

              <Input label="Confirm password" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} icon={<CheckCircle className={`w-4 h-4 ${form.confirm && form.confirm === form.password ? 'text-green-500' : ''}`} />} />

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-600 leading-relaxed">
                  I agree to ExploreX's{' '}
                  <Link to="/terms" className="text-primary-600 font-medium hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-600 font-medium hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="gradient" className="w-full" loading={loading}>
                Create My Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
