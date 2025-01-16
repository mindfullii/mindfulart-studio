'use client';

import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function SubscriptionPage() {
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-heading mb-2">Manage Subscription</h1>
      <p className="text-text-secondary mb-8">Manage your plan and credits</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Usage Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-heading mb-6">Usage Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Remaining credits:</span>
              <span className="font-medium">10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Monthly credits:</span>
              <span className="font-medium">150</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Next renewal:</span>
              <span className="font-medium">{formatDate(new Date('2024-02-14'))}</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-6"
          >
            Buy additional credits
          </Button>

          <h3 className="text-lg font-heading mt-8 mb-4">Recent Transactions</h3>
          <p className="text-text-secondary text-sm">No transactions yet</p>
        </div>

        {/* Subscription Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-heading mb-6">Subscription Management</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading">Current Plan</h3>
              <span className="text-primary font-medium">$9.9/month</span>
            </div>
            <p className="text-sm text-text-secondary">
              Your next billing date is {formatDate(new Date('2024-02-14'))}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Cancel Subscription
          </Button>
          <p className="text-xs text-text-secondary text-center mt-2">
            You'll continue to have access until the end of your billing period
          </p>
        </div>
      </div>
    </div>
  );
} 