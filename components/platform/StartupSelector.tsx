/**
 * Startup Selector Component
 * Allows users to select a startup from the Startup Directory when posting jobs
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useMyStartups, useStartups } from '@/hooks/useStartups';
import { Startup } from '@/types/platform';
import { Building, Search, Check, Loader2 } from 'lucide-react';

interface StartupSelectorProps {
  value?: string;
  onChange: (startupId: string | null) => void;
  required?: boolean;
  label?: string;
}

export const StartupSelector = ({
  value,
  onChange,
  required = false,
  label = 'Select Startup',
}: StartupSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch user's startups (startups they can post jobs for)
  const { data: myStartups, isLoading: loadingMyStartups } = useMyStartups();

  // Fetch all startups if search query is provided
  const { data: allStartups, isLoading: loadingAllStartups } = useStartups(
    1,
    20,
    searchQuery || undefined
  );

  const selectedStartup = myStartups?.find((s) => s.id === value) || 
    allStartups?.items.find((s) => s.id === value);

  const displayStartups = searchQuery
    ? allStartups?.items || []
    : myStartups || [];

  const isLoading = loadingMyStartups || loadingAllStartups;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <div
          className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors flex items-center justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedStartup ? (
            <div className="flex items-center gap-3 flex-1">
              {selectedStartup.logo && (
                <img
                  src={selectedStartup.logo}
                  alt={selectedStartup.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{selectedStartup.name}</p>
                <p className="text-sm text-gray-500 truncate">{selectedStartup.industry}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Building className="h-5 w-5" />
              <span>Select a startup...</span>
            </div>
          )}
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <Card className="absolute z-20 w-full mt-2 max-h-96 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-3 border-b">
                  <Input
                    placeholder="Search startups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-6 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400 dark:text-gray-500" />
                      <p className="text-sm text-gray-500 mt-2">Loading startups...</p>
                    </div>
                  ) : displayStartups.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No startups found</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {displayStartups.map((startup) => (
                        <button
                          key={startup.id}
                          onClick={() => {
                            onChange(startup.id);
                            setShowDropdown(false);
                            setSearchQuery('');
                          }}
                          className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                            value === startup.id ? 'bg-primary/5' : ''
                          }`}
                        >
                          {startup.logo && (
                            <img
                              src={startup.logo}
                              alt={startup.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{startup.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">{startup.industry}</p>
                              {startup.fundingStage && (
                                <>
                                  <span className="text-gray-400 dark:text-gray-500">•</span>
                                  <Badge variant="outline" size="sm">
                                    {startup.fundingStage}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          {value === startup.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {selectedStartup && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Selected Startup:</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedStartup.name}</p>
          <p className="text-xs text-gray-500 mt-1">{selectedStartup.description}</p>
        </div>
      )}
    </div>
  );
};

