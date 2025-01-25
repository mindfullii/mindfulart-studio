'use client';

import { SignIn } from "@/components/auth/SignIn";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back to your creative space
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue your mindful coloring journey
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">✨</span>
                  Access your saved artworks
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📈</span>
                  Continue your creative journey
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎨</span>
                  Get new art recommendations
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⭐</span>
                  Use premium features
                </li>
              </ul>
            </div>
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
} 