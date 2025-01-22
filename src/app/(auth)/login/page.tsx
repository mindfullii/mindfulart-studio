'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type AuthTab = 'signin' | 'signup';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Get returnUrl from URL parameters
      const searchParams = new URLSearchParams(window.location.search);
      const returnUrl = searchParams.get('returnUrl') || '/';
      
      await signIn('google', {
        callbackUrl: returnUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-secondary/10">
            <button
              className={`flex-1 pb-4 text-center font-mono transition-colors relative ${
                activeTab === 'signin'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 pb-4 text-center font-mono transition-colors relative ${
                activeTab === 'signup'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-heading mb-2">
              {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-text-secondary font-body">
              {activeTab === 'signin' 
                ? 'Continue your mindful journey'
                : 'Start your mindful art journey today'}
            </p>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full justify-center font-mono"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-text-secondary font-mono">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <Input
              type="email"
              placeholder="Email address"
              className="font-mono"
            />
            <Input
              type="password"
              placeholder="Password"
              className="font-mono"
            />

            {activeTab === 'signin' && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-mono"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              className="w-full justify-center font-mono"
              disabled={isLoading}
            >
              {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative flex-1">
        <Image
          src="/images/auth/auth-bg.jpg"
          alt="Authentication"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 