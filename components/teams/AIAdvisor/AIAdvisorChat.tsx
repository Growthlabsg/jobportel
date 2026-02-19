'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { AIAdvisorSession, AIAdvisorMessage, AnalysisData } from '@/types/platform';
import { Send, Bot, User, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface AIAdvisorChatProps {
  session: AIAdvisorSession | null;
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  creditsRemaining?: number;
}

export function AIAdvisorChat({
  session,
  onSendMessage,
  isLoading = false,
  creditsRemaining = 0,
}: AIAdvisorChatProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const messageText = message;
    setMessage('');
    await onSendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderAnalysisData = (data: AnalysisData) => {
    return (
      <div className="mt-4 space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {data.ideaScore !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Idea Score
            </span>
            <Badge
              variant={data.ideaScore >= 70 ? 'success' : data.ideaScore >= 50 ? 'warning' : 'error'}
              size="md"
            >
              {data.ideaScore}/100
            </Badge>
          </div>
        )}

        {data.strengths && data.strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Strengths
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-6">
              {data.strengths.map((strength, idx) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
        )}

        {data.weaknesses && data.weaknesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Areas for Improvement
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-6">
              {data.weaknesses.map((weakness, idx) => (
                <li key={idx}>{weakness}</li>
              ))}
            </ul>
          </div>
        )}

        {data.marketSize && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Market Size
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{data.marketSize}</p>
          </div>
        )}

        {data.competition && data.competition.length > 0 && (
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Key Competitors:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.competition.map((comp, idx) => (
                <Badge key={idx} variant="outline" size="sm">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Recommendations:
            </span>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
              {data.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        {data.nextSteps && data.nextSteps.length > 0 && (
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Next Steps:
            </span>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
              {data.nextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Advisor</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {creditsRemaining} credits remaining
            </p>
          </div>
        </div>
        <Badge variant="info" size="sm">
          <Sparkles className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {!session || session.messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="mb-2">Start a conversation with your AI Advisor</p>
            <p className="text-sm">
              Ask about idea validation, business guidance, or market analysis
            </p>
          </div>
        ) : (
          session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.analysisData && renderAnalysisData(msg.analysisData)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {formatRelativeTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Input
          placeholder="Ask about your idea, business strategy, or market..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
          disabled={isLoading || creditsRemaining === 0}
        />
        <Button
          variant="primary"
          size="md"
          onClick={handleSend}
          disabled={!message.trim() || isLoading || creditsRemaining === 0}
          isLoading={isLoading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {creditsRemaining === 0 && (
        <p className="text-xs text-red-500 mt-2 text-center">
          No credits remaining. Please purchase a plan to continue.
        </p>
      )}
    </div>
  );
}

