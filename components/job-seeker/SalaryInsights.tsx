'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Lightbulb,
  Target,
  AlertCircle,
} from 'lucide-react';
import { SalaryInsight } from '@/types/salary';

interface SalaryInsightsProps {
  role?: string;
  location?: string;
  experience?: string;
}

export function SalaryInsights({ role = 'Software Engineer', location = 'Singapore', experience = 'Senior' }: SalaryInsightsProps) {
  const [yourSalary, setYourSalary] = useState<number | undefined>();
  const [insight, setInsight] = useState<SalaryInsight | null>(null);

  const handleAnalyze = () => {
    // Mock salary insight
    const mockInsight: SalaryInsight = {
      role,
      location,
      yourSalary,
      marketAverage: 12000,
      marketMedian: 11500,
      percentile: yourSalary ? (yourSalary >= 12000 ? 75 : yourSalary >= 10000 ? 50 : 25) : undefined,
      recommendation: yourSalary 
        ? (yourSalary >= 12000 ? 'Above Market' : yourSalary >= 10000 ? 'At Market' : 'Below Market')
        : 'At Market',
      negotiationTips: [
        'Research shows you could negotiate 10-15% higher',
        'Highlight your unique skills and achievements',
        'Consider total compensation package, not just base salary',
        'Timing matters - negotiate after receiving an offer',
        'Be prepared with data to support your request',
      ],
      comparableRoles: [
        { role: 'Full Stack Developer', averageSalary: 12500 },
        { role: 'Backend Engineer', averageSalary: 11800 },
        { role: 'Frontend Engineer', averageSalary: 11000 },
      ],
    };
    setInsight(mockInsight);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Salary Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Compare your salary with market data</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Current Salary</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={yourSalary || ''}
              onChange={(e) => setYourSalary(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <Input
              type="text"
              value={role}
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <Input
              type="text"
              value={location}
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>

        <Button onClick={handleAnalyze} className="w-full">
          Analyze Salary
        </Button>

        {insight && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Average</span>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  ${insight.marketAverage.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">Based on {insight.comparableRoles.length * 50} data points</div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Market Median</span>
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">
                  ${insight.marketMedian.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 mt-1">50th percentile</div>
              </Card>

              {insight.yourSalary && (
                <Card className={`p-4 bg-gradient-to-br ${
                  insight.recommendation === 'Above Market' 
                    ? 'from-green-50 to-green-100 border-green-200'
                    : insight.recommendation === 'At Market'
                    ? 'from-blue-50 to-blue-100 border-blue-200'
                    : 'from-orange-50 to-orange-100 border-orange-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Position</span>
                    {insight.recommendation === 'Above Market' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : insight.recommendation === 'Below Market' ? (
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    ${insight.yourSalary.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {insight.percentile}th percentile
                  </div>
                </Card>
              )}
            </div>

            {insight.recommendation !== 'At Market' && (
              <Card className={`p-4 border-2 ${
                insight.recommendation === 'Above Market'
                  ? 'border-green-200 bg-green-50'
                  : 'border-orange-200 bg-orange-50'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`h-5 w-5 ${
                    insight.recommendation === 'Above Market' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {insight.recommendation === 'Above Market' 
                        ? 'You\'re Above Market Average!' 
                        : 'You\'re Below Market Average'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insight.recommendation === 'Above Market'
                        ? 'Your salary is competitive. Consider negotiating for additional benefits or equity.'
                        : 'Consider negotiating for a higher salary. Use the tips below to prepare.'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Negotiation Tips
              </h4>
              <ul className="space-y-2">
                {insight.negotiationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Comparable Roles</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insight.comparableRoles.map((comp, idx) => (
                  <Card key={idx} className="p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{comp.role}</div>
                    <div className="text-lg font-bold text-primary">
                      ${comp.averageSalary.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Average salary</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

