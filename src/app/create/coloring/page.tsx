'use client';

import { ColoringGenerator } from '@/components/coloring/ColoringGenerator';

export default function ColoringPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create Coloring Page</h1>
      <ColoringGenerator />
    </main>
  );
} 