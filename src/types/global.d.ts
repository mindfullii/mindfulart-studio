declare module 'clsx' {
  function clsx(...args: any[]): string;
  export = clsx;
}

declare module '@radix-ui/react-hover-card' {
  import * as React from 'react';
  export const Root: React.FC<any>;
  export const Trigger: React.FC<any>;
  export const Content: React.FC<any>;
}

declare module '@radix-ui/react-dialog' {
  import * as React from 'react';
  export const Root: React.FC<any>;
  export const Portal: React.FC<any>;
  export const Overlay: React.FC<any>;
  export const Content: React.FC<any>;
  export const Title: React.FC<any>;
}

declare module 'tailwind-merge' {
  export function twMerge(...args: string[]): string;
} 