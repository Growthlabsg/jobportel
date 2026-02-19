'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ProjectSpace, ProjectTask } from '@/types/platform';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, User } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface TaskBoardProps {
  projectSpace: ProjectSpace;
  team: TeamCardType;
}

export function TaskBoard({ projectSpace, team }: TaskBoardProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(projectSpace.tasks || []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    review: tasks.filter((t) => t.status === 'review'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      projectSpaceId: projectSpace.id,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsCreateModalOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'outline';
    }
  };

  const TaskCard = ({ task }: { task: ProjectTask }) => (
    <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{task.title}</h4>
          <Badge variant={getPriorityColor(task.priority)} size="sm">
            {task.priority}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-3">
            {task.assignedToName && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.assignedToName}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Board</h3>
        <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* To Do */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Circle className="w-4 h-4 text-gray-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">To Do</h4>
            <Badge variant="outline" size="sm">
              {tasksByStatus.todo.length}
            </Badge>
          </div>
          <div className="space-y-2 min-h-[200px]">
            {tasksByStatus.todo.map((task) => (
              <div key={task.id} onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">In Progress</h4>
            <Badge variant="outline" size="sm">
              {tasksByStatus['in-progress'].length}
            </Badge>
          </div>
          <div className="space-y-2 min-h-[200px]">
            {tasksByStatus['in-progress'].map((task) => (
              <div key={task.id} onClick={() => handleUpdateTaskStatus(task.id, 'review')}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Review</h4>
            <Badge variant="outline" size="sm">
              {tasksByStatus.review.length}
            </Badge>
          </div>
          <div className="space-y-2 min-h-[200px]">
            {tasksByStatus.review.map((task) => (
              <div key={task.id} onClick={() => handleUpdateTaskStatus(task.id, 'done')}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>

        {/* Done */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Done</h4>
            <Badge variant="outline" size="sm">
              {tasksByStatus.done.length}
            </Badge>
          </div>
          <div className="space-y-2 min-h-[200px]">
            {tasksByStatus.done.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Task Title *"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })
                }
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Button variant="primary" onClick={handleCreateTask} className="flex-1">
              Create Task
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

