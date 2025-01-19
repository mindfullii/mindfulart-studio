'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: FormEvent) => {
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
        <div className="grid grid-cols-2">
          {/* Form Section */}
          <div className="p-6 flex flex-col min-h-[600px]">
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="flex space-x-4 border-b mb-6">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`pb-2 ${
                    activeTab === 'signin'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`pb-2 ${
                    activeTab === 'signup'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Social Login */}
              <div className="mb-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn('google')}
                >
                  <GoogleIcon className="mr-2" />
                  Continue with Google
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                  {activeTab === 'signup' && (
                    <div className="space-y-2">
                      <label htmlFor="name">Name</label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* 底部固定部分 */}
                <div className="space-y-4 mt-auto pt-4">
                  {activeTab === 'signin' && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {/* 处理忘记密码 */}}
                        className="font-space-mono text-[14px] tracking-[0.02em] text-primary hover:text-primary/90"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? 'Loading...'
                      : activeTab === 'signin'
                      ? 'Sign In'
                      : 'Sign Up'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative">
            <Image
              src="/images/auth/auth-bg.jpg"
              alt="Authentication visual"
              className="object-cover"
              fill
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 