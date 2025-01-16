export const PLANS = {
  FREE_SOUL: {
    name: 'Free Soul',
    credits: 10,
    features: [
      'Commercial License',
      '10 creation credits to start'
    ]
  },
  PEACEFUL_MIND: {
    name: 'Peaceful Mind',
    monthlyPrice: 9.9,
    yearlyPrice: 99,
    credits: 150,
    features: [
      '150 credits monthly',
      'All creative spaces',
      'Save creation history',
      'Download in high resolution'
    ]
  }
} as const;

export type PlanType = keyof typeof PLANS; 