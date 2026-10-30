import React from 'react';
import { AuthModal } from '../components/AuthModal';
import { Logo } from '@/shared/components/ui/Logo';

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#EEF1F9] flex flex-col justify-between overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF1F9] via-[#F8F9FD] to-[#DDE4F7] -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B5BFF]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Background Brand Watermark */}
      <header className="p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo variant="primary" size={40} showWordmark wordmarkSize="sm" />
      </header>

      {/* Centered Modal */}
      <AuthModal isOpen={true} initialMode="login" />

      {/* Footer */}
      <footer className="p-8 text-center text-xs text-[#667085]">
        © 2026 Project Flow · Plan clearly. Ship calmly.
      </footer>
    </div>
  );
};

export default LoginPage;
