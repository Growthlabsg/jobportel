/**
 * React Query hooks for messaging
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getMessages,
  sendMessage,
  uploadChatFile,
  uploadVoiceMessage,
  scheduleMeeting,
  markMessagesAsRead,
  type Message,
  type Conversation,
  type MessageAttachment,
  type ScheduledMeeting,
} from '@/services/platform/messaging';

// Re-export types for convenience
export type { Message, Conversation, MessageAttachment, ScheduledMeeting };

/**
 * Get conversations
 */
export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled: typeof window !== 'undefined',
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Get messages for a conversation
 */
export function useMessages(conversationId: string | null, enabled = true) {
  return useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: () => conversationId ? getMessages(conversationId) : [],
    enabled: typeof window !== 'undefined' && enabled && !!conversationId,
    staleTime: 10000, // 10 seconds
  });
}

/**
 * Send message mutation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      attachments,
    }: {
      conversationId: string;
      content: string;
      attachments?: MessageAttachment[];
    }) => sendMessage(conversationId, content, attachments),
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/**
 * Upload file mutation
 */
export function useUploadFile() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: 'image' | 'file' }) =>
      uploadChatFile(file, type),
  });
}

/**
 * Upload voice message mutation
 */
export function useUploadVoiceMessage() {
  return useMutation({
    mutationFn: ({ audioBlob, duration }: { audioBlob: Blob; duration: number }) =>
      uploadVoiceMessage(audioBlob, duration),
  });
}

/**
 * Schedule meeting mutation
 */
export function useScheduleMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      meetingData,
    }: {
      conversationId: string;
      meetingData: {
        title: string;
        scheduledAt: string;
        duration: number;
        meetingLink?: string;
        notes?: string;
      };
    }) => scheduleMeeting(conversationId, meetingData),
    onSuccess: (data, variables) => {
      // Invalidate messages to show meeting message
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

/**
 * Mark messages as read mutation
 */
export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
    }) => markMessagesAsRead(conversationId, messageIds),
    onSuccess: (data, variables) => {
      // Invalidate conversations to update unread count
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
    },
  });
}

