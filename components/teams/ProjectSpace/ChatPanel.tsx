'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProjectSpace, ChatMessage } from '@/types/platform';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Send, Paperclip } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface ChatPanelProps {
  projectSpace: ProjectSpace;
  team: TeamCardType;
}

export function ChatPanel({ projectSpace, team }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(projectSpace.chatMessages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectSpaceId: projectSpace.id,
      userId: 'current-user', // In real app, get from auth
      userName: 'You',
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setMessages([...messages, message]);
    setNewMessage('');
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.userId === 'current-user' ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                  {message.userName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className={`flex-1 ${message.userId === 'current-user' ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {message.userName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                </div>
                <div
                  className={`inline-block rounded-lg px-4 py-2 ${
                    message.userId === 'current-user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" className="flex-shrink-0">
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isSending}
          isLoading={isSending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

