import { Hackathon } from '@/types/platform';

// Event structure from luma-clone
interface LumaEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  locationType: 'physical' | 'online' | 'hybrid';
  imageUrl?: string;
  theme?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
    sold: number;
  }>;
  totalCapacity?: number;
  registeredCount: number;
  status: 'upcoming' | 'live' | 'past' | 'cancelled' | 'postponed';
  createdAt: string;
  visibility?: 'public' | 'private';
  tags?: string[];
}

// Get luma-clone API URL from environment or use default
const LUMA_API_URL = process.env.NEXT_PUBLIC_LUMA_API_URL || 'http://localhost:3000/api';
const USE_LUMA_API = process.env.NEXT_PUBLIC_USE_LUMA_API !== 'false'; // Default to true

/**
 * Fetch events from luma-clone platform
 */
export async function fetchLumaEvents(filters?: {
  status?: 'upcoming' | 'past';
  category?: string;
  tags?: string[];
}): Promise<LumaEvent[]> {
  if (!USE_LUMA_API) {
    return [];
  }

  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    
    const query = params.toString();
    const response = await fetch(`${LUMA_API_URL}/events${query ? `?${query}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache revalidation
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch events from luma-clone:', response.status);
      return [];
    }

    const data = await response.json();
    return data.success ? data.data || [] : [];
  } catch (error) {
    console.error('Error fetching events from luma-clone:', error);
    return [];
  }
}

/**
 * Check if an event is a hackathon/competition based on tags or title
 */
function isHackathonOrCompetition(event: LumaEvent): boolean {
  const hackathonKeywords = ['hackathon', 'competition', 'contest', 'challenge', 'sprint', 'jam'];
  const titleLower = event.title.toLowerCase();
  const descriptionLower = event.description.toLowerCase();
  const tagsLower = (event.tags || []).map(t => t.toLowerCase());

  // Check title
  if (hackathonKeywords.some(keyword => titleLower.includes(keyword))) {
    return true;
  }

  // Check description
  if (hackathonKeywords.some(keyword => descriptionLower.includes(keyword))) {
    return true;
  }

  // Check tags
  if (tagsLower.some(tag => hackathonKeywords.some(keyword => tag.includes(keyword)))) {
    return true;
  }

  // Check if event has theme (often used for hackathons)
  if (event.theme) {
    return true;
  }

  return false;
}

/**
 * Map Luma Event to Hackathon format
 */
function mapEventToHackathon(event: LumaEvent): Hackathon {
  // Parse dates
  const startDate = new Date(`${event.date}T${event.time}`);
  const endDate = event.endTime 
    ? new Date(`${event.date}T${event.endTime}`)
    : new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Default to 24 hours later
  
  // Determine hackathon status
  let status: Hackathon['status'] = 'upcoming';
  if (event.status === 'live') {
    status = 'in-progress';
  } else if (event.status === 'past') {
    status = 'completed';
  } else if (event.status === 'cancelled' || event.status === 'postponed') {
    status = 'upcoming'; // Keep as upcoming for cancelled/postponed
  }

  // Extract prizes from ticket types (if any have prices > 0, treat as prizes)
  const prizes = event.ticketTypes
    .filter(ticket => ticket.price > 0)
    .map((ticket, index) => ({
      id: `prize-${ticket.id}`,
      hackathonId: event.id,
      rank: index + 1,
      title: ticket.name,
      amount: `$${ticket.price}`,
      description: ticket.name,
    }));

  // Calculate total prize pool
  const totalPrizePool = prizes.length > 0
    ? `$${prizes.reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '') || '0'), 0)}`
    : undefined;

  // Generate slug from title
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Extract tags
  const tags = event.tags || [];
  if (event.theme) {
    tags.push(event.theme);
  }

  return {
    id: `hack-${event.id}`,
    name: event.title,
    slug,
    description: event.description,
    longDescription: event.description,
    theme: event.theme || event.title,
    organizer: event.organizer.name,
    organizerLogo: event.organizer.avatar,
    
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    registrationDeadline: new Date(startDate.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours before start
    
    prizes: prizes.length > 0 ? prizes : [],
    totalPrizePool,
    
    teamSize: {
      min: 2,
      max: 5,
    },
    
    status,
    visibility: event.visibility || 'public',
    
    registeredTeams: [],
    maxParticipants: event.totalCapacity,
    currentParticipants: event.registeredCount,
    
    spotlightEligible: true,
    featuredWinners: [],
    
    tags,
    location: event.location,
    remoteParticipation: event.locationType === 'online' || event.locationType === 'hybrid',
    imageUrl: event.imageUrl,
    bannerUrl: event.imageUrl,
    createdAt: event.createdAt,
    updatedAt: event.createdAt,
  };
}

/**
 * Get hackathons from luma-clone events
 */
export async function getHackathonsFromLuma(): Promise<Hackathon[]> {
  try {
    // Fetch all upcoming events
    const upcomingEvents = await fetchLumaEvents({ status: 'upcoming' });
    
    // Fetch past events (for completed hackathons)
    const pastEvents = await fetchLumaEvents({ status: 'past' });
    
    // Combine and filter for hackathons/competitions
    const allEvents = [...upcomingEvents, ...pastEvents];
    const hackathonEvents = allEvents.filter(isHackathonOrCompetition);
    
    // Map to Hackathon format
    return hackathonEvents.map(mapEventToHackathon);
  } catch (error) {
    console.error('Error getting hackathons from luma-clone:', error);
    return [];
  }
}

/**
 * Get a specific hackathon by ID from luma-clone
 */
export async function getHackathonFromLumaById(eventId: string): Promise<Hackathon | null> {
  try {
    const response = await fetch(`${LUMA_API_URL}/events/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      return null;
    }

    const event = data.data as LumaEvent;
    
    if (!isHackathonOrCompetition(event)) {
      return null;
    }

    return mapEventToHackathon(event);
  } catch (error) {
    console.error('Error fetching hackathon from luma-clone:', error);
    return null;
  }
}

