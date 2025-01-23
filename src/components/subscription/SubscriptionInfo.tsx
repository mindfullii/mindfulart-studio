'use client';

import { useState } from 'react';
import { Subscription } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { toast } from 'sonner';

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast.success('Subscription cancelled successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to cancel subscription');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <>
      <Card className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-heading mb-2">Current Plan</h2>
            <p className="text-text-secondary">
              {subscription.plan}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-text-secondary mb-2">Status</div>
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              subscription.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {subscription.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-sm text-text-secondary mb-2">Start Date</div>
            <div className="font-mono">{formatDate(subscription.startDate)}</div>
          </div>
          <div>
            <div className="text-sm text-text-secondary mb-2">
              {subscription.status === 'active' ? 'Next Billing Date' : 'End Date'}
            </div>
            <div className="font-mono">
              {formatDate(subscription.endDate || subscription.startDate)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setShowInvoiceDialog(true)}
          >
            View Invoices
          </Button>
          {subscription.status === 'active' && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-text-secondary mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6 text-text-secondary">
              <li>Monthly/Annual credits</li>
              <li>Priority support</li>
              <li>Advanced features</li>
            </ul>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice History Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice History</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              {/* We'll implement invoice fetching later */}
              <p className="text-center text-text-secondary py-8">
                Invoice history will be available soon
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 