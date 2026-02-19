'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { X, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { MatchResult } from '@/types/cofounder';

interface DetailedMatchAnalysisModalProps {
  match: MatchResult;
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedMatchAnalysisModal({
  match,
  isOpen,
  onClose,
}: DetailedMatchAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-2">
              Detailed Match Analysis
            </h2>
            <p className="text-sm text-[#64748B] dark:text-gray-400">
              Compatibility breakdown with {match.profile.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-800/80">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="values">Values</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {match.detailedBreakdown.skillFit}%
                    </div>
                    <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">
                      Skill Fit
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {match.detailedBreakdown.valueAlignment}%
                    </div>
                    <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">
                      Value Alignment
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {match.detailedBreakdown.goalAlignment}%
                    </div>
                    <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">
                      Goal Alignment
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200/60 dark:border-gray-700/60">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {match.detailedBreakdown.experienceFit}%
                    </div>
                    <div className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">
                      Experience Fit
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200/60 dark:border-gray-700/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Match Reasons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {match.matchReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#64748B] dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Complementary Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {match.breakdown.skills.complementary.length > 0 ? (
                        match.breakdown.skills.complementary.map((skill) => (
                          <Badge key={skill} variant="success" size="sm" className="block w-fit">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No complementary skills</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                      Overlapping Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {match.breakdown.skills.overlapping.length > 0 ? (
                        match.breakdown.skills.overlapping.map((skill) => (
                          <Badge key={skill} variant="info" size="sm" className="block w-fit">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No overlapping skills</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      Missing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {match.breakdown.skills.missing.length > 0 ? (
                        match.breakdown.skills.missing.map((skill) => (
                          <Badge key={skill} variant="warning" size="sm" className="block w-fit">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No missing skills</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="values" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Aligned Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {match.breakdown.values.aligned.length > 0 ? (
                        match.breakdown.values.aligned.map((value) => (
                          <Badge key={value} variant="success" size="sm">
                            {value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No aligned values</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Potential Conflicts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {match.breakdown.values.conflicting.length > 0 ? (
                        match.breakdown.values.conflicting.map((value) => (
                          <Badge key={value} variant="error" size="sm">
                            {value}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No conflicts</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Shared Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {match.breakdown.goals.shared.length > 0 ? (
                        match.breakdown.goals.shared.map((goal) => (
                          <Badge key={goal} variant="success" size="sm">
                            {goal}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No shared goals</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                      Different Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {match.breakdown.goals.different.length > 0 ? (
                        match.breakdown.goals.different.map((goal) => (
                          <Badge key={goal} variant="outline" size="sm">
                            {goal}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-[#64748B]">No different goals</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/60 dark:border-gray-700/60 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

