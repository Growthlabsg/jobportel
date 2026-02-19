/**
 * Messaging API Service
 * Handles chat messages, file uploads, voice messages, and real-time updates
 */

import { getAuthToken } from './auth';

const MAIN_PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL || 'http://localhost:3001';
const MESSAGING_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/messaging`;
const UPLOAD_ENDPOINT = `${MAIN_PLATFORM_BASE_URL}/api/upload`;

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: MessageAttachment[];
  type?: 'text' | 'voice' | 'video-call' | 'audio-call';
  meetingLink?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'voice' | 'video';
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
  duration?: number;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  projectId?: string;
  projectTitle?: string;
}

export interface ScheduledMeeting {
  id: string;
  conversationId: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  notes?: string;
  participants: string[];
}

/**
 * Upload file for chat attachment
 */
export async function uploadChatFile(file: File, type: 'image' | 'file'): Promise<MessageAttachment | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${UPLOAD_ENDPOINT}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error uploading file:', error);
    }
    return null;
  }
}

/**
 * Upload voice message
 */
export async function uploadVoiceMessage(audioBlob: Blob, duration: number): Promise<MessageAttachment | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-message.webm');
    formData.append('duration', duration.toString());
    formData.append('type', 'voice');

    const response = await fetch(`${UPLOAD_ENDPOINT}/voice`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to upload voice message');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error uploading voice message:', error);
    }
    return null;
  }
}

/**
 * Send message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: MessageAttachment[]
): Promise<Message | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${MESSAGING_ENDPOINT}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        attachments,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error sending message:', error);
    }
    return null;
  }
}

/**
 * Get conversations
 */
export async function getConversations(): Promise<Conversation[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const response = await fetch(`${MESSAGING_ENDPOINT}/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch conversations');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching conversations:', error);
    }
    return [];
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const response = await fetch(
      `${MESSAGING_ENDPOINT}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return [];
      }
      throw new Error('Failed to fetch messages');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error fetching messages:', error);
    }
    return [];
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string, messageIds: string[]): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${MESSAGING_ENDPOINT}/conversations/${conversationId}/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageIds }),
    });

    return response.ok;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error marking messages as read:', error);
    }
    return false;
  }
}

/**
 * Schedule meeting
 */
export async function scheduleMeeting(
  conversationId: string,
  meetingData: {
    title: string;
    scheduledAt: string;
    duration: number;
    meetingLink?: string;
    notes?: string;
  }
): Promise<ScheduledMeeting | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${MESSAGING_ENDPOINT}/conversations/${conversationId}/meetings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return null;
      }
      throw new Error('Failed to schedule meeting');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error && error.message !== 'Not authenticated') {
      console.error('Error scheduling meeting:', error);
    }
    return null;
  }
}

/**
 * Get WebRTC signaling endpoint for video/audio calls
 */
export function getWebRTCSignalingEndpoint(conversationId: string): string {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL?.replace(/^https?:\/\//, '') || 'localhost:3001';
  return `${wsProtocol}//${wsHost}/api/messaging/webrtc/${conversationId}`;
}

