import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="py-8 border-t border-secondary/10">
      <Container size="wide">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            © 2025 MindfulArt Studio. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link 
              href="/privacy" 
              className="text-sm text-text-secondary hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-text-secondary hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
} 