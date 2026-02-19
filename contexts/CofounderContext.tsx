'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CoFounderProfile,
  SavedProfile,
  ConnectionRequest,
  Conversation,
  Message,
} from '@/types/cofounder';

interface CofounderContextType {
  // Profile Management
  profiles: CoFounderProfile[];
  addProfile: (profile: CoFounderProfile) => void;
  updateProfile: (id: string, updates: Partial<CoFounderProfile>) => void;
  deleteProfile: (id: string) => void;
  getProfileById: (id: string) => CoFounderProfile | undefined;
  currentProfile: CoFounderProfile | null;
  setCurrentProfile: (profile: CoFounderProfile | null) => void;

  // Saved Profiles
  savedProfiles: SavedProfile[];
  saveProfile: (profileId: string, notes?: string, tags?: string[]) => void;
  unsaveProfile: (profileId: string) => void;
  isProfileSaved: (profileId: string) => boolean;
  updateSavedProfile: (profileId: string, updates: Partial<SavedProfile>) => void;

  // Connection System
  connectionRequests: ConnectionRequest[];
  sendConnectionRequest: (toProfileId: string, message?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  rejectConnectionRequest: (requestId: string) => void;
  hasConnectionRequest: (fromProfileId: string, toProfileId: string) => boolean;

  // Messaging
  conversations: Conversation[];
  sendMessage: (conversationId: string, content: string) => void;
  getConversation: (profileId: string) => Conversation | undefined;
  createConversation: (participantIds: string[]) => string;
}

const CofounderContext = createContext<CofounderContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILES: 'cofounder_profiles',
  SAVED_PROFILES: 'cofounder_saved_profiles',
  CONNECTION_REQUESTS: 'cofounder_connection_requests',
  CONVERSATIONS: 'cofounder_conversations',
  CURRENT_PROFILE: 'cofounder_current_profile',
};

