'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthTab = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
}

interface FormData {
  email: string;
  password: string;
  name?: string;  // nickname
}

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // 注册请求
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || '注册失败');
        }

        // 显示成功消息
        toast.success(data.message);

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
        // 登录请求
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success('Welcome back!');
        onClose();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="flex">
          {/* Left: Form */}
          <div className="flex-1 p-8">
            {/* Tabs */}
            <div className="flex mb-8">
              <button
                className={`flex-1 py-2 text-center transition-colors relative ${
                  activeTab === 'signin'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-2 text-center transition-colors relative ${
                  activeTab === 'signup'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-secondary hover:text-primary'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form Container - 添加固定高度 */}
            <div className="h-[400px] flex flex-col">
              {/* Google Button */}
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => signIn('google')}
              >
                <Image
                  src="/icons/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-text-secondary">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        Nickname
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your nickname"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  {/* 占位空间 */}
                  <div className="flex-1 min-h-[40px]" />
                </div>

                {/* 底部固定部分 */}
                <div className="space-y-4">
                  {activeTab === 'signin' && (
                    <div className="flex justify-end h-6">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:text-primary/80"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : (activeTab === 'signin' ? 'Sign In' : 'Sign Up')}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative flex-1 hidden sm:block">
            <Image
              src="/images/auth/auth-bg.jpg"
              alt="Authentication"
              fill
              className="object-cover rounded-r-lg"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 