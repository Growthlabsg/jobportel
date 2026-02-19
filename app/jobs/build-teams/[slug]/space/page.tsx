'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TeamCard as TeamCardType } from '@/types/platform';
import { ProjectSpace } from '@/types/platform';
import { mockTeamCards } from '@/lib/teams/mock-data';
import { mockProjectSpaces } from '@/lib/teams/mock-project-spaces';
import { ArrowLeft, MessageSquare, CheckSquare, FileText, Target, Users } from 'lucide-react';
import { ChatPanel } from '@/components/teams/ProjectSpace/ChatPanel';
import { TaskBoard } from '@/components/teams/ProjectSpace/TaskBoard';
import { FileManager } from '@/components/teams/ProjectSpace/FileManager';
import { MilestoneTracker } from '@/components/teams/ProjectSpace/MilestoneTracker';

export default function ProjectSpacePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [team, setTeam] = useState<TeamCardType | null>(null);
  const [projectSpace, setProjectSpace] = useState<ProjectSpace | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    const foundTeam = mockTeamCards.find((t) => t.slug === slug);
    setTeam(foundTeam || null);
    
    if (foundTeam?.projectSpaceId) {
      const space = mockProjectSpaces[foundTeam.projectSpaceId];
      setProjectSpace(space || null);
    }
  }, [slug]);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Team Not Found
          </h2>
          <Link href="/jobs/build-teams">
            <Button variant="primary">Browse All Teams</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!projectSpace) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Project Space Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This team hasn&apos;t set up a project space yet.
          </p>
          <Link href={`/jobs/build-teams/${slug}`}>
            <Button variant="primary">Back to Team</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={`/jobs/build-teams/${slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {projectSpace.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {team.name} • {team.members.length} members
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                  {projectSpace.chatMessages.length > 0 && (
                    <Badge variant="info" size="sm">
                      {projectSpace.chatMessages.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Tasks
                  {projectSpace.tasks.length > 0 && (
                    <Badge variant="info" size="sm">
                      {projectSpace.tasks.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Files
                  {projectSpace.files.length > 0 && (
                    <Badge variant="info" size="sm">
                      {projectSpace.files.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="milestones" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Milestones
                  {projectSpace.milestones.length > 0 && (
                    <Badge variant="info" size="sm">
                      {projectSpace.milestones.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <ChatPanel projectSpace={projectSpace} team={team} />
              </TabsContent>

              <TabsContent value="tasks">
                <TaskBoard projectSpace={projectSpace} team={team} />
              </TabsContent>

              <TabsContent value="files">
                <FileManager projectSpace={projectSpace} team={team} />
              </TabsContent>

              <TabsContent value="milestones">
                <MilestoneTracker projectSpace={projectSpace} team={team} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

