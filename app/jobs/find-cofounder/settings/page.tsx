'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  UserCheck,
  Settings,
  Bell,
  Lock,
  Target,
  User,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Shield,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function CofounderSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newMatches: true,
    messages: true,
    profileViews: true,
    weeklyDigest: true,
    marketing: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    newMatches: true,
    messages: true,
    profileViews: false,
    reminders: true,
  });

  const [digestFrequency, setDigestFrequency] = useState('weekly');
  const [reminderFrequency, setReminderFrequency] = useState('daily');

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastActive: true,
    showLocation: true,
    showContactInfo: false,
    makeSearchable: true,
    whoCanMessage: 'everyone',
  });

  // Matching preferences
  const [matchingPreferences, setMatchingPreferences] = useState({
    maxDistance: 50,
    minCompatibility: 50,
    ageRange: [25, 45],
    autoMatch: true,
    experienceLevels: ['intermediate', 'expert'],
    industries: ['AI', 'Fintech'],
    workStyles: ['remote', 'hybrid'],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] via-white to-[#F1F5F9] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200/60 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-6 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-4">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-primary">Settings</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white mb-3 gradient-text">
                Co-Founder Matching Settings
              </h1>
              <p className="text-base text-[#64748B] dark:text-gray-400">
                Manage your preferences and privacy settings
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100/80 dark:bg-gray-800/80">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="matching" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Matching</span>
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notification Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Notifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(emailNotifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                            <label className="text-sm text-[#64748B] dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setEmailNotifications((prev) => ({ ...prev, [key]: e.target.checked }))
                              }
                              className="rounded border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4 flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Push Notifications
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(pushNotifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                            <label className="text-sm text-[#64748B] dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setPushNotifications((prev) => ({ ...prev, [key]: e.target.checked }))
                              }
                              className="rounded border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                          Digest Frequency
                        </label>
                        <select
                          value={digestFrequency}
                          onChange={(e) => setDigestFrequency(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                          Reminder Frequency
                        </label>
                        <select
                          value={reminderFrequency}
                          onChange={(e) => setReminderFrequency(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>

                    <Button className="w-full">Save Notification Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4">
                        Profile Visibility
                      </h3>
                      <div className="space-y-3">
                        {['public', 'connections', 'private'].map((option) => (
                          <div key={option} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option}
                              checked={privacySettings.profileVisibility === option}
                              onChange={(e) =>
                                setPrivacySettings((prev) => ({ ...prev, profileVisibility: e.target.value }))
                              }
                              className="rounded border-gray-300"
                            />
                            <label className="text-sm text-[#64748B] dark:text-gray-400 capitalize flex-1">
                              {option === 'public' && 'Public (Everyone can see your profile)'}
                              {option === 'connections' && 'Connections only (Only your connections can see)'}
                              {option === 'private' && 'Private (Only you can see)'}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4">
                        Status Display
                      </h3>
                      <div className="space-y-3">
                        {['showOnlineStatus', 'showLastActive', 'showLocation', 'showContactInfo', 'makeSearchable'].map((key) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                            <label className="text-sm text-[#64748B] dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <input
                              type="checkbox"
                              checked={(privacySettings as any)[key]}
                              onChange={(e) =>
                                setPrivacySettings((prev) => ({ ...prev, [key]: e.target.checked }))
                              }
                              className="rounded border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                        Who can message you
                      </label>
                      <select
                        value={privacySettings.whoCanMessage}
                        onChange={(e) =>
                          setPrivacySettings((prev) => ({ ...prev, whoCanMessage: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-700"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="connections">Connections only</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <Button className="w-full">Save Privacy Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matching">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Matching Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                        Maximum Distance (miles)
                      </label>
                      <Input
                        type="number"
                        value={matchingPreferences.maxDistance}
                        onChange={(e) =>
                          setMatchingPreferences((prev) => ({
                            ...prev,
                            maxDistance: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                        Minimum Compatibility (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={matchingPreferences.minCompatibility}
                        onChange={(e) =>
                          setMatchingPreferences((prev) => ({
                            ...prev,
                            minCompatibility: parseInt(e.target.value),
                          }))
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1">
                        {matchingPreferences.minCompatibility}%
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#64748B] dark:text-gray-400 mb-2">
                        Age Range
                      </label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          value={matchingPreferences.ageRange[0]}
                          onChange={(e) =>
                            setMatchingPreferences((prev) => ({
                              ...prev,
                              ageRange: [parseInt(e.target.value) || 25, prev.ageRange[1]],
                            }))
                          }
                          placeholder="Min"
                          className="w-24"
                        />
                        <span className="text-[#64748B]">to</span>
                        <Input
                          type="number"
                          value={matchingPreferences.ageRange[1]}
                          onChange={(e) =>
                            setMatchingPreferences((prev) => ({
                              ...prev,
                              ageRange: [prev.ageRange[0], parseInt(e.target.value) || 45],
                            }))
                          }
                          placeholder="Max"
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoMatch"
                        checked={matchingPreferences.autoMatch}
                        onChange={(e) =>
                          setMatchingPreferences((prev) => ({ ...prev, autoMatch: e.target.checked }))
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="autoMatch" className="text-sm text-[#64748B] dark:text-gray-400">
                        Enable auto-matching
                      </label>
                    </div>

                    <Button className="w-full">Save Matching Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account">
                <Card className="border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Account Security
                      </h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          Change Password
                        </Button>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200/60 dark:border-gray-700/60">
                          <div>
                            <p className="text-sm font-medium text-[#1E293B] dark:text-white">
                              Two-Factor Authentication
                            </p>
                            <p className="text-xs text-[#64748B] dark:text-gray-400">
                              Add an extra layer of security
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full justify-start">
                          View Login Sessions
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200/60 pt-6">
                      <h3 className="text-lg font-semibold text-[#1E293B] dark:text-white mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        Danger Zone
                      </h3>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                          Deactivate Account
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

