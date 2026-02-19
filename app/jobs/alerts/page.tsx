'use client';

import { useState, Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertCard } from '@/components/alerts/AlertCard';
import { JobAlert, CreateAlertData } from '@/types/alert';
import { Plus, Bell, Filter } from 'lucide-react';
import { useJobAlerts, useCreateJobAlert, useUpdateJobAlert, useDeleteJobAlert, useToggleJobAlert } from '@/hooks/useJobAlerts';
import { JobAlert as PlatformJobAlert, CreateJobAlertData } from '@/services/platform/jobAlerts';
import { getCurrencyForUser } from '@/lib/currency-region';

// Mock data fallback for development
const mockAlerts: JobAlert[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Software Engineer Jobs in Singapore',
    keywords: ['React', 'Node.js', 'TypeScript', 'Full Stack'],
    locations: ['Singapore'],
    jobTypes: ['Full-time'],
    experienceLevels: ['Mid', 'Senior'],
    salaryMin: 6000,
    salaryMax: 12000,
    salaryCurrency: 'SGD',
    remoteWork: ['Remote', 'Hybrid'],
    frequency: 'Daily',
    enabled: true,
    lastSent: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Product Manager Roles',
    keywords: ['Product Management', 'B2B', 'SaaS'],
    locations: ['Singapore', 'Remote'],
    jobTypes: ['Full-time'],
    experienceLevels: ['Senior'],
    frequency: 'Weekly',
    enabled: true,
    lastSent: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Data Science Opportunities',
    keywords: ['Data Science', 'Machine Learning', 'Python'],
    locations: ['Singapore', 'London'],
    jobTypes: ['Full-time', 'Contract'],
    skills: ['Python', 'TensorFlow', 'SQL'],
    frequency: 'Monthly',
    enabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function AlertsContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  
  // Use platform API for job alerts
  const { data: platformAlerts = [], isLoading, error } = useJobAlerts();
  const createMutation = useCreateJobAlert();
  const updateMutation = useUpdateJobAlert();
  const deleteMutation = useDeleteJobAlert();
  const toggleMutation = useToggleJobAlert();
  
  // Convert platform alerts to local format for compatibility
  const alerts: JobAlert[] = platformAlerts.length > 0 
    ? (platformAlerts.map(alert => ({
        id: alert.id,
        userId: 'current', // Will be handled by platform
        name: alert.name,
        keywords: (alert.filters as any).keywords || [],
        locations: (() => {
          const locs = Array.isArray(alert.filters.location) 
            ? alert.filters.location 
            : alert.filters.location 
              ? [alert.filters.location] 
              : [];
          return locs.filter(loc => typeof loc === 'string') as any as string[];
        })(),
        jobTypes: (() => {
          const types = Array.isArray(alert.filters.jobType) 
            ? alert.filters.jobType 
            : alert.filters.jobType 
              ? [alert.filters.jobType] 
              : [];
          return types.filter(type => typeof type === 'string') as string[];
        })(),
        experienceLevels: (() => {
          const levels = Array.isArray(alert.filters.experienceLevel) 
            ? alert.filters.experienceLevel 
            : alert.filters.experienceLevel 
              ? [alert.filters.experienceLevel] 
              : [];
          return levels.filter(level => typeof level === 'string') as string[];
        })(),
        salaryMin: alert.filters.salaryMin,
        salaryMax: alert.filters.salaryMax,
        salaryCurrency: (alert.filters as any).salaryCurrency || (typeof window !== 'undefined' ? getCurrencyForUser() : 'USD'),
        remoteWork: (() => {
          const work = Array.isArray(alert.filters.remoteWork) 
            ? alert.filters.remoteWork 
            : alert.filters.remoteWork 
              ? [alert.filters.remoteWork] 
              : [];
          return work.filter(w => typeof w === 'string') as string[];
        })(),
        skills: alert.filters.skills || [],
        frequency: alert.frequency === 'daily' ? 'Daily' : alert.frequency === 'weekly' ? 'Weekly' : 'Monthly',
        enabled: alert.active,
        lastSent: alert.lastSent,
        createdAt: alert.createdAt,
        updatedAt: alert.updatedAt,
      })) as JobAlert[])
    : (error ? [] : mockAlerts);

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'active') return alert.enabled;
    if (filter === 'paused') return !alert.enabled;
    return true;
  });

  const handleCreate = () => {
    setEditingAlert(null);
    setShowForm(true);
  };

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateAlertData) => {
    try {
      if (editingAlert) {
        // Update existing alert
        const platformData: Partial<CreateJobAlertData> = {
          name: data.name,
          filters: {
            keywords: data.keywords,
            location: data.locations as any,
            jobType: data.jobTypes as any,
            experienceLevel: data.experienceLevels as any,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency,
            remoteWork: data.remoteWork as any,
            skills: data.skills,
          } as any,
          frequency: data.frequency.toLowerCase() as 'daily' | 'weekly' | 'instant',
        };
        await updateMutation.mutateAsync({ alertId: editingAlert.id, updates: platformData });
      } else {
        // Create new alert
        const platformData: CreateJobAlertData = {
          name: data.name,
          filters: {
            keywords: data.keywords,
            location: data.locations as any,
            jobType: data.jobTypes as any,
            experienceLevel: data.experienceLevels as any,
            salaryMin: data.salaryMin,
            salaryMax: data.salaryMax,
            salaryCurrency: data.salaryCurrency,
            remoteWork: data.remoteWork as any,
            skills: data.skills,
          } as any,
          frequency: data.frequency.toLowerCase() as 'daily' | 'weekly' | 'instant',
        };
        await createMutation.mutateAsync(platformData);
      }
      setShowForm(false);
      setEditingAlert(null);
    } catch (error) {
      alert('Failed to save alert. Please try again.');
    }
  };
  
  // Old code removed - using platform API now

  const handleDelete = async (alertId: string) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      try {
        await deleteMutation.mutateAsync(alertId);
      } catch (error) {
        alert('Failed to delete alert. Please try again.');
      }
    }
  };

  const handleToggle = async (alertId: string, enabled: boolean) => {
    try {
      await toggleMutation.mutateAsync({ alertId, active: enabled });
    } catch (error) {
      alert('Failed to toggle alert. Please try again.');
    }
  };

  const activeAlerts = alerts.filter((a) => a.enabled).length;
  const totalAlerts = alerts.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Alerts</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Get notified when new jobs match your criteria
              </p>
              {isLoading && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary inline-block"></div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading alerts...</span>
                </div>
              )}
              {error && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">Failed to load alerts. Please try again.</p>
                </div>
              )}
            </div>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Alert
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalAlerts}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeAlerts}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-100">
                    <Bell className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Paused Alerts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {totalAlerts - activeAlerts}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({totalAlerts})
              </Button>
              <Button
                variant={filter === 'active' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('active')}
              >
                Active ({activeAlerts})
              </Button>
              <Button
                variant={filter === 'paused' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('paused')}
              >
                Paused ({totalAlerts - activeAlerts})
              </Button>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          <Card className="border-gray-200 dark:border-gray-700">
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {filter === 'all' ? 'No alerts yet' : `No ${filter} alerts`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Create your first job alert to get notified about new opportunities'
                  : `You don't have any ${filter} alerts at the moment`}
              </p>
              {filter === 'all' && (
                <Button onClick={handleCreate} className="flex items-center gap-2 mx-auto">
                  <Plus className="h-4 w-4" />
                  Create Your First Alert
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Alert Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingAlert(null);
          }}
          title={editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}
          size="large"
        >
          <AlertForm
            initialData={editingAlert || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingAlert(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export default function AlertsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading alerts...</p>
          </div>
        </div>
      }
    >
      <AlertsContent />
    </Suspense>
  );
}
