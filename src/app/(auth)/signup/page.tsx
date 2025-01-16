'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-heading mb-2">Create your account</h1>
            <p className="text-text-secondary font-body">
              Start your mindful art journey today
            </p>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full justify-center font-mono"
              onClick={() => {/* Google sign up logic */}}
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

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary font-mono">
                  Or continue with email
                </span>
              </div>
            </div>
          </div>

          <form className="mt-6 space-y-6">
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

            <Button
              type="submit"
              className="w-full justify-center font-mono"
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary font-mono">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block relative flex-1">
        <Image
          src="/images/auth/signup-bg.jpg"
          alt="Sign Up"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
} 