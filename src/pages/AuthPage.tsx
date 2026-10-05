import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { updateSettings, userSettings } = useApp();

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    if (isSignUp && !name) {
      setError('Please enter your name.');
      return;
    }

    if (isSignUp && name) {
      updateSettings({ name, email });
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Focus<span className="text-brand-600 dark:text-brand-400">Flow</span>
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isSignUp ? 'Create your student workspace' : 'Welcome back to FocusFlow'}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {isSignUp
            ? 'Start studying with intention and seamless task flow.'
            : 'Enter your credentials or try the 1-click evaluator demo.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-xl space-y-6">
          {/* Quick Evaluator Access Banner */}
          <div className="p-4 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-brand-950 dark:text-brand-200">
                  Recruitment Evaluation Mode
                </p>
                <p className="text-[11px] text-brand-700 dark:text-brand-400 mt-0.5">
                  Pre-configured with Alex Chen's study tasks, notes, and Pomodoro history.
                </p>
                <Button
                  onClick={handleDemoLogin}
                  variant="primary"
                  size="sm"
                  className="mt-3 w-full bg-brand-600 hover:bg-brand-700 text-white border-none shadow-xs"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Continue as Demo Student (Alex)
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 uppercase tracking-wider text-[10px]">
                Or log in with credentials
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="alex.chen@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              {isSignUp ? 'Create Student Account' : 'Sign In to Workspace'}
            </Button>
          </form>

          {/* Toggle login vs sign up */}
          <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account yet? Create one"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            ← Return to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
