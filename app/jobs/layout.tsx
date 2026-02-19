'use client';

import { ReactNode } from 'react';
import { JobsNavigation } from '@/components/navigation/JobsNavigation';
import { CofounderProvider } from '@/contexts/CofounderContext';
import { FloatingChatButton } from '@/components/shared/FloatingChatButton';

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <CofounderProvider>
      <JobsNavigation />
      {/* Content: mobile gets bottom padding so it clears the fixed bottom nav + safe area */}
      <main className="min-h-screen w-full mobile-bottom-safe">
        {children}
      </main>
      <FloatingChatButton />
    </CofounderProvider>
  );
}

