'use client';

import { Session } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './AuthProvider';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
} 