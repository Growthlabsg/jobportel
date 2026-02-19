import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { PlatformErrorBoundary } from '@/components/platform/ErrorBoundary';
import { EnvironmentChecker } from '@/components/platform/EnvironmentChecker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Growth Lab Jobs - Global Startup Community',
  description: 'Find your next startup job or hire top talent worldwide. We welcome applications from anywhere in the world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <EnvironmentChecker>
          <PlatformErrorBoundary>
            <QueryProvider>{children}</QueryProvider>
          </PlatformErrorBoundary>
        </EnvironmentChecker>
      </body>
    </html>
  );
}
