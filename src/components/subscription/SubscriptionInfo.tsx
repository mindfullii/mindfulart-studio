'use client';

import { Subscription } from '@prisma/client';
import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const router = useRouter();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
      case 'canceled':
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  const handleResubscribe = () => {
    router.push('/subscription?resubscribe=true');
  };

  return (
    <Card className="p-8 bg-white shadow-sm border border-border/50">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-heading mb-2">Current Plan</h2>
          <p className="text-text-secondary/80">
            {subscription.billingCycle === 'monthly' ? 'Monthly' : 'Annual'} Plan
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-text-secondary/70 mb-2">Status</div>
          <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadgeClass(subscription.status)}`}
          >
            {subscription.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8 bg-gray-50/50 p-6 rounded-lg">
        <div>
          <div className="text-sm text-text-secondary/70 mb-2">Start Date</div>
          <div className="font-mono text-lg">{formatDate(subscription.startDate)}</div>
        </div>
        <div>
          <div className="text-sm text-text-secondary/70 mb-2">
            {subscription.status === 'canceled' ? 'End Date' : 'Next Billing Date'}
          </div>
          <div className="font-mono text-lg">
            {formatDate(subscription.endDate || new Date(subscription.startDate).setMonth(
              new Date(subscription.startDate).getMonth() + 1
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border/30">
        <Button 
          variant="outline" 
          size="lg"
          className="text-text-secondary hover:bg-gray-50"
          onClick={() => {/* TODO: Show invoice history */}}
        >
          View Invoices
        </Button>
        {subscription.status === 'active' ? (
          <CancelSubscriptionModal />
        ) : (
          <Button 
            onClick={handleResubscribe}
            size="lg"
            className="bg-primary text-white hover:bg-primary/90"
          >
            Resubscribe
          </Button>
        )}
      </div>
    </Card>
  );
} 