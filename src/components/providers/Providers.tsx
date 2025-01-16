'use client';

import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './AuthProvider';

export function Providers({
  children,
  locale,
  messages
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
} 