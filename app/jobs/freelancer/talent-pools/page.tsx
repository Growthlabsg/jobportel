'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Home, 
  Users, 
  Plus, 
  Search, 
  Filter,
  Star,
  MapPin,
  Briefcase,
  X
} from 'lucide-react';

// Mock talent pool data
const mockTalentPools = [
  {
    id: '1',
    name: 'Top React Developers',
    description: 'Expert React developers for frontend projects',
    members: 12,
    skills: ['React', 'TypeScript', 'Next.js'],
    created: '2024-01-15',
  },
  {
    id: '2',
    name: 'UI/UX Designers',
    description: 'Creative designers for product design',
    members: 8,
    skills: ['Figma', 'UI Design', 'UX Research'],
    created: '2024-01-20',
  },
  {
    id: '3',
    name: 'Full Stack Engineers',
    description: 'Versatile developers for end-to-end projects',
    members: 15,
    skills: ['Node.js', 'React', 'PostgreSQL'],
    created: '2024-02-01',
  },
];

export default function TalentPoolsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolDescription, setNewPoolDescription] = useState('');

  const filteredPools = mockTalentPools.filter(pool =>
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePool = () => {
    // In a real app, this would create a talent pool via API
    alert(`Creating talent pool: ${newPoolName}`);
    setShowCreateModal(false);
    setNewPoolName('');
    setNewPoolDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/jobs/freelancer')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Talent Pools</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage groups of trusted freelancers for quick hiring
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Pool
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search talent pools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Talent Pools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => (
            <Card
              key={pool.id}
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer"
              onClick={() => router.push(`/jobs/freelancer/talent-pools/${pool.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                    {pool.name}
                  </CardTitle>
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pool.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {pool.members} {pool.members === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {pool.skills.map((skill) => (
                      <Badge key={skill} variant="primary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/jobs/freelancer/talent-pools/${pool.id}`);
                      }}
                    >
                      Manage Pool
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Pool Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-gray-100">Create Talent Pool</CardTitle>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCreateModal(false)}
                    className="p-1"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pool Name
                  </label>
                  <Input
                    placeholder="e.g., Top React Developers"
                    value={newPoolName}
                    onChange={(e) => setNewPoolName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <Input
                    placeholder="Brief description of the talent pool"
                    value={newPoolDescription}
                    onChange={(e) => setNewPoolDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePool}
                    disabled={!newPoolName}
                    className="flex-1"
                  >
                    Create Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

