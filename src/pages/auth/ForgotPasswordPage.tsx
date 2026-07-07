import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Compass, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';

export default function ForgotPasswordPage() {
  const { sendPasswordReset, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const { ok, error: resetError } = await sendPasswordReset(email);
    if (ok) {
      setSent(true);
    } else {
      setError(resetError ?? 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900">ExploreX</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Reset Password</h1>
            <p className="text-slate-500 text-sm">
              We'll send you an email link to restore access to your account.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm leading-relaxed">
                📬 Reset email sent! Please check your inbox and spam folder for instructions to change your password.
              </div>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" variant="gradient" className="w-full" loading={loading}>
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-slate-500 hover:text-slate-800 text-sm font-medium inline-flex items-center gap-1.5">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
