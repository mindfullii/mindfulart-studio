'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';

interface CreditHistory {
  id: string;
  userId: string;
  amount: number;
  type: 'subscription' | 'purchase' | 'welcome' | 'used';
  description: string;
  createdAt: Date;
}

export default function CreditsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [creditHistory, setCreditHistory] = useState<CreditHistory[]>([]);

  useEffect(() => {
    fetchCreditHistory();
  }, []);

  const fetchCreditHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/credits/history');
      if (response.ok) {
        const data = await response.json();
        setCreditHistory(data);
      }
    } catch (error) {
      console.error('Error fetching credit history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算总积分和剩余积分
  const totalCredits = creditHistory.reduce((sum, record) => {
    if (record.type !== 'used') {
      return sum + record.amount;
    }
    return sum;
  }, 0);

  const usedCredits = creditHistory.reduce((sum, record) => {
    if (record.type === 'used') {
      return sum + Math.abs(record.amount);
    }
    return sum;
  }, 0);

  const remainingCredits = totalCredits - usedCredits;

  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-heading mb-8">My Credits</h1>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-heading mb-2">Total Credits</h3>
                <p className="text-3xl font-mono">{totalCredits}</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading mb-2">Remaining Credits</h3>
                <p className="text-3xl font-mono">{remainingCredits}</p>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading mb-2">Need More Credits?</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Subscribe to get monthly or annual credits
                </p>
                <Button 
                  className="w-full"
                  onClick={() => router.push('/subscription')}
                >
                  Subscribe Now
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-heading mb-6">Credit History</h2>
              <div className="space-y-4">
                {creditHistory.length > 0 ? (
                  creditHistory.map((record) => (
                    <div
                      key={record.id}
                      className="flex justify-between items-center py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-body">{record.description}</p>
                        <p className="text-sm text-text-secondary">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`font-mono ${
                        record.type === 'used' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {record.type === 'used' ? '-' : '+'}
                        {Math.abs(record.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-8">
                    No credit history found
                  </p>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </Container>
  );
} 