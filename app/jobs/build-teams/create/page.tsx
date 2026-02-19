'use client';

import { CreateTeamForm } from '@/components/teams/CreateTeamForm';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function CreateTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/jobs/build-teams">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
        <CreateTeamForm />
      </div>
    </div>
  );
}