export function CofounderProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<CoFounderProfile[]>([]);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentProfile, setCurrentProfile] = useState<CoFounderProfile | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedProfilesData = localStorage.getItem(STORAGE_KEYS.SAVED_PROFILES);
      if (savedProfilesData) {
        const parsed = JSON.parse(savedProfilesData);
        setSavedProfiles(parsed.map((sp: any) => ({
          ...sp,
          savedAt: new Date(sp.savedAt),
        })));
      }

      const connectionRequestsData = localStorage.getItem(STORAGE_KEYS.CONNECTION_REQUESTS);
      if (connectionRequestsData) {
        const parsed = JSON.parse(connectionRequestsData);
        setConnectionRequests(parsed.map((cr: any) => ({
          ...cr,
          createdAt: new Date(cr.createdAt),
        })));
      }

      const conversationsData = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (conversationsData) {
        const parsed = JSON.parse(conversationsData);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          lastMessageAt: new Date(conv.lastMessageAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })),
        })));
      }

      const currentProfileData = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
      if (currentProfileData) {
        const parsed = JSON.parse(currentProfileData);
        setCurrentProfile({
          ...parsed,
          lastActive: new Date(parsed.lastActive),
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
        });
      }
    } catch (error) {
      console.error('Error loading cofounder data from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(savedProfiles));
    } catch (error) {
      console.error('Error saving saved profiles:', error);
    }
  }, [savedProfiles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CONNECTION_REQUESTS, JSON.stringify(connectionRequests));
    } catch (error) {
      console.error('Error saving connection requests:', error);
    }
  }, [connectionRequests]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }, [conversations]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (currentProfile) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, JSON.stringify(currentProfile));
      }
    } catch (error) {
      console.error('Error saving current profile:', error);
    }
  }, [currentProfile]);

  // Profile Management
  const addProfile = (profile: CoFounderProfile) => {
    setProfiles((prev) => [...prev, profile]);
  };

  const updateProfile = (id: string, updates: Partial<CoFounderProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    );
    if (currentProfile?.id === id) {
      setCurrentProfile((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date() } : null));
    }
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (currentProfile?.id === id) {
      setCurrentProfile(null);
    }
  };

  const getProfileById = (id: string) => {
    return profiles.find((p) => p.id === id);
  };

  // Saved Profiles
  const saveProfile = (profileId: string, notes?: string, tags?: string[]) => {
    if (isProfileSaved(profileId)) return;

    const newSaved: SavedProfile = {
      profileId,
      savedAt: new Date(),
      notes,
      tags,
    };

    setSavedProfiles((prev) => [...prev, newSaved]);
  };

  const unsaveProfile = (profileId: string) => {
    setSavedProfiles((prev) => prev.filter((sp) => sp.profileId !== profileId));
  };

  const isProfileSaved = (profileId: string) => {
    return savedProfiles.some((sp) => sp.profileId === profileId);
  };

  const updateSavedProfile = (profileId: string, updates: Partial<SavedProfile>) => {
    setSavedProfiles((prev) =>
      prev.map((sp) => (sp.profileId === profileId ? { ...sp, ...updates } : sp))
    );
  };

  // Connection System
  const sendConnectionRequest = (toProfileId: string, message?: string) => {
    if (!currentProfile) return;

    const request: ConnectionRequest = {
      id: `req_${Date.now()}`,
      fromProfileId: currentProfile.id,
      toProfileId,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    setConnectionRequests((prev) => [...prev, request]);
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'accepted' as const } : req))
    );

    // Create conversation when connection is accepted
    const request = connectionRequests.find((r) => r.id === requestId);
    if (request) {
      createConversation([request.fromProfileId, request.toProfileId]);
    }
  };

  const rejectConnectionRequest = (requestId: string) => {
    setConnectionRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'rejected' as const } : req))
    );
  };

  const hasConnectionRequest = (fromProfileId: string, toProfileId: string) => {
    return connectionRequests.some(
      (req) =>
        req.fromProfileId === fromProfileId &&
        req.toProfileId === toProfileId &&
        req.status === 'pending'
    );
  };

  // Messaging
  const createConversation = (participantIds: string[]): string => {
    const conversationId = `conv_${Date.now()}`;
    const conversation: Conversation = {
      id: conversationId,
      participants: participantIds,
      messages: [],
      lastMessageAt: new Date(),
      unreadCount: 0,
    };

    setConversations((prev) => [...prev, conversation]);
    return conversationId;
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (!currentProfile) return;

    const message: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentProfile.id,
      content,
      createdAt: new Date(),
      read: false,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessageAt: new Date(),
            unreadCount:
              conv.participants.find((p) => p !== currentProfile.id) === undefined
                ? conv.unreadCount
                : conv.unreadCount + 1,
          };
        }
        return conv;
      })
    );
  };

  const getConversation = (profileId: string) => {
    if (!currentProfile) return undefined;
    return conversations.find(
      (conv) =>
        conv.participants.includes(currentProfile.id) && conv.participants.includes(profileId)
    );
  };

  return (
    <CofounderContext.Provider
      value={{
        profiles,
        addProfile,
        updateProfile,
        deleteProfile,
        getProfileById,
        currentProfile,
        setCurrentProfile,
        savedProfiles,
        saveProfile,
        unsaveProfile,
        isProfileSaved,
        updateSavedProfile,
        connectionRequests,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        hasConnectionRequest,
        conversations,
        sendMessage,
        getConversation,
        createConversation,
      }}
    >
      {children}
    </CofounderContext.Provider>
  );
}

export function useCofounder() {
  const context = useContext(CofounderContext);
  if (context === undefined) {
    // Return a default context during SSR or when provider is missing
    if (typeof window === 'undefined') {
      return {
        profiles: [],
        addProfile: () => {},
        updateProfile: () => {},
        deleteProfile: () => {},
        getProfileById: () => null,
        currentProfile: null,
        setCurrentProfile: () => {},
        savedProfiles: [],
        saveProfile: () => {},
        unsaveProfile: () => {},
        isProfileSaved: () => false,
        updateSavedProfile: () => {},
        connectionRequests: [],
        sendConnectionRequest: () => {},
        acceptConnectionRequest: () => {},
        rejectConnectionRequest: () => {},
        hasConnectionRequest: () => false,
        conversations: [],
        sendMessage: () => {},
        getConversation: () => null,
        createConversation: () => '',
      };
    }
    throw new Error('useCofounder must be used within a CofounderProvider');
  }
  return context;
}

