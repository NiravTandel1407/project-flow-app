import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useRegister } from '../hooks';
import { Logo } from '@/shared/components/ui/Logo';
import { Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  if (!isOpen) return null;

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    navigate(newMode === 'login' ? '/login' : '/register', { replace: true });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      await loginMutation.mutateAsync({ username: email, email, password });
      if (onClose) onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(
        error.response?.data?.detail || 'Incorrect email or password. Please try again.'
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Use and Privacy Policy.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email,
        password,
        full_name: fullName || undefined,
      });

      // Seamless auto-login right after registration
      try {
        await loginMutation.mutateAsync({ username: email, email, password });
        if (onClose) onClose();
      } catch {
        handleSwitchMode('login');
        setSuccessMessage('Account created successfully! Please sign in.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setErrorMessage(
        error.response?.data?.detail || 'Failed to create account. Email may already be in use.'
      );
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-[#101828]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Two-Section Modal Window (Same Size, Compact & Sleek Elements) */}
      <div className="relative w-full max-w-4xl lg:max-w-5xl md:h-[620px] md:min-h-[620px] bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] z-10 my-auto flex flex-col md:flex-row overflow-hidden max-h-[94vh]">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl text-[#98A2B3] hover:text-[#101828] hover:bg-[#F2F4F7] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT SECTION: Visual Brand Showcase (Sleek Proportions) */}
        <div className="hidden md:flex md:w-[44%] h-full bg-[#3B5BFF] text-white p-7 lg:p-9 flex-col justify-between overflow-y-auto select-none">
          {/* Brand Logo & Wordmark */}
          <div>
            <Logo variant="onBrand" size={34} showWordmark wordmarkSize="sm" />
          </div>

          {/* Mode-specific content */}
          <div className="my-auto py-4">
            {mode === 'login' ? (
              <div>
                {/* Visual Checklist Card */}
                <div className="flex flex-col gap-2.5 w-60 lg:w-64 p-4 bg-[#F3F5FF] rounded-2xl mb-6 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2EE6A6] flex items-center justify-center shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101828"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="h-2 w-[70%] rounded-md bg-[#101828]" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2EE6A6] flex items-center justify-center shrink-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101828"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="h-2 w-[55%] rounded-md bg-[#101828]" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border-2 border-[#3B5BFF] box-border shrink-0" />
                    <span className="h-2 w-[80%] rounded-md bg-[#C5CEF2]" />
                  </div>
                </div>

                <h2 className="text-2xl lg:text-[28px] font-bold leading-tight tracking-[-0.025em]">
                  Plan clearly.<br />Ship calmly.
                </h2>
                <p className="mt-3 text-xs lg:text-sm text-white/85 leading-relaxed max-w-[300px]">
                  Tasks, timelines and teammates in one place, so every project keeps moving.
                </p>
              </div>
            ) : (
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#101828] text-[#7CF2C8] text-[11px] font-semibold tracking-tight mb-4">
                  Join Project Flow
                </span>

                <h2 className="text-2xl lg:text-[28px] font-bold leading-tight tracking-[-0.025em]">
                  Your next project starts here.
                </h2>

                <div className="mt-5 flex flex-col gap-3 text-xs lg:text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#2EE6A6] flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101828"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="text-white/95">Boards, lists and timelines in one place</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#2EE6A6] flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101828"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="text-white/95">Invite your team in seconds</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#2EE6A6] flex items-center justify-center">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101828"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="text-white/95">See progress without another meeting</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-white/65">
            © 2026 Project Flow ·{' '}
            <a href="#" className="text-white hover:underline">
              Privacy
            </a>{' '}
            ·{' '}
            <a href="#" className="text-white hover:underline">
              Terms
            </a>
          </div>
        </div>

        {/* RIGHT SECTION: Interactive Form (Refined & Compact Components) */}
        <div className="flex-1 h-full bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
          {/* Mobile Logo Header */}
          <div className="flex md:hidden items-center justify-center mb-3">
            <Logo variant="primary" size={32} showWordmark wordmarkSize="sm" />
          </div>

          <div className="max-w-[340px] sm:max-w-[360px] w-full mx-auto my-auto py-1">
            <div className="mb-5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#101828]">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-1 text-xs text-[#667085]">
                {mode === 'login'
                  ? 'Log in to pick up where your team left off.'
                  : 'It takes less than a minute.'}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-3.5 flex items-center gap-2 p-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-3.5 flex items-center gap-2 p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="modal-email"
                    className="block mb-1 text-xs font-semibold text-[#344054]"
                  >
                    Email
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className="w-full h-[42px] px-3.5 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-xs sm:text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#9DB0FF] focus:border-[#3B5BFF] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-password"
                    className="block mb-1 text-xs font-semibold text-[#344054]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="modal-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full h-[42px] pl-3.5 pr-10 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-xs sm:text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#9DB0FF] focus:border-[#3B5BFF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-[#667085] hover:text-[#101828] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 text-[#475467] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D0D5DD] accent-[#3B5BFF] cursor-pointer"
                    />
                    <span>Keep me logged in</span>
                  </label>
                  <a
                    href="#"
                    className="font-medium text-[#3B5BFF] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[42px] rounded-xl bg-[#101828] text-white font-semibold text-xs sm:text-sm hover:bg-[#1d2939] focus:outline-none focus:ring-3 focus:ring-slate-300 transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer shadow-sm mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    'Log in'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="modal-name"
                    className="block mb-1 text-xs font-semibold text-[#344054]"
                  >
                    Full name
                  </label>
                  <input
                    id="modal-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full h-[42px] px-3.5 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-xs sm:text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#9DB0FF] focus:border-[#3B5BFF] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-reg-email"
                    className="block mb-1 text-xs font-semibold text-[#344054]"
                  >
                    Work email
                  </label>
                  <input
                    id="modal-reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    className="w-full h-[42px] px-3.5 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-xs sm:text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#9DB0FF] focus:border-[#3B5BFF] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modal-reg-password"
                    className="block mb-1 text-xs font-semibold text-[#344054]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="modal-reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      autoComplete="new-password"
                      className="w-full h-[42px] pl-3.5 pr-10 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-xs sm:text-sm placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#9DB0FF] focus:border-[#3B5BFF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-1 top-1 w-8 h-8 flex items-center justify-center text-[#667085] hover:text-[#101828] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-[#475467] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D0D5DD] accent-[#3B5BFF] cursor-pointer"
                    />
                    <span>
                      I agree to the{' '}
                      <a href="#" className="font-semibold text-[#101828] hover:text-[#3B5BFF]">
                        Terms
                      </a>{' '}
                      and{' '}
                      <a href="#" className="font-semibold text-[#101828] hover:text-[#3B5BFF]">
                        Privacy
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[42px] rounded-xl bg-[#101828] text-white font-semibold text-xs sm:text-sm hover:bg-[#1d2939] focus:outline-none focus:ring-3 focus:ring-slate-300 transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer shadow-sm mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    'Create account'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Switch Mode Footer */}
          <div className="pt-3 border-t border-[#F2F4F7] text-center text-xs text-[#667085]">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="font-bold text-[#101828] hover:text-[#3B5BFF] transition-colors cursor-pointer ml-1"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="font-bold text-[#101828] hover:text-[#3B5BFF] transition-colors cursor-pointer ml-1"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
