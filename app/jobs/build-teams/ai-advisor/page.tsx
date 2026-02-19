'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { AIAdvisorChat } from '@/components/teams/AIAdvisor/AIAdvisorChat';
import { AIAdvisorSession, AIAdvisorPlan } from '@/types/platform';
import { aiAdvisorPlans } from '@/lib/ai-advisor/mock-plans';
import { Bot, Sparkles, Check, ArrowLeft, ExternalLink, Users } from 'lucide-react';
import { mockTeamCards } from '@/lib/teams/mock-data';

export default function AIAdvisorPage() {
  const [activeSession, setActiveSession] = useState<AIAdvisorSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AIAdvisorPlan | null>(null);
  const [activeTab, setActiveTab] = useState('chat');

  // Mock: Check if user has credits (in real app, fetch from API)
  useEffect(() => {
    // Simulate checking user credits
    setCreditsRemaining(5); // Mock: user has 5 credits
  }, []);

  const handleSendMessage = async (message: string) => {
    if (creditsRemaining === 0) {
      setIsPlanModalOpen(true);
      return;
    }

    setIsLoading(true);

    // Create or update session
    if (!activeSession) {
      const newSession: AIAdvisorSession = {
        id: `session-${Date.now()}`,
        userId: 'current-user',
        type: 'general',
        status: 'active',
        messages: [
          {
            id: `msg-user-${Date.now()}`,
            sessionId: `session-${Date.now()}`,
            role: 'user',
            content: message,
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creditsUsed: 0,
      };
      setActiveSession(newSession);
    } else {
      // Add user message
      const userMessage: typeof activeSession.messages[0] = {
        id: `msg-user-${Date.now()}`,
        sessionId: activeSession.id,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      setActiveSession({
        ...activeSession,
        messages: [...activeSession.messages, userMessage],
      });
    }

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate AI response based on message type
    const aiResponse = generateAIResponse(message);

    if (activeSession) {
      setActiveSession({
        ...activeSession,
        messages: [
          ...(activeSession.messages || []),
          {
            id: `msg-ai-${Date.now()}`,
            sessionId: activeSession.id,
            role: 'assistant',
            content: aiResponse.content,
            analysisData: aiResponse.analysisData,
            createdAt: new Date().toISOString(),
          },
        ],
        creditsUsed: activeSession.creditsUsed + 1,
      });
      setCreditsRemaining(Math.max(0, creditsRemaining - 1));
    }

    setIsLoading(false);
  };

  const generateAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Idea validation response
    if (lowerMessage.includes('idea') || lowerMessage.includes('validate')) {
      return {
        content:
          "Based on your description, I've analyzed your idea. Here's my assessment:",
        analysisData: {
          ideaScore: 75,
          strengths: [
            'Addresses a real market need',
            'Scalable business model potential',
            'Clear target audience identified',
          ],
          weaknesses: [
            'Competitive landscape needs deeper analysis',
            'Revenue model could be more defined',
            'Consider MVP validation approach',
          ],
          marketSize: 'Estimated market size: $500M - $1B (TAM)',
          competition: ['Competitor A', 'Competitor B', 'Competitor C'],
          recommendations: [
            'Conduct user interviews to validate demand',
            'Build a minimal viable product (MVP)',
            'Define clear value proposition',
            'Research pricing strategies',
          ],
          nextSteps: [
            'Create a detailed business plan',
            'Build a prototype or MVP',
            'Test with target users',
            'Refine based on feedback',
          ],
        } as any,
      };
    }

    // Market analysis response
    if (lowerMessage.includes('market') || lowerMessage.includes('analysis')) {
      return {
        content: 'Here is a comprehensive market analysis for your industry:',
        analysisData: {
          marketSize: 'Total Addressable Market (TAM): $2.5B, Serviceable Addressable Market (SAM): $500M',
          competition: ['Major Player 1', 'Major Player 2', 'Emerging Competitor'],
          recommendations: [
            'Focus on underserved market segments',
            'Differentiate through unique value proposition',
            'Consider partnership opportunities',
          ],
        } as any,
      };
    }

    // Business guidance response
    if (lowerMessage.includes('business') || lowerMessage.includes('strategy')) {
      return {
        content:
          'Here are strategic recommendations for your business development:',
        analysisData: {
          recommendations: [
            'Develop a clear go-to-market strategy',
            'Build strategic partnerships',
            'Focus on customer acquisition channels',
            'Establish key performance indicators (KPIs)',
          ],
          nextSteps: [
            'Define your target customer segments',
            'Create a marketing plan',
            'Set up analytics and tracking',
            'Plan for scalability',
          ],
        } as any,
      };
    }

    // Default response
    return {
      content:
        "I'm your AI Advisor, here to help with idea validation, business guidance, and market analysis. How can I assist you today?",
    };
  };

  const handlePurchasePlan = async (plan: AIAdvisorPlan) => {
    // Simulate purchase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCreditsRemaining(plan.credits);
    setIsPlanModalOpen(false);
    setSelectedPlan(null);
    alert(`Successfully purchased ${plan.name} plan!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/jobs/build-teams">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Build Teams
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Bot className="w-8 h-8 text-primary" />
                AI Advisor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Get expert guidance on your startup ideas, business strategy, and market analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/network/mentor-marketplace" target="_blank">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Connect with Mentors
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </Link>
            <Button variant="primary" size="sm" onClick={() => setIsPlanModalOpen(true)}>
              <Sparkles className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <AIAdvisorChat
                  session={activeSession}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  creditsRemaining={creditsRemaining}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  What is AI Advisor?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  AI Advisor is your intelligent business consultant powered by advanced AI. Get
                  instant insights on:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Idea validation and scoring</li>
                  <li>Market analysis and trends</li>
                  <li>Business strategy guidance</li>
                  <li>Competitive landscape insights</li>
                  <li>Risk assessment</li>
                  <li>Next steps recommendations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('Validate my startup idea')}
                  disabled={creditsRemaining === 0}
                >
                  Validate Idea
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('Analyze the market for my industry')}
                  disabled={creditsRemaining === 0}
                >
                  Market Analysis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleSendMessage('Give me business strategy advice')}
                  disabled={creditsRemaining === 0}
                >
                  Business Guidance
                </Button>
              </CardContent>
            </Card>

            {/* Credits */}
            <Card>
              <CardHeader>
                <CardTitle>Your Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">{creditsRemaining}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  AI Advisor sessions remaining
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsPlanModalOpen(true)}
                >
                  Purchase More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Purchase Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Purchase AI Advisor Credits"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose a plan that fits your needs. Each credit allows one AI Advisor session.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiAdvisorPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  plan.popular ? 'border-2 border-primary' : ''
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <CardContent className="p-6">
                  {plan.popular && (
                    <Badge variant="primary" size="sm" className="mb-2">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    onClick={() => handlePurchasePlan(plan)}
                  >
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

