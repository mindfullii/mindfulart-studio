import { Gift } from 'lucide-react';

export function MembershipHeader() {
  return (
    <header className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 space-y-8">
          <h1 className="text-[2.8em] font-heading text-text-primary">
            Start your mindful
            <br />
            art journey today
          </h1>
          
          <p className="text-base font-body text-text-secondary">
            Begin with 10 free creations,
            <br />
            continue your journey as you wish
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Gift className="w-6 h-6 text-primary" />
            <span className="text-base font-body">
              New member gift: <span className="font-mono">10</span> free creations
            </span>
          </div>
        </div>
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl" />
        </div>
      </div>
    </header>
  );
} 
