'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Pagination } from '@/components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

interface CreditHistory {
  id: string;
  userId: string;
  amount: number;
  type: 'subscription' | 'purchase' | 'welcome' | 'USAGE';
  description: string;
  createdAt: Date;
}

export default function CreditsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [creditHistory, setCreditHistory] = useState<CreditHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCreditHistory();
  }, []);

  const fetchCreditHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/credits/history');
      if (response.ok) {
        const data = await response.json();
        console.log('Credit History Data:', data);
        setCreditHistory(data);
      }
    } catch (error) {
      console.error('Error fetching credit history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算总积分（所有获得的积分之和）
  const totalCredits = creditHistory.reduce((sum, record) => {
    if (record.type !== 'USAGE') {
      return sum + Math.abs(record.amount);
    }
    return sum;
  }, 0);

  // 计算剩余积分
  const remainingCredits = creditHistory.reduce((sum, record) => {
    if (record.type === 'USAGE') {
      return sum - Math.abs(record.amount); // 使用积分时减去
    }
    return sum + Math.abs(record.amount); // 获得积分时加上
  }, 0);

  // 计算分页
  const totalPages = Math.ceil(creditHistory.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedHistory = creditHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Container>
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 py-12 pl-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-serif mb-8">My Credits</h1>
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
                      <>
                        {paginatedHistory.map((record) => (
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
                              record.type === 'USAGE' ? 'text-red-500' : 'text-green-500'
                            }`}>
                              {record.type === 'USAGE' ? '-' : '+'}
                              {Math.abs(record.amount)}
                            </span>
                          </div>
                        ))}
                        {totalPages > 1 && (
                          <div className="mt-8 pt-4 border-t border-gray-100">
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </>
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
        </div>
      </div>
    </Container>
  );
} 