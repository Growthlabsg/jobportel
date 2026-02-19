'use client';

import { ReactNode } from 'react';
import { JobsNavigation } from '@/components/navigation/JobsNavigation';
import { CofounderProvider } from '@/contexts/CofounderContext';
import { FloatingChatButton } from '@/components/shared/FloatingChatButton';

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <CofounderProvider>
      <JobsNavigation />
      {/* Content area: extra padding on mobile so it clears bottom nav and safe area */}
      <main className="pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <FloatingChatButton />
    </CofounderProvider>
  );
}

