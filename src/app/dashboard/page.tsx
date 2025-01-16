'use client';

import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { ArtworkGrid } from '@/components/dashboard/ArtworkGrid';

export default function DashboardPage() {
  return (
    <Container>
      <div className="py-12">
        <h1 className="text-3xl font-serif mb-8">Your Artworks</h1>
        <ArtworkGrid />
      </div>
    </Container>
  );
} 