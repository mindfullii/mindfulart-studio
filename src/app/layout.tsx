import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Space_Mono } from 'next/font/google';
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4F46E5',
};

export const metadata: Metadata = {
  title: {
    default: "MindfulArt Studio",
    template: "%s | MindfulArt Studio",
  },
  description: "AI-powered mindful art creation platform for meditation, coloring, and visual art generation",
  keywords: ["mindfulness", "art", "meditation", "AI art", "coloring", "visual meditation"],
  authors: [{ name: "MindfulArt Studio" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mindfulart.studio",
    title: "MindfulArt Studio",
    description: "AI-powered mindful art creation platform",
    siteName: "MindfulArt Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindfulArt Studio",
    description: "AI-powered mindful art creation platform",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceMono.variable} font-body antialiased bg-[#F5F7F6]`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 