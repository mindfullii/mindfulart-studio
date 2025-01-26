'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // 处理注册
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error('Registration failed');
        }

        // 注册成功后自动登录
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        onClose();
      } else {
        // 处理登录
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          {/* Left column */}
          <div className="bg-background px-8 pt-[70px] pb-8 min-h-[500px] flex flex-col">
            <div className="mb-4">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-2xl font-heading mb-4">Join us to create your artwork</h2>
            <p className="text-text-secondary mb-6">Sign in to unlock the full creative experience:</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <span className="text-amber-500">✨</span>
                <span>Save your mindful artworks</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500">📝</span>
                <span>Track your creative journey</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">🎨</span>
                <span>Get personalized recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">⭐</span>
                <span>Access premium features</span>
              </li>
            </ul>
          </div>

          {/* Right column */}
          <div className="px-8 pt-[60px] pb-8 flex flex-col min-h-[500px]">
            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={`pb-2 px-4 transition-colors ${
                  activeTab === 'signin'
                    ? 'border-b-2 border-[#6DB889] text-[#6DB889]'
                    : 'text-gray-500'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`pb-2 px-4 transition-colors ${
                  activeTab === 'signup'
                    ? 'border-b-2 border-[#6DB889] text-[#6DB889]'
                    : 'text-gray-500'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg px-4 py-2 border border-gray-200 transition-colors"
                >
                  <img
                    src="/icons/google.svg"
                    alt="Google"
                    className="w-4 h-4"
                  />
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="h-[160px] transition-all duration-200 ease-in-out">
                  <form onSubmit={handleSubmit} className="space-y-2.5">
                    {activeTab === 'signup' && (
                      <Input
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    )}
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    
                    {activeTab === 'signin' && (
                      <div className="flex justify-end">
                        <Link 
                          href="/forgot-password"
                          className="text-sm text-[#6DB889] hover:text-[#5CA978] transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#6DB889] hover:bg-[#5CA978] text-white font-medium rounded-lg px-4 py-2 transition-colors mt-2"
                    >
                      {isLoading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 