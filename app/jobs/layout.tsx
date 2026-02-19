'use client';

import { ReactNode } from 'react';
import { JobsNavigation } from '@/components/navigation/JobsNavigation';
import { CofounderProvider } from '@/contexts/CofounderContext';
import { FloatingChatButton } from '@/components/shared/FloatingChatButton';

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <CofounderProvider>
      <JobsNavigation />
      {/* Content: on mobile add padding so content clears sticky header + bottom nav + safe area */}
      <main className="jobs-main-content min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <FloatingChatButton />
    </CofounderProvider>
  );
}

