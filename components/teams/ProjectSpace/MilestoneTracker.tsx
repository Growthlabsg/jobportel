'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProjectSpace } from '@/types/platform';
import { TeamCard as TeamCardType, Milestone } from '@/types/platform';
import { Plus, Target, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface MilestoneTrackerProps {
  projectSpace: ProjectSpace;
  team: TeamCardType;
}

export function MilestoneTracker({ projectSpace, team }: MilestoneTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(projectSpace.milestones || []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: '',
    category: 'product' as Milestone['category'],
  });

  const handleCreateMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.date) return;

    const milestone: Milestone = {
      id: `milestone-${Date.now()}`,
      startupId: team.id,
      title: newMilestone.title,
      description: newMilestone.description,
      date: newMilestone.date,
      category: newMilestone.category,
      createdAt: new Date().toISOString(),
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({ title: '', description: '', date: '', category: 'product' });
    setIsCreateModalOpen(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'funding':
        return 'success';
      case 'product':
        return 'primary';
      case 'growth':
        return 'info';
      default:
        return 'outline';
    }
  };

  const isPastDue = (date: string) => {
    return new Date(date) < new Date();
  };

  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Milestones</h3>
        <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No milestones set yet.</p>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Milestone
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMilestones.map((milestone) => (
            <Card
              key={milestone.id}
              className={`${
                isPastDue(milestone.date) ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-primary'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {milestone.title}
                      </h4>
                      <Badge variant={getCategoryColor(milestone.category)} size="sm">
                        {milestone.category}
                      </Badge>
                      {isPastDue(milestone.date) && (
                        <Badge variant="error" size="sm">
                          Past Due
                        </Badge>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {milestone.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(milestone.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Milestone Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Milestone"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Milestone Title *"
            placeholder="e.g., MVP Launch, Beta Testing"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe what this milestone represents..."
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Date *"
              type="date"
              value={newMilestone.date}
              onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={newMilestone.category}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    category: e.target.value as Milestone['category'],
                  })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="product">Product</option>
                <option value="funding">Funding</option>
                <option value="growth">Growth</option>
                <option value="partnership">Partnership</option>
                <option value="team">Team</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button variant="primary" onClick={handleCreateMilestone} className="flex-1">
              Create Milestone
            </Button>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

