'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X, ChevronDown, Plus, Briefcase, User, Users, Calendar } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  type: 'application' | 'job' | 'direct' | 'group';
  avatar?: string;
  icon?: string;
  iconBg?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread?: number;
  jobId?: string;
  applicationId?: string;
  jobTitle?: string;
  companyName?: string;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentJobId?: string;
  currentApplicationId?: string;
}

export function ChatOverlay({ isOpen, onClose, currentJobId, currentApplicationId }: ChatOverlayProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mock chat data - in production, fetch from API
  useEffect(() => {
    const mockChats: Chat[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        type: 'application',
        jobId: '1',
        applicationId: '1',
        jobTitle: 'Senior Full Stack Developer',
        companyName: 'TechNova Solutions',
        icon: 'S',
        iconBg: 'bg-primary',
        lastMessage: 'Thank you for your interest! We\'d like to schedule an interview...',
        lastMessageTime: '2h',
        unread: 2,
      },
      {
        id: '2',
        name: 'John Doe',
        type: 'application',
        jobId: '2',
        applicationId: '2',
        jobTitle: 'Product Manager',
        companyName: 'StartupX',
        icon: 'J',
        iconBg: 'bg-blue-500',
        lastMessage: 'I have a few questions about the role...',
        lastMessageTime: '5h',
        unread: 1,
      },
      {
        id: '3',
        name: 'AI Research Engineer - TechNova',
        type: 'job',
        jobId: '1',
        icon: 'AI',
        iconBg: 'bg-gradient-to-br from-primary to-primary-dark',
        lastMessage: '3 new applications received',
        lastMessageTime: '1d',
        unread: 3,
      },
      {
        id: '4',
        name: 'Jane Smith',
        type: 'direct',
        icon: 'J',
        iconBg: 'bg-green-500',
        lastMessage: 'Hey, are you still looking for a co-founder?',
        lastMessageTime: '2d',
      },
      {
        id: '5',
        name: 'Growth Lab Community',
        type: 'group',
        icon: 'GL',
        iconBg: 'bg-gradient-to-br from-primary via-primary-600 to-primary-dark',
        lastMessage: 'New job posted: Senior Developer at TechNova',
        lastMessageTime: '3d',
      },
      {
        id: '6',
        name: 'Alex Chen',
        type: 'application',
        jobId: '3',
        applicationId: '3',
        jobTitle: 'Frontend Developer',
        companyName: 'DesignHub',
        icon: 'A',
        iconBg: 'bg-purple-500',
        lastMessage: 'When can I expect to hear back?',
        lastMessageTime: '4d',
      },
      {
        id: '7',
        name: 'Mike Johnson',
        type: 'direct',
        icon: 'M',
        iconBg: 'bg-orange-500',
        lastMessage: 'Thanks for the referral!',
        lastMessageTime: '1w',
      },
    ];

    // If viewing a specific job or application, prioritize that chat
    if (currentJobId) {
      const filteredChats = mockChats.filter(c => c.jobId !== currentJobId);
      filteredChats.unshift({
        id: `job-${currentJobId}`,
        name: 'Job Applications',
        type: 'job',
        jobId: currentJobId,
        icon: 'JA',
        iconBg: 'bg-primary',
        lastMessage: 'View and manage applications for this job',
        lastMessageTime: 'now',
      });
      setChats(filteredChats);
    } else if (currentApplicationId) {
      const filteredChats = mockChats.filter(c => c.applicationId !== currentApplicationId);
      const appChat = mockChats.find(c => c.applicationId === currentApplicationId);
      if (appChat) {
        filteredChats.unshift(appChat);
      }
      setChats(filteredChats);
    } else {
      setChats(mockChats);
    }
  }, [currentJobId, currentApplicationId]);

  if (!isOpen) return null;

  const getChatIcon = (chat: Chat) => {
    if (chat.type === 'job') {
      return <Briefcase className="w-5 h-5" />;
    } else if (chat.type === 'application') {
      return <User className="w-5 h-5" />;
    } else if (chat.type === 'group') {
      return <Users className="w-5 h-5" />;
    }
    return <MessageCircle className="w-5 h-5" />;
  };

  const getChatTypeLabel = (type: Chat['type']) => {
    switch (type) {
      case 'application':
        return 'Application';
      case 'job':
        return 'Job';
      case 'group':
        return 'Group';
      default:
        return 'Direct';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Chat Overlay */}
      <div className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-white dark:bg-gray-800 border-l-2 border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            {chats.reduce((sum, chat) => sum + (chat.unread || 0), 0) > 0 && (
              <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {chats.reduce((sum, chat) => sum + (chat.unread || 0), 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1.5 transition-all duration-200"
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No messages yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start a conversation with job applicants or employers</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat.id);
                    // In production, navigate to chat detail or open chat window
                    // For now, we'll just track selection
                  }}
                  className={`w-full p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-left flex items-start gap-3 group ${
                    selectedChat === chat.id ? 'bg-primary/10 dark:bg-primary/20 border-l-4 border-primary' : ''
                  }`}
                >
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0 relative">
                    {chat.avatar ? (
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md ${
                        chat.iconBg || 'bg-gradient-to-br from-primary to-primary-dark'
                      } ${chat.avatar ? 'hidden' : ''}`}
                    >
                      {chat.icon || chat.name.charAt(0).toUpperCase()}
                    </div>
                    {chat.type === 'application' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {chat.type === 'job' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                        <Briefcase className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-primary transition-colors">
                          {chat.name}
                        </h3>
                        {chat.type && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                            {getChatTypeLabel(chat.type)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {chat.unread && chat.unread > 0 && (
                          <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                    </div>
                    {chat.jobTitle && (
                      <p className="text-xs text-primary font-medium mb-1 truncate">
                        {chat.jobTitle} • {chat.companyName}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer - New Chat Button */}
        <div className="p-4 border-t-2 border-gray-200 bg-gray-50 dark:bg-gray-800">
          <button className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            New Message
          </button>
        </div>
      </div>
    </>
  );
}

