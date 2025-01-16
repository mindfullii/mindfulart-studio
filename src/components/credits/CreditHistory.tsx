'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';

interface Transaction {
  id: string;
  amount: number;
  credits: number;
  transactionType: string;
  createdAt: string;
}

export function CreditHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/credits/history');
        const data = await response.json();
        
        if (response.ok) {
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-text-secondary font-body">Loading...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-sm text-text-secondary font-body">No transaction history yet</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between py-3 border-b border-secondary/10 last:border-0"
        >
          <div>
            <div className="font-mono">Credits Purchase</div>
            <div className="text-sm text-text-secondary font-body">
              {formatDate(transaction.createdAt)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-primary font-mono">+{transaction.credits} credits</div>
            <div className="text-sm text-text-secondary font-mono">
              ${transaction.amount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 