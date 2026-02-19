import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { PlatformErrorBoundary } from '@/components/platform/ErrorBoundary';
import { EnvironmentChecker } from '@/components/platform/EnvironmentChecker';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F7377' },
    { media: '(prefers-color-scheme: dark)', color: '#0A5A5D' },
  ],
};

export const metadata: Metadata = {
  title: 'Growth Lab Jobs - Global Startup Community',
  description: 'Find your next startup job or hire top talent worldwide. We welcome applications from anywhere in the world.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GrowthLab Jobs',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen safe-area-padding`}>
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
