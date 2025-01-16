export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'annual';
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'annual';
  startDate: Date;
  endDate?: Date | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
} 