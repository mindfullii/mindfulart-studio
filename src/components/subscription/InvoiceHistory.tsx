'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui/Spinner';

interface Invoice {
  id: string;
  number: string;
  amount_paid: number;
  status: string;
  created: number;
  invoice_pdf: string;
  period_start: number;
  period_end: number;
}

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceHistoryModal({ isOpen, onClose }: InvoiceHistoryModalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading">Invoice History</h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="w-8 h-8" />
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <div key={invoice.id} className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-body">
                          {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                        </p>
                        <p className="text-sm text-text-secondary font-body">
                          Invoice #{invoice.number}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono">${formatAmount(invoice.amount_paid)}</span>
                        {invoice.invoice_pdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-text-secondary py-8">
                  No invoices found
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 