'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  DollarSign, 
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calculator,
  FileText,
  Target,
  Clock,
  Copy,
} from 'lucide-react';

function SalaryNegotiationContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide uppercase">Salary Negotiation</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Negotiate Your Worth
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
              Master the art of salary negotiation and get the compensation you deserve
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 shadow-sm mb-8">
            <TabsTrigger value="guide" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Guide
            </TabsTrigger>
            <TabsTrigger value="tips" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Tips & Strategies
            </TabsTrigger>
            <TabsTrigger value="calculator" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Calculator
            </TabsTrigger>
            <TabsTrigger value="templates" className="px-6 py-3 text-sm font-semibold rounded-lg">
              Email Templates
            </TabsTrigger>
          </TabsList>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Before Negotiation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Research Market Rates</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use salary guides and job postings to understand the market rate for your role and experience level.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Know Your Value</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      List your skills, achievements, and unique contributions that justify your desired salary.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Set Your Range</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Determine your minimum acceptable salary and ideal target. Aim for 10-20% above the initial offer.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    During Negotiation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Be Professional</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Express enthusiasm for the role while discussing compensation. Frame it as a collaborative discussion.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reference market research and your experience level to support your request.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Consider Total Package</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Look beyond base salary - consider benefits, equity, bonuses, and professional development opportunities.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    After Negotiation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Get It in Writing</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ensure all agreed-upon terms are documented in your offer letter or employment contract.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Express Gratitude</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Thank the employer for their flexibility and express excitement about joining the team.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Plan for Future</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Discuss performance review cycles and opportunities for salary increases based on achievements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Wait for the Right Moment',
                  content: 'Don\'t negotiate too early. Wait until you have an offer, then express your interest and discuss compensation.',
                  icon: Clock,
                  type: 'tip',
                },
                {
                  title: 'Use the "I" Statement',
                  content: 'Frame requests around your value: &quot;Based on my experience with X, I was hoping we could discuss a salary of Y.&quot;',
                  icon: MessageSquare,
                  type: 'tip',
                },
                {
                  title: 'Practice Your Pitch',
                  content: 'Rehearse your negotiation points. Be confident, clear, and ready to explain why you deserve the higher salary.',
                  icon: Target,
                  type: 'tip',
                },
                {
                  title: 'Be Ready to Walk Away',
                  content: 'Know your walk-away point. If the offer doesn\'t meet your minimum requirements, be prepared to decline politely.',
                  icon: AlertCircle,
                  type: 'warning',
                },
                {
                  title: 'Negotiate More Than Salary',
                  content: 'If salary is fixed, negotiate other benefits: signing bonus, equity, flexible hours, remote work, or professional development budget.',
                  icon: Lightbulb,
                  type: 'tip',
                },
                {
                  title: 'Stay Positive',
                  content: 'Keep the conversation collaborative, not confrontational. Show that you\'re excited about the opportunity.',
                  icon: CheckCircle2,
                  type: 'tip',
                },
              ].map((tip, index) => (
                <Card key={index} className="border-2 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        tip.type === 'warning' ? 'bg-yellow-100' : 'bg-primary/10'
                      }`}>
                        <tip.icon className={`h-6 w-6 ${
                          tip.type === 'warning' ? 'text-yellow-600' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tip.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Salary Negotiation Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current/Initial Offer (USD/month)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="8000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Desired Increase (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="15"
                    />
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-gray-600 mb-1">Negotiated Salary</p>
                    <p className="text-3xl font-bold text-primary">$7,000/month</p>
                    <p className="text-sm text-gray-600 mt-2">Annual: $84,000</p>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Initial Counter-Offer',
                  scenario: 'When you receive an offer below your expectations',
                  content: `Thank you for the offer! I'm very excited about the opportunity to join [Company Name] as [Position]. 

Based on my research of the market rate for this role and my [X years] of experience in [relevant skills], I was hoping we could discuss a salary of [desired amount]. 

I'm confident that my experience with [key achievements] will bring significant value to the team. Would you be open to discussing this?`,
                },
                {
                  title: 'Negotiating Benefits',
                  scenario: 'When salary is fixed but you want better benefits',
                  content: `Thank you for the offer! I'm thrilled about joining [Company Name].

I understand the salary is set at [amount]. I was wondering if we could discuss the benefits package, particularly [specific benefit: equity, signing bonus, flexible hours, etc.].

Given my experience and the value I'll bring, I believe this would make the offer more competitive. What are your thoughts?`,
                },
                {
                  title: 'Accepting with Gratitude',
                  scenario: 'When you accept the negotiated offer',
                  content: `Thank you for working with me on the compensation package. I'm delighted to accept the offer for [Position] at [Company Name] with the agreed-upon salary of [amount] and [benefits].

I'm very excited to join the team and contribute to [Company Name]'s success. I look forward to starting on [date].

Thank you again for this opportunity!`,
                },
                {
                  title: 'Declining Politely',
                  scenario: 'When the offer doesn\'t meet your requirements',
                  content: `Thank you for the offer for [Position] at [Company Name]. I truly appreciate the time you've invested in the interview process.

After careful consideration, I've decided to pursue another opportunity that better aligns with my career goals and compensation expectations at this time.

I wish [Company Name] all the best and hope we might have the opportunity to work together in the future.`,
                },
              ].map((template, index) => (
                <Card key={index} className="border-2 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>{template.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{template.scenario}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{template.content}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function SalaryNegotiationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <SalaryNegotiationContent />
    </Suspense>
  );
}
