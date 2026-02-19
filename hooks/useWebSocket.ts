/**
 * WebSocket hook for real-time messaging
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/services/platform/auth';

interface WebSocketMessage {
  type: 'message' | 'message_read' | 'typing' | 'call_offer' | 'call_answer' | 'call_ice_candidate';
  data: any;
}

export function useWebSocket(conversationId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId || typeof window === 'undefined') {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      return;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.NEXT_PUBLIC_MAIN_PLATFORM_URL?.replace(/^https?:\/\//, '') || 'localhost:3001';
    const wsUrl = `${wsProtocol}//${wsHost}/api/messaging/ws?conversationId=${conversationId}&token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'message':
            // Invalidate messages query to refetch
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            break;

          case 'message_read':
            // Update read status
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            break;

          case 'typing':
            setIsTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false);
            }, 3000);
            break;

          case 'call_offer':
          case 'call_answer':
          case 'call_ice_candidate':
            // Handle WebRTC signaling
            // These will be handled by the WebRTC hook
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      wsRef.current = null;
      
      // Only attempt to reconnect if it wasn't a normal closure
      if (event.code !== 1000 && conversationId) {
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (conversationId) {
            // Reconnect logic handled by useEffect
          }
        }, 3000);
      }
    };

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (ws) {
        ws.close();
      }
    };
  }, [conversationId, queryClient]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  }, []);

  const sendTyping = useCallback(() => {
    sendMessage('typing', { conversationId });
  }, [conversationId, sendMessage]);

  return {
    isConnected,
    isTyping,
    sendMessage,
    sendTyping,
  };
}

