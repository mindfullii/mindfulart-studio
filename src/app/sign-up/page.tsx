'use client';

import { SignUp } from "@/components/auth/SignUp";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Join us to create your artwork
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign up to unlock the full creative experience
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">✨</span>
                  Save your mindful artworks
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📈</span>
                  Track your creative journey
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎨</span>
                  Get personalized recommendations
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⭐</span>
                  Access premium features
                </li>
              </ul>
            </div>
          </div>

          <SignUp />
        </div>
      </div>
    </div>
  );
} 