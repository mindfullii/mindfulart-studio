import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'wide';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6",
      size === 'default' && "max-w-7xl",
      size === 'wide' && "max-w-screen-2xl",
      className
    )}>
      {children}
    </div>
  );
} 