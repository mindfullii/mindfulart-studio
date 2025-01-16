'use client';

import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface Transaction {
  id: string;
  type: 'subscription' | 'purchase' | 'bonus';
  amount: number;
  date: Date;
  description: string;
}

export default function CreditsPage() {
  // 这些数据之后会从 API 获取
  const credits = {
    total: 160,
    remaining: 10,
    breakdown: {
      subscription: 150,
      purchased: 0,
      bonus: 10
    }
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'subscription',
      amount: 150,
      date: new Date('2024-01-14'),
      description: 'Monthly subscription credits'
    },
    {
      id: '2',
      type: 'bonus',
      amount: 10,
      date: new Date('2024-01-14'),
      description: 'Welcome bonus'
    }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-heading mb-2">My Credits</h1>
      <p className="text-text-secondary mb-8">Manage and track your credits</p>

      {/* Credits Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-text-secondary text-sm mb-2">Total Credits</h3>
          <p className="text-3xl font-medium text-primary">{credits.total}</p>
          <div className="mt-2 space-y-1 text-sm text-text-secondary">
            <p>Subscription: {credits.breakdown.subscription}</p>
            <p>Purchased: {credits.breakdown.purchased}</p>
            <p>Bonus: {credits.breakdown.bonus}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-text-secondary text-sm mb-2">Remaining Credits</h3>
          <p className="text-3xl font-medium">{credits.remaining}</p>
          <p className="mt-2 text-sm text-text-secondary">
            Next renewal on {formatDate(new Date('2024-02-14'))}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-text-secondary text-sm mb-2">Need More Credits?</h3>
          <Button className="w-full">
            Buy Additional Credits
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-heading mb-6">Transaction History</h2>
        
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-text-secondary">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">+{transaction.amount}</p>
                  <p className="text-xs text-text-secondary capitalize">
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-sm">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
} 