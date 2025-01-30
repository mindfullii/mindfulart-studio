import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface PricingCardProps {
  type: 'annual' | 'monthly' | 'enterprise';
  label: string;
  price?: string;
  perMonth?: string;
  isBestValue?: boolean;
  trial?: string;
  description?: string;
  ctaText?: string;
}

export function PricingCard({
  type,
  label,
  price,
  perMonth,
  isBestValue,
  trial,
  description,
  ctaText = "Start your free trial",
}: PricingCardProps) {
  const isEnterprise = type === 'enterprise';

  return (
    <div 
      className={cn(
        "relative border-2 rounded-xl p-6",
        isBestValue ? "border-primary bg-primary/5" : "border-gray-200",
        isEnterprise ? "bg-gray-50" : ""
      )}
    >
      {isBestValue && (
        <div className="absolute -top-3 left-6">
          <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
            Best value
          </span>
        </div>
      )}

      <div>
        <h3 className="text-[1.5em] font-subheading">{label}</h3>
        {!isEnterprise ? (
          <>
            <div className="text-[1.8em] font-mono font-bold mt-2">{price}</div>
            <div className="text-base font-mono text-text-secondary">{perMonth}</div>
          </>
        ) : (
          <p className="text-base font-body text-text-secondary mt-2">{description}</p>
        )}
      </div>

      <div className="mt-6">
        <Button 
          className="w-full font-mono text-base"
          variant={isEnterprise ? "outline" : "default"}
          asChild
        >
          <a href={isEnterprise ? "/contact" : "/login"}>{ctaText}</a>
        </Button>
      </div>
    </div>
  );
} 
