'use client';

import { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Users, 
  MessageSquare,
  Search,
  UserPlus,
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Award,
  Send,
  CheckCircle2,
  Clock,
  Globe,
} from 'lucide-react';

interface NetworkContact {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar?: string;
  connected: boolean;
  mutualConnections: number;
  skills: string[];
  lastContact?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'in-person';
  attendees: number;
  category: string;
}

// Mock data
const mockContacts: NetworkContact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'TechNova Solutions',
    location: 'Singapore',
    connected: true,
    mutualConnections: 5,
    skills: ['Product Management', 'Agile', 'UX'],
    lastContact: '2 weeks ago',
  },
  {
    id: '2',
    name: 'Michael Tan',
    title: 'Engineering Lead',
    company: 'StartupX',
    location: 'Singapore',
    connected: false,
    mutualConnections: 3,
    skills: ['React', 'Node.js', 'Leadership'],
  },
  {
    id: '3',
    name: 'Emily Wong',
    title: 'Head of Design',
    company: 'DesignHub',
    location: 'Singapore',
    connected: true,
    mutualConnections: 8,
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    lastContact: '1 month ago',
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Singapore Tech Meetup',
    description: 'Monthly networking event for tech professionals',
    date: '2024-04-15',
    time: '6:00 PM',
    location: 'Singapore',
    type: 'in-person',
    attendees: 120,
    category: 'Networking',
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    description: 'Watch startups pitch and network with founders',
    date: '2024-04-20',
    time: '7:00 PM',
    location: 'Online',
    type: 'online',
    attendees: 250,
    category: 'Startups',
  },
];

function NetworkingContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Networking</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Build Your Network
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Connect with professionals, attend events, and grow your career network
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 shadow-sm mb-8">
            <TabsTrigger value="contacts" className="px-6 py-3 text-sm font-semibold rounded-lg">
              My Network
            </TabsTrigger>
            <TabsTrigger value="discover" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Discover
            </TabsTrigger>
            <TabsTrigger value="events" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Events
            </TabsTrigger>
            <TabsTrigger value="messages" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Messages
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search your network..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="border-2 border-gray-200 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{contact.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{contact.title}</p>
                        <p className="text-sm font-semibold text-primary">{contact.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{contact.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {contact.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {contact.connected ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Connected</span>
                          {contact.mutualConnections > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              • {contact.mutualConnections} mutual connections
                            </span>
                          )}
                        </div>
                        {contact.lastContact && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">Last contact: {contact.lastContact}</p>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" className="w-full bg-primary hover:bg-primary-dark">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockContacts.filter(c => !c.connected).map((contact) => (
                <Card key={contact.id} className="border-2 border-gray-200 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{contact.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{contact.title}</p>
                        <p className="text-sm font-semibold text-primary">{contact.company}</p>
                      </div>
                    </div>
                    {contact.mutualConnections > 0 && (
                      <div className="text-sm text-gray-600 mb-4">
                        {contact.mutualConnections} mutual connection{contact.mutualConnections > 1 ? 's' : ''}
                      </div>
                    )}
                    <Button size="sm" className="w-full bg-primary hover:bg-primary-dark">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockEvents.map((event) => (
                <Card key={event.id} className="border-2 border-gray-200 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                      </div>
                      <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        {event.type === 'online' ? (
                          <Globe className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary-dark">
                      Register for Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Messages Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start connecting with professionals to begin messaging
                </p>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Find Connections
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function NetworkingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading networking...</p>
          </div>
        </div>
      }
    >
      <NetworkingContent />
    </Suspense>
  );
}

