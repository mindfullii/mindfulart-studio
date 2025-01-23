'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Spinner';

const CREDIT_OPTIONS = [
  { amount: 100, price: 4.00, hours: '1 Hour' },
  { amount: 250, price: 8.00, hours: '2 Hours' },
  { amount: 600, price: 20.00, hours: '5 Hours' },
  { amount: 1500, price: 48.00, hours: '12 Hours' },
];

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!selectedAmount) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits: selectedAmount }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate purchase');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error('Failed to process purchase');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Credits</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-text-secondary mb-6">
            Select amount of Credits. You will be asked to confirm your purchase at the next step.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {CREDIT_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => setSelectedAmount(option.amount)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedAmount === option.amount
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="font-heading mb-1">{option.hours}</div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-text-secondary">{option.amount} credits</span>
                  <span className="font-mono">${option.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            disabled={!selectedAmount || isLoading}
            onClick={handlePurchase}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>Processing...</span>
              </div>
            ) : (
              `Buy ${selectedAmount || 0} credits for $${
                CREDIT_OPTIONS.find(opt => opt.amount === selectedAmount)?.price.toFixed(2) || '0.00'
              }`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 