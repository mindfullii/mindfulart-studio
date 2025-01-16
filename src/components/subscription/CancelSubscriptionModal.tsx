'use client';

import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading">Cancel Subscription</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-text-secondary font-body mb-4">
              Are you sure you want to cancel your subscription? You will:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="text-sm text-text-secondary font-body">
                • Lose access to premium features
              </li>
              <li className="text-sm text-text-secondary font-body">
                • Keep access until the end of your billing period
              </li>
              <li className="text-sm text-text-secondary font-body">
                • Can resubscribe at any time
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
            >
              Cancel Subscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 