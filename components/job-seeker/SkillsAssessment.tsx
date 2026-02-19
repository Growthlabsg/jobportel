'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { 
  Brain, 
  Award, 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Play,
  BookOpen,
} from 'lucide-react';
import { SkillTest, SkillAssessment } from '@/types/skills';

interface SkillsAssessmentProps {
  skills?: SkillTest[];
  assessments?: SkillAssessment[];
}

export function SkillsAssessment({ skills = [], assessments = [] }: SkillsAssessmentProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillTest | null>(null);

  // Mock data
  const mockSkills: SkillTest[] = [
    {
      id: '1',
      skillId: 'react',
      skillName: 'React',
      category: 'Frontend',
      difficulty: 'Intermediate',
      questions: [],
      passingScore: 70,
      description: 'Test your React knowledge including hooks, components, and state management',
      estimatedTime: 30,
    },
    {
      id: '2',
      skillId: 'nodejs',
      skillName: 'Node.js',
      category: 'Backend',
      difficulty: 'Advanced',
      questions: [],
      passingScore: 75,
      description: 'Assess your Node.js expertise including async operations, APIs, and best practices',
      estimatedTime: 45,
    },
    {
      id: '3',
      skillId: 'typescript',
      skillName: 'TypeScript',
      category: 'Language',
      difficulty: 'Intermediate',
      questions: [],
      passingScore: 70,
      description: 'Evaluate your TypeScript skills including types, interfaces, and generics',
      estimatedTime: 30,
    },
  ];

  const mockAssessments: SkillAssessment[] = [
    {
      id: '1',
      skillId: 'react',
      skillName: 'React',
      userId: 'user1',
      score: 85,
      level: 'Advanced',
      testResults: {
        questions: 20,
        correct: 17,
        timeSpent: 25,
        date: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displaySkills = skills.length > 0 ? skills : mockSkills;
  const displayAssessments = assessments.length > 0 ? assessments : mockAssessments;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Advanced':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Intermediate':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Expert':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Advanced':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Skills Assessment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Test and certify your technical skills</p>
          </div>
        </div>

        {/* Your Assessments */}
        {displayAssessments.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Assessments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayAssessments.map((assessment) => (
                <Card key={assessment.id} className="p-4 border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-gray-100">{assessment.skillName}</h5>
                      <Badge className={getLevelColor(assessment.level)}>
                        {assessment.level}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{assessment.score}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Score</div>
                    </div>
                  </div>
                  {assessment.testResults && (
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">
                          {assessment.testResults.correct}/{assessment.testResults.questions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{assessment.testResults.timeSpent} min</span>
                      </div>
                    </div>
                  )}
                  <Progress value={assessment.score} className="mb-3" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Award className="h-4 w-4 mr-2" />
                      View Certificate
                    </Button>
                    <Button size="sm" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Tests */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Available Tests</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySkills.map((skill) => {
              const assessment = displayAssessments.find(a => a.skillId === skill.skillId);
              return (
                <Card key={skill.id} className="p-4 border-2 border-gray-200 hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{skill.skillName}</h5>
                      <Badge className={getDifficultyColor(skill.difficulty)}>
                        {skill.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="default" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{skill.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{skill.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>{skill.passingScore}% to pass</span>
                    </div>
                  </div>
                  {assessment ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Your Score:</span>
                        <span className="font-bold text-primary">{assessment.score}%</span>
                      </div>
                      <Progress value={assessment.score} />
                      <Button size="sm" variant="outline" className="w-full">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Retake Test
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Test
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

