import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-secondary/10 shadow-sm",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
} 