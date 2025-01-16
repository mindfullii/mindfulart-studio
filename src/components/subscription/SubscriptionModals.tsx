'use client';

import { CancelSubscriptionModal } from './CancelSubscriptionModal';
import { BuyCreditsModal } from '../credits/BuyCreditsModal';

interface SubscriptionModalsProps {
  showCancelModal: boolean;
  showBuyModal: boolean;
  onCloseCancelModal: () => void;
  onCloseBuyModal: () => void;
  onConfirmCancel: () => void;
  onSelectBuyCredits: (amount: number) => void;
}

export function SubscriptionModals({
  showCancelModal,
  showBuyModal,
  onCloseCancelModal,
  onCloseBuyModal,
  onConfirmCancel,
  onSelectBuyCredits
}: SubscriptionModalsProps) {
  return (
    <>
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={onCloseCancelModal}
        onConfirm={onConfirmCancel}
      />

      <BuyCreditsModal
        isOpen={showBuyModal}
        onClose={onCloseBuyModal}
        onSelect={onSelectBuyCredits}
      />
    </>
  );
} 