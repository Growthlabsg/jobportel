'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { 
  MessageSquare, 
  Send, 
  Search,
  User,
  Clock,
  CheckCircle2,
  Paperclip,
  Image as ImageIcon,
  ArrowLeft,
  Home,
  Video,
  Phone,
  Mic,
  Calendar,
  X,
  FileText,
  Download,
  Play,
  VideoOff,
  MicOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useUploadFile,
  useUploadVoiceMessage,
  useScheduleMeeting,
  useMarkMessagesAsRead,
} from '@/hooks/useMessaging';
import type { MessageAttachment } from '@/hooks/useMessaging';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useToast } from '@/components/ui/Toast';

// Types are now imported from hooks

export default function MessagesPage() {
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<MessageAttachment[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDateTime, setMeetingDateTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(30);
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // MediaRecorder for voice messages
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Hooks
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: messages = [], isLoading: messagesLoading } = useMessages(selectedConversation);
  const sendMessageMutation = useSendMessage();
  const uploadFileMutation = useUploadFile();
  const uploadVoiceMutation = useUploadVoiceMessage();
  const scheduleMeetingMutation = useScheduleMeeting();
  const markAsReadMutation = useMarkMessagesAsRead();
  const { isConnected, isTyping, sendTyping } = useWebSocket(selectedConversation);
  const {
    callState,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
  } = useWebRTC(selectedConversation);
  const { showToast, ToastContainer } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        const { getActiveJobProfile } = await import('@/services/platform/auth');
        const profile = await getActiveJobProfile();
        if (profile?.id) {
          setCurrentUserId(profile.id);
        }
      } catch (error) {
        // Silently handle - user might not be logged in
      }
    };
    getUserId();
  }, []);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && messages.length > 0 && currentUserId) {
      const unreadMessages = messages
        .filter((msg) => !msg.read && msg.senderId !== currentUserId)
        .map((msg) => msg.id);
      
      if (unreadMessages.length > 0) {
        markAsReadMutation.mutate({
          conversationId: selectedConversation,
          messageIds: unreadMessages,
        });
      }
    }
  }, [selectedConversation, messages, markAsReadMutation, currentUserId]);

  // Show connection status toast on connection changes (only once per state change)
  const prevConnectedRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (selectedConversation && prevConnectedRef.current !== null && prevConnectedRef.current !== isConnected) {
      if (isConnected) {
        showToast('Connected to chat', 'success', 2000);
      } else {
        showToast('Disconnected from chat. Reconnecting...', 'warning', 3000);
      }
    }
    prevConnectedRef.current = isConnected;
  }, [isConnected, selectedConversation, showToast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setShowAttachmentMenu(false);

    // Upload files and add to attachments
    for (const file of files) {
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      uploadFileMutation.mutate(
        { file, type: fileType },
        {
          onSuccess: (attachment) => {
            if (attachment) {
              setUploadedAttachments((prev) => [...prev, attachment]);
              showToast(`${file.name} uploaded successfully`, 'success');
            }
          },
          onError: (error) => {
            showToast(
              `Failed to upload ${file.name}. ${error instanceof Error ? error.message : 'Please try again.'}`,
              'error'
            );
          },
        }
      );
    }
  };

  const removeAttachment = (index: number) => {
    setUploadedAttachments(uploadedAttachments.filter((_, i) => i !== index));
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      recordingStartTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);

        // Upload voice message
        uploadVoiceMutation.mutate(
          { audioBlob, duration },
          {
            onSuccess: (attachment) => {
              if (attachment && selectedConversation) {
                // Send message with voice attachment
                sendMessageMutation.mutate({
                  conversationId: selectedConversation,
                  content: '',
                  attachments: [attachment],
                });
                showToast('Voice message sent', 'success');
              }
            },
            onError: (error) => {
              showToast(
                `Failed to send voice message. ${error instanceof Error ? error.message : 'Please try again.'}`,
                'error'
              );
            },
          }
        );

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      showToast('Recording started', 'info', 2000);
    } catch (error) {
      console.error('Error starting recording:', error);
      showToast(
        'Failed to start recording. Please check microphone permissions.',
        'error'
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showToast('Recording stopped. Uploading...', 'info', 2000);
    }
  };

  const handleVideoCall = () => {
    if (!selectedConversation) {
      showToast('Please select a conversation first', 'warning');
      return;
    }
    try {
      setShowCallModal(true);
      startCall('video');
      showToast('Initiating video call...', 'info', 2000);
    } catch (error) {
      showToast(
        `Failed to start video call. ${error instanceof Error ? error.message : 'Please check your camera permissions.'}`,
        'error'
      );
    }
  };

  const handleAudioCall = () => {
    if (!selectedConversation) {
      showToast('Please select a conversation first', 'warning');
      return;
    }
    try {
      setShowCallModal(true);
      startCall('audio');
      showToast('Initiating audio call...', 'info', 2000);
    } catch (error) {
      showToast(
        `Failed to start audio call. ${error instanceof Error ? error.message : 'Please check your microphone permissions.'}`,
        'error'
      );
    }
  };

  const handleSendMessage = () => {
    if (!selectedConversation) return;
    
    if (message.trim() || uploadedAttachments.length > 0) {
      sendMessageMutation.mutate(
        {
          conversationId: selectedConversation,
          content: message.trim(),
          attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
        },
        {
          onSuccess: () => {
            setMessage('');
            setUploadedAttachments([]);
            setAttachments([]);
            showToast('Message sent', 'success', 2000);
          },
          onError: (error) => {
            showToast(
              `Failed to send message. ${error instanceof Error ? error.message : 'Please try again.'}`,
              'error'
            );
          },
        }
      );
    }
  };

  const handleScheduleMeeting = () => {
    if (!selectedConversation || !meetingTitle || !meetingDateTime) {
      showToast('Please fill in meeting title and date/time', 'warning');
      return;
    }

    scheduleMeetingMutation.mutate(
      {
        conversationId: selectedConversation,
        meetingData: {
          title: meetingTitle,
          scheduledAt: meetingDateTime,
          duration: meetingDuration,
          meetingLink: meetingLink || undefined,
          notes: meetingNotes || undefined,
        },
      },
      {
        onSuccess: () => {
          setShowScheduleModal(false);
          setMeetingTitle('');
          setMeetingDateTime('');
          setMeetingDuration(30);
          setMeetingLink('');
          setMeetingNotes('');
          showToast('Meeting scheduled successfully', 'success');
        },
        onError: (error) => {
          showToast(
            `Failed to schedule meeting. ${error instanceof Error ? error.message : 'Please try again.'}`,
            'error'
          );
        },
      }
    );
  };

  // Send typing indicator
  useEffect(() => {
    if (message.trim()) {
      const timeout = setTimeout(() => {
        sendTyping();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [message, sendTyping]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Link href="/jobs/freelancer">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Messages</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Communicate with clients and freelancers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 lg:col-span-1 flex flex-col">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {conversations.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        selectedConversation === conversation.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {conversation.participantName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {conversation.participantName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="primary" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          {conversation.projectTitle && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                              {conversation.projectTitle}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {conversation.lastMessageTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>No conversations yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-2 border-gray-200 dark:border-gray-700 lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                        {conversations.find(c => c.id === selectedConversation)?.participantName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {conversations.find(c => c.id === selectedConversation)?.participantName}
                        </CardTitle>
                        {conversations.find(c => c.id === selectedConversation)?.projectTitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {conversations.find(c => c.id === selectedConversation)?.projectTitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isTyping && (
                        <Badge variant="outline" className="text-xs animate-pulse">
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="ml-1">Typing...</span>
                          </span>
                        </Badge>
                      )}
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            'w-2.5 h-2.5 rounded-full transition-all',
                            isConnected
                              ? 'bg-green-500 dark:bg-green-400 shadow-lg shadow-green-500/50'
                              : 'bg-gray-400 dark:bg-gray-600'
                          )}
                          title={isConnected ? 'Connected' : 'Disconnected'}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                          {isConnected ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleVideoCall}
                        title="Video Call"
                        disabled={callState.isCallActive}
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAudioCall}
                        title="Audio Call"
                        disabled={callState.isCallActive}
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowScheduleModal(true)}
                        title="Schedule Meeting"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messagesLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = currentUserId ? msg.senderId === currentUserId : msg.senderId === 'me';
                      return (
                      <div
                        key={msg.id}
                        className={`flex ${!isOwnMessage ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] ${!isOwnMessage ? 'order-1' : 'order-2'}`}>
                          <div className={`rounded-lg p-4 ${
                            isOwnMessage
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }`}>
                          {msg.content && (
                            <p className="text-sm mb-2">{msg.content}</p>
                          )}
                          
                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="space-y-2 mb-2">
                              {msg.attachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className={`rounded-lg overflow-hidden ${
                                    isOwnMessage
                                      ? 'bg-white/20'
                                      : 'bg-gray-200 dark:bg-gray-700'
                                  }`}
                                >
                                  {attachment.type === 'image' && (
                                    <div className="relative">
                                      <img
                                        src={attachment.thumbnail || attachment.url}
                                        alt={attachment.name}
                                        className="w-full max-w-xs h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(attachment.url, '_blank')}
                                      />
                                    </div>
                                  )}
                                  {attachment.type === 'file' && (
                                    <div className="flex items-center gap-3 p-3">
                                      <FileText className={`w-5 h-5 ${
                                        isOwnMessage ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                      }`} />
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${
                                          isOwnMessage ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                                        }`}>
                                          {attachment.name}
                                        </p>
                                        {attachment.size && (
                                          <p className={`text-xs ${
                                            isOwnMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            {formatFileSize(attachment.size)}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(attachment.url, '_blank')}
                                        className={isOwnMessage ? 'text-white hover:bg-white/20' : ''}
                                      >
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                  {attachment.type === 'voice' && (
                                    <div className="flex items-center gap-3 p-3">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={isOwnMessage ? 'text-white hover:bg-white/20' : ''}
                                      >
                                        <Play className="w-4 h-4" />
                                      </Button>
                                      <div className="flex-1">
                                        <div className="h-2 bg-white/30 dark:bg-gray-600 rounded-full overflow-hidden">
                                          <div className="h-full bg-primary w-1/3"></div>
                                        </div>
                                        {attachment.duration && (
                                          <p className={`text-xs mt-1 ${
                                            isOwnMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, '0')}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            {isOwnMessage && msg.read && (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                    })
                  )}
                </CardContent>
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  {/* Attachment Preview */}
                  {uploadedAttachments.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {uploadedAttachments.map((attachment, idx) => (
                        <div
                          key={attachment.id || idx}
                          className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                        >
                          {attachment.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                          <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                            {attachment.name}
                          </span>
                          {uploadFileMutation.isPending && (
                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          )}
                          <button
                            onClick={() => removeAttachment(idx)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700"
                            disabled={uploadFileMutation.isPending}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        title="Attach file"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      {showAttachmentMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
                          <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm">Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                          <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Document</span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              multiple
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className={isRecording ? 'text-red-600 dark:text-red-400 animate-pulse' : ''}
                      title={isRecording ? 'Stop recording' : 'Voice message'}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && uploadedAttachments.length === 0) || sendMessageMutation.isPending}
                      title={sendMessageMutation.isPending ? 'Sending...' : 'Send message'}
                    >
                      {sendMessageMutation.isPending ? (
                        <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={showScheduleModal}
        title="Schedule Meeting"
        onClose={() => setShowScheduleModal(false)}
      >
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Title *
              </label>
              <Input
                placeholder="e.g., Project Discussion"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={meetingDateTime}
                onChange={(e) => setMeetingDateTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <Input
                type="number"
                placeholder="30"
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(Number(e.target.value))}
                min={15}
                max={480}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meeting Link (optional)
              </label>
              <Input
                placeholder="Zoom, Google Meet, etc."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <Textarea
                placeholder="Add any additional notes..."
                rows={3}
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowScheduleModal(false)}
                className="flex-1"
                disabled={scheduleMeetingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleMeeting}
                className="flex-1"
                disabled={scheduleMeetingMutation.isPending || !meetingTitle || !meetingDateTime}
              >
                {scheduleMeetingMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </div>
        </div>
      </Modal>

      {/* Video/Audio Call Modal */}
      {showCallModal && (
        <Modal
          isOpen={showCallModal}
          title={callState.callType === 'video' ? 'Video Call' : 'Audio Call'}
          onClose={() => {
            endCall();
            setShowCallModal(false);
          }}
          size="lg"
        >
          <div className="space-y-4">
            {callState.callType === 'video' && (
              <div className="grid grid-cols-2 gap-4">
                {/* Local Video */}
                <div className="relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-48 bg-gray-900 rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    You
                  </div>
                </div>
                {/* Remote Video */}
                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-48 bg-gray-900 rounded-lg"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Remote
                  </div>
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {callState.callType === 'video' && (
                <Button
                  variant="outline"
                  onClick={toggleVideo}
                  title={callState.isLocalVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {callState.isLocalVideoEnabled ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={toggleAudio}
                title={callState.isLocalAudioEnabled ? 'Mute' : 'Unmute'}
              >
                {callState.isLocalAudioEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  endCall();
                  setShowCallModal(false);
                }}
              >
                End Call
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

