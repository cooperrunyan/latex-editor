'use client';

import { useRouter } from 'next/navigation';

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { MathJaxContext } from 'better-react-mathjax'

interface ProvidersProps {
  children: React.ReactNode;
  className?: string;
}

export function Providers({ children, className }: ProvidersProps) {
  const router = useRouter();

  return (
    <MathJaxContext config={{options: {enableMenu: false, svg: {displayIndent: '10em'}}}}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <HeroUIProvider navigate={router.push} className={className}>
          {children}
        </HeroUIProvider>
      </ThemeProvider>
    </MathJaxContext>
  );
}
