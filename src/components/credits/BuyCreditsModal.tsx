'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

type CreditOption = {
  credits: number;
  hours: string;
  price: number;
};

const creditPackages = [
  {
    name: '1 Hour',
    credits: 100,
    price: 4.00,
  },
  {
    name: '2 Hours',
    credits: 250,
    price: 8.00,
  },
  {
    name: '5 Hours',
    credits: 600,
    price: 20.00,
  },
  {
    name: '12 Hours',
    credits: 1500,
    price: 48.00,
  }
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (amount: number) => void;
};

export function BuyCreditsModal({ isOpen, onClose, onSelect }: Props) {
  const [selectedOption, setSelectedOption] = useState<CreditOption | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Buy more Credits</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          Select amount of Credits
        </p>
        <p className="text-xs text-gray-500 mb-6">
          You will be asked to confirm your purchase at the next step.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {creditPackages.map((option) => (
            <button
              key={option.credits}
              onClick={() => setSelectedOption(option)}
              className={`p-4 border rounded-lg text-center transition-colors
                ${selectedOption?.credits === option.credits
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
                }`}
            >
              <div className="text-sm font-medium mb-1">{option.hours}</div>
              <div className="text-primary text-lg font-medium">
                ${option.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">{option.credits} credits</div>
            </button>
          ))}
        </div>

        <Button
          className="w-full"
          disabled={!selectedOption}
          onClick={() => selectedOption && onSelect(selectedOption.credits)}
        >
          {selectedOption
            ? `Buy ${selectedOption.credits} credits for $${selectedOption.price.toFixed(2)}`
            : 'Select an amount'
          }
        </Button>
      </div>
    </div>
  );
} 