'use client';

import { useState } from 'react';
import { ChatOverlay } from './ChatOverlay';

interface ChatButtonProps {
  currentJobId?: string;
  currentApplicationId?: string;
  bottomOffset?: string; // For pages with mobile bottom nav
}

export function ChatButton({ 
  currentJobId, 
  currentApplicationId, 
  bottomOffset = 'bottom-6 sm:bottom-6' 
}: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount] = useState(4); // This would come from state/API

  return (
    <>
      {/* Chat Button */}
      <div className={`fixed right-4 ${bottomOffset} z-40`}>
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary-dark border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          aria-label="Open chats"
          title="Chats"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
        }}
        currentJobId={currentJobId}
        currentApplicationId={currentApplicationId}
      />
    </>
  );
}

