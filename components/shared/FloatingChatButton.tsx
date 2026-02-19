'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UnifiedChat, ChatType } from './UnifiedChat';
import { useConversations } from '@/hooks/useMessaging';
import { useCofounder } from '@/contexts/CofounderContext';

interface FloatingChatButtonProps {
  chatType?: ChatType;
  conversationId?: string | null;
  participantName?: string;
  participantAvatar?: string;
  contextData?: {
    jobId?: string;
    applicationId?: string;
    projectId?: string;
    proposalId?: string;
    cofounderProfileId?: string;
    teamId?: string;
  };
}

export function FloatingChatButton({
  chatType = 'direct',
  conversationId = null,
  participantName,
  participantAvatar,
  contextData,
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: conversations = [] } = useConversations();
  const { conversations: cofounderConversations = [] } = useCofounder();
  
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) +
    cofounderConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 fab-above-bottom-nav md:right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl z-[40] md:z-30 flex items-center justify-center p-0 min-h-[56px] min-w-[56px]"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </Button>

      <UnifiedChat
        conversationId={conversationId}
        chatType={chatType}
        participantName={participantName || 'Chat'}
        participantAvatar={participantAvatar}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contextData={contextData}
      />
    </>
  );
}

