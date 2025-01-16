'use client';

import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSubscriptionModal({ isOpen, onClose, onConfirm }: CancelSubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Cancel Subscription</h3>
          <p className="text-text-secondary mb-4">
            Are you sure you want to cancel your subscription? You'll lose access to:
          </p>
          <ul className="list-disc list-inside mb-6 text-text-secondary">
            <li>150 monthly credits</li>
            <li>All creative spaces</li>
            <li>High resolution downloads</li>
            <li>Creation history</li>
          </ul>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Cancel Subscription
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 