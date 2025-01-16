import type { Metadata } from "next";
import { Inter, Space_Mono } from 'next/font/google';
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });
const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono'
});

export const metadata: Metadata = {
  title: "MindfulArt Studio",
  description: "AI-powered mindful art creation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceMono.variable}`}>
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
} 