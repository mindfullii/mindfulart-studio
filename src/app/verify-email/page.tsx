'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

type VerificationStatus = 'verifying' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setError('Verification token is missing');
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
      } catch (error) {
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-subtle">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-heading mb-2">Verifying your email</h1>
              <p className="text-text-secondary font-body">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/icons/check.svg"
                  alt="Success"
                  width={24}
                  height={24}
                />
              </div>
              <h1 className="text-2xl font-heading mb-2">Email verified!</h1>
              <p className="text-text-secondary font-body mb-6">
                Thank you for verifying your email address. You can now access all features.
              </p>
              <Button asChild>
                <Link href="/">Go to Homepage</Link>
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/icons/error.svg"
                  alt="Error"
                  width={24}
                  height={24}
                />
              </div>
              <h1 className="text-2xl font-heading mb-2">Verification failed</h1>
              <p className="text-text-secondary font-body mb-2">{error}</p>
              <p className="text-text-secondary font-body mb-6">
                Please try verifying your email again or request a new verification link.
              </p>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button
                  asChild
                  className="w-full"
                >
                  <Link href="/resend-verification">
                    Request New Link
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 