'use client';

import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceHistoryModal({ isOpen, onClose }: InvoiceHistoryModalProps) {
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

          <div className="space-y-4">
            {/* 这里可以添加发票列表 */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-body">February 2024</p>
                  <p className="text-sm text-text-secondary font-body">Monthly Plan</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono">$9.90</span>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 