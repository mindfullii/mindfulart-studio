import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesGrid } from '@/components/home/FeaturesGrid';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesGrid />
      {/* 其他部分... */}
    </main>
  );
}
