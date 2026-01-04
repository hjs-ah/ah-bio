
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { verifyPassword } from '@/lib/storage';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Welcome back!",
          description: "Logged in successfully.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password.",
          variant: "destructive"
        });
      }
    } catch (error) {
       console.error(error);
       toast({ title: "Error", description: "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--bg-page)] text-[var(--text-primary)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>

        <div className="bg-[var(--bg-card)] p-8 rounded-xl shadow-lg border border-[var(--border)]">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[var(--bg-page)] rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-[var(--text-primary)]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
          <p className="text-center text-[var(--text-secondary)] text-sm mb-6">Enter your password to access dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-[var(--bg-page)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[var(--text-primary)] text-[var(--bg-page)] font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center">
             <span className="text-xs text-[var(--text-muted)]">Default: admin123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
