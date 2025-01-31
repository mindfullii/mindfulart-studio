'use client';

import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { ArtworkGrid } from '@/components/dashboard/ArtworkGrid';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardPage() {
  return (
    <Container>
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 py-12">
          <h1 className="text-3xl font-serif mb-8">Your Artworks</h1>
          <ArtworkGrid />
        </div>
      </div>
    </Container>
  );
} 