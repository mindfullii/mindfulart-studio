import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-subtle">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-heading mb-2">Email Verified Successfully!</h1>
          <p className="text-text-secondary font-body mb-6">
            Your email has been verified. You can now enjoy all features of MindfulArt Studio.
          </p>
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 