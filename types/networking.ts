export interface NetworkEvent {
  id: string;
  title: string;
  description: string;
  type: 'Meetup' | 'Conference' | 'Workshop' | 'Webinar' | 'Networking' | 'Hackathon';
  startDate: string;
  endDate: string;
  location: string;
  virtual: boolean;
  virtualLink?: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  attendees: number;
  maxAttendees?: number;
  price: number;
  currency: string;
  tags: string[];
  image?: string;
  agenda?: {
    time: string;
    title: string;
    speaker?: string;
  }[];
  speakers?: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar?: string;
    bio?: string;
  }[];
  registered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  userName: string;
  userAvatar?: string;
  userTitle?: string;
  userCompany?: string;
  status: 'Pending' | 'Connected' | 'Blocked';
  connectedAt?: string;
  mutualConnections: number;
  sharedInterests: string[];
  notes?: string;
  tags: string[];
}

export interface NetworkMessage {
  id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'Message' | 'Introduction' | 'Referral' | 'Recommendation';
  read: boolean;
  createdAt: string;
}

export interface NetworkProfile {
  id: string;
  userId: string;
  headline: string;
  summary: string;
  currentRole?: string;
  currentCompany?: string;
  location?: string;
  industry?: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
  openTo: {
    opportunities: boolean;
    networking: boolean;
    mentoring: boolean;
    beingMentored: boolean;
  };
  availability: 'Available' | 'Busy' | 'Away';
  connections: number;
  followers: number;
  following: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

