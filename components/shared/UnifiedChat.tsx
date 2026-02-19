'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  Phone,
  Image as ImageIcon,
  File,
  Loader2,
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useMessages, useSendMessage, useUploadFile, useUploadVoiceMessage } from '@/hooks/useMessaging';
import { Message, MessageAttachment } from '@/services/platform/messaging';
import { formatRelativeTime } from '@/lib/utils';
import { useCofounder } from '@/contexts/CofounderContext';

export type ChatType = 'job-application' | 'freelancer-proposal' | 'cofounder-connection' | 'team-application' | 'direct';

interface UnifiedChatProps {
  conversationId: string | null;
  chatType: ChatType;
  participantName?: string;
  participantAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  contextData?: {
    jobId?: string;
    applicationId?: string;
    projectId?: string;
    proposalId?: string;
    cofounderProfileId?: string;
    teamId?: string;
  };
}

export function UnifiedChat({
  conversationId,
  chatType,
  participantName = 'User',
  participantAvatar,
  isOpen,
  onClose,
  onSendMessage,
  contextData,
}: UnifiedChatProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Use platform messaging for job applications and freelancer proposals
  const { data: messages = [], isLoading: messagesLoading } = useMessages(
    chatType === 'cofounder-connection' ? null : conversationId,
    chatType !== 'cofounder-connection'
  );
  
  // Use co-founder messaging for co-founder connections
  const { conversations, sendMessage: sendCofounderMessage, currentProfile } = useCofounder();
  const cofounderConversation = chatType === 'cofounder-connection' && contextData?.cofounderProfileId
    ? conversations.find((conv) => 
        conv.participants.includes(currentProfile?.id || '') && 
        conv.participants.includes(contextData.cofounderProfileId || '')
      )
    : null;

  const sendMessageMutation = useSendMessage();
  const uploadFileMutation = useUploadFile();
  const uploadVoiceMutation = useUploadVoiceMessage();
  const { isConnected, isTyping, sendTyping } = useWebSocket(
    chatType === 'cofounder-connection' ? null : conversationId
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, cofounderConversation?.messages]);

  const getChatTypeLabel = () => {
    switch (chatType) {
      case 'job-application':
        return 'Job Application';
      case 'freelancer-proposal':
        return 'Freelancer Proposal';
      case 'cofounder-connection':
        return 'Co-Founder Connection';
      case 'team-application':
        return 'Team Application';
      default:
        return 'Direct Message';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    const messageText = message;
    setMessage('');

    // For co-founder connections, use co-founder context
    if (chatType === 'cofounder-connection' && cofounderConversation) {
      sendCofounderMessage(cofounderConversation.id, messageText);
      if (onSendMessage) {
        onSendMessage(messageText);
      }
      return;
    }

    // For other types, use platform messaging
    if (!conversationId) {
      // Create conversation if it doesn't exist
      console.warn('No conversation ID provided');
      return;
    }

    let uploadedAttachments: MessageAttachment[] = [];

    // Upload attachments if any
    if (attachments.length > 0) {
      for (const file of attachments) {
        const attachment = await uploadFileMutation.mutateAsync({
          file,
          type: file.type.startsWith('image/') ? 'image' : 'file',
        });
        if (attachment) {
          uploadedAttachments.push(attachment);
        }
      }
      setAttachments([]);
    }

    // Send message
    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: messageText,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      });
      if (onSendMessage) {
        onSendMessage(messageText);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = (Date.now() - recordingStartTimeRef.current) / 1000;

        if (conversationId && chatType !== 'cofounder-connection') {
          const attachment = await uploadVoiceMutation.mutateAsync({
            audioBlob,
            duration,
          });
          if (attachment) {
            await sendMessageMutation.mutateAsync({
              conversationId,
              content: 'Voice message',
              attachments: [attachment],
            });
          }
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recordingStartTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = chatType === 'cofounder-connection' && cofounderConversation
    ? cofounderConversation.messages
    : messages;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-800 border-l-2 border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {participantAvatar ? (
              <img
                src={participantAvatar}
                alt={participantName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                {participantName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {participantName}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getChatTypeLabel()}
                </Badge>
                {isConnected && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1.5 transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : displayMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No messages yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start the conversation with {participantName}
              </p>
            </div>
          ) : (
            displayMessages.map((msg: any) => {
              // For co-founder messages, check senderId
              // For platform messages, check senderId (should be compared with actual user ID from auth)
              const isOwnMessage = chatType === 'cofounder-connection'
                ? msg.senderId === currentProfile?.id
                : msg.senderId === 'current-user' || msg.senderId === localStorage.getItem('userId'); // This should come from auth context

              return (
                <div
                  key={msg.id || `msg-${msg.createdAt}`}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-shrink-0">
                    {isOwnMessage ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-xs font-semibold">You</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {participantAvatar ? (
                          <img
                            src={participantAvatar}
                            alt={participantName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
                            {participantName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`flex-1 ${isOwnMessage ? 'flex flex-col items-end' : ''}`}>
                    <div
                      className={`inline-block max-w-[80%] rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content || msg.message}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((att: MessageAttachment) => (
                            <div key={att.id} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                              {att.type === 'image' ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : (
                                <File className="w-4 h-4" />
                              )}
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline truncate"
                              >
                                {att.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                      {formatRelativeTime(msg.timestamp || msg.createdAt?.toISOString() || new Date().toISOString())}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">
                  {participantName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-700 rounded text-sm"
                >
                  <File className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  sendTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-1">
              <input
                type="file"
                id="file-input"
                className="hidden"
                multiple
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="file-input">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  type="button"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </label>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                {isRecording ? (
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

