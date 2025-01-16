'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const name = formData.get('name') as string;

      // 1. 创建账户
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      // 2. 自动登录
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // 3. 跳转到仪表板
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-medium mb-6">Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="mt-1 w-full rounded-md border p-2"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full rounded-md border p-2"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                className="mt-1 w-full rounded-md border p-2"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </Container>
  );
} 