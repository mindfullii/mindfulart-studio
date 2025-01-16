'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

const CREDIT_OPTIONS = [
  { amount: 50, price: 4.99 },
  { amount: 100, price: 8.99 },
  { amount: 200, price: 15.99 },
];

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handlePurchase = async () => {
    if (!selectedAmount) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: selectedAmount }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to purchase credits');
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process purchase');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading">Buy Credits</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {CREDIT_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => setSelectedAmount(option.amount)}
                className={`w-full p-4 rounded-lg border ${
                  selectedAmount === option.amount
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-body">{option.amount} Credits</span>
                  <span className="font-mono">${option.price}</span>
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
              'Purchase Credits'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 