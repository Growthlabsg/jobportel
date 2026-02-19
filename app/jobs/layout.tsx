'use client';

import { ReactNode } from 'react';
import { JobsNavigation } from '@/components/navigation/JobsNavigation';
import { CofounderProvider } from '@/contexts/CofounderContext';
import { FloatingChatButton } from '@/components/shared/FloatingChatButton';

export default function JobsLayout({ children }: { children: ReactNode }) {
  return (
    <CofounderProvider>
      <JobsNavigation />
      {children}
      <FloatingChatButton />
    </CofounderProvider>
  );
}

