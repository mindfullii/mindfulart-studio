'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  creditAmount?: number;
  createdAt: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/transactions/history');
        const data = await response.json();
        
        if (response.ok) {
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    }

    fetchTransactions();
  }, []);

  if (transactions.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction: Transaction) => (
        <div key={transaction.id} className="flex justify-between items-start">
          <div>
            <div className="font-mono">
              {transaction.type === 'SUBSCRIPTION_PAYMENT' 
                ? 'Monthly Subscription' 
                : 'Credits Purchase'}
            </div>
            <div className="text-sm text-text-secondary">
              {new Date(transaction.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            {transaction.creditAmount && (
              <div className="text-primary font-mono">
                +{transaction.creditAmount} credits
              </div>
            )}
            <div className="text-sm text-text-secondary font-mono">
              ${transaction.amount.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 