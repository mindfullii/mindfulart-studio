'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

      {/* 个人信息 */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md border ${
                isEditing 
                  ? 'border-red-200 text-red-600 hover:bg-red-50'
                  : 'border-secondary/20 text-text-secondary hover:bg-secondary/5'
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue={session?.user?.name || ''}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md bg-gray-50"
                defaultValue={session?.user?.email || ''}
                disabled
              />
              <p className="mt-1 text-sm text-text-secondary">
                Email cannot be changed
              </p>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </Card>

      {/* 偏好设置 */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Theme
              </label>
              <select className="w-full p-2 border rounded-md">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-text-secondary">
                  Receive updates about your account and new features
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* 账户安全 */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Account Security</h2>
          <button
            className="px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50"
          >
            Delete Account
          </button>
          <p className="mt-2 text-sm text-text-secondary">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
      </Card>
    </div>
  );
} 