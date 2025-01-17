'use client';

import { Subscription } from '@prisma/client';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Billing period</p>
          <p>{subscription.billingCycle}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Next renewal</p>
          <p>Auto-renews</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p>{subscription.status}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="text-primary hover:underline">
          View Invoices
        </button>
        <CancelSubscriptionModal />
      </div>
    </div>
  );
} 