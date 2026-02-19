'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Settings, 
  Bell, 
  Shield, 
  Users, 
  Mail, 
  Globe, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
// Note: Select component needs to be simplified for now
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export default function JobSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    newApplicationEmail: true,
    jobViewEmail: true,
    weeklySummaryEmail: false,
    dailyDigestEmail: true,
    instantNotifications: true,
    
    // Application Settings
    defaultApplicationMethod: 'platform',
    autoApproveApplications: false,
    requireCoverLetter: true,
    requireResume: true,
    allowExternalApplications: true,
    applicationDeadline: 30,
    
    // Privacy Settings
    showCompanyName: true,
    showContactInfo: true,
    allowAnonymousApplications: false,
    requireLoginToApply: true,
    
    // Branding Settings
    companyLogo: '',
    brandColor: '#0F7377',
    customEmailTemplate: false,
    emailSignature: '',
    
    // Integration Settings
    linkedinIntegration: false,
    indeedIntegration: false,
    glassdoorIntegration: false,
    googleJobsIntegration: true,
    
    // Advanced Settings
    autoCloseJobs: false,
    autoCloseAfterDays: 90,
    requireApproval: false,
    enableAnalytics: true,
    enableAITools: false
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/jobs/hire-talents" className="flex items-center text-primary hover:underline">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Hire Talents
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Settings</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure your job posting preferences</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-dark">
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable all email notifications</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">New Application Alerts</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when someone applies to your jobs</p>
                    </div>
                    <Switch
                      checked={settings.newApplicationEmail}
                      onCheckedChange={(checked) => handleSettingChange('newApplicationEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Job View Notifications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about job performance metrics</p>
                    </div>
                    <Switch
                      checked={settings.jobViewEmail}
                      onCheckedChange={(checked) => handleSettingChange('jobViewEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Weekly Summary</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly analytics reports</p>
                    </div>
                    <Switch
                      checked={settings.weeklySummaryEmail}
                      onCheckedChange={(checked) => handleSettingChange('weeklySummaryEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Daily Digest</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get daily updates on job performance</p>
                    </div>
                    <Switch
                      checked={settings.dailyDigestEmail}
                      onCheckedChange={(checked) => handleSettingChange('dailyDigestEmail', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Push Notifications
                </CardTitle>
                <CardDescription>
                  Configure real-time notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Instant Notifications</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive immediate notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.instantNotifications}
                    onCheckedChange={(checked) => handleSettingChange('instantNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Application Process
                </CardTitle>
                <CardDescription>
                  Configure how candidates apply to your jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Default Application Method</Label>
                    <select 
                      value={settings.defaultApplicationMethod} 
                      onChange={(e) => handleSettingChange('defaultApplicationMethod', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <option value="platform">GrowthLab Platform</option>
                      <option value="external">External URL</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-approve Applications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve applications that meet basic criteria</p>
                    </div>
                    <Switch
                      checked={settings.autoApproveApplications}
                      onCheckedChange={(checked) => handleSettingChange('autoApproveApplications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require Cover Letter</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Candidates must submit a cover letter</p>
                    </div>
                    <Switch
                      checked={settings.requireCoverLetter}
                      onCheckedChange={(checked) => handleSettingChange('requireCoverLetter', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require Resume</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Candidates must upload a resume</p>
                    </div>
                    <Switch
                      checked={settings.requireResume}
                      onCheckedChange={(checked) => handleSettingChange('requireResume', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Allow External Applications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow candidates to apply through external links</p>
                    </div>
                    <Switch
                      checked={settings.allowExternalApplications}
                      onCheckedChange={(checked) => handleSettingChange('allowExternalApplications', checked)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Application Deadline (days)</Label>
                    <Input
                      type="number"
                      value={settings.applicationDeadline}
                      onChange={(e) => handleSettingChange('applicationDeadline', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control what information is visible to candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Company Name</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Display your company name in job postings</p>
                    </div>
                    <Switch
                      checked={settings.showCompanyName}
                      onCheckedChange={(checked) => handleSettingChange('showCompanyName', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Contact Information</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Display contact details in job postings</p>
                    </div>
                    <Switch
                      checked={settings.showContactInfo}
                      onCheckedChange={(checked) => handleSettingChange('showContactInfo', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Allow Anonymous Applications</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Let candidates apply without creating an account</p>
                    </div>
                    <Switch
                      checked={settings.allowAnonymousApplications}
                      onCheckedChange={(checked) => handleSettingChange('allowAnonymousApplications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require Login to Apply</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Candidates must be logged in to apply</p>
                    </div>
                    <Switch
                      checked={settings.requireLoginToApply}
                      onCheckedChange={(checked) => handleSettingChange('requireLoginToApply', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Company Branding
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your job postings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Company Logo URL</Label>
                    <Input
                      value={settings.companyLogo}
                      onChange={(e) => handleSettingChange('companyLogo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Brand Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={settings.brandColor}
                        onChange={(e) => handleSettingChange('brandColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.brandColor}
                        onChange={(e) => handleSettingChange('brandColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Custom Email Template</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use custom email templates for notifications</p>
                    </div>
                    <Switch
                      checked={settings.customEmailTemplate}
                      onCheckedChange={(checked) => handleSettingChange('customEmailTemplate', checked)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Email Signature</Label>
                    <Textarea
                      value={settings.emailSignature}
                      onChange={(e) => handleSettingChange('emailSignature', e.target.value)}
                      placeholder="Enter your email signature..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Job Board Integrations
                </CardTitle>
                <CardDescription>
                  Connect with external job boards to expand your reach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">LinkedIn Integration</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically post jobs to LinkedIn</p>
                    </div>
                    <Switch
                      checked={settings.linkedinIntegration}
                      onCheckedChange={(checked) => handleSettingChange('linkedinIntegration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Indeed Integration</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically post jobs to Indeed</p>
                    </div>
                    <Switch
                      checked={settings.indeedIntegration}
                      onCheckedChange={(checked) => handleSettingChange('indeedIntegration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Glassdoor Integration</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically post jobs to Glassdoor</p>
                    </div>
                    <Switch
                      checked={settings.glassdoorIntegration}
                      onCheckedChange={(checked) => handleSettingChange('glassdoorIntegration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Google Jobs Integration</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optimize jobs for Google search results</p>
                    </div>
                    <Switch
                      checked={settings.googleJobsIntegration}
                      onCheckedChange={(checked) => handleSettingChange('googleJobsIntegration', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
                <CardDescription>
                  Configure advanced job posting options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-close Jobs</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically close jobs after a certain period</p>
                    </div>
                    <Switch
                      checked={settings.autoCloseJobs}
                      onCheckedChange={(checked) => handleSettingChange('autoCloseJobs', checked)}
                    />
                  </div>

                  {settings.autoCloseJobs && (
                    <div>
                      <Label className="text-sm font-medium">Auto-close After (days)</Label>
                      <Input
                        type="number"
                        value={settings.autoCloseAfterDays}
                        onChange={(e) => handleSettingChange('autoCloseAfterDays', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Require Approval</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Jobs must be approved before going live</p>
                    </div>
                    <Switch
                      checked={settings.requireApproval}
                      onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enable Analytics</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track job performance and candidate metrics</p>
                    </div>
                    <Switch
                      checked={settings.enableAnalytics}
                      onCheckedChange={(checked) => handleSettingChange('enableAnalytics', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enable AI Tools</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use AI-powered features for job optimization</p>
                    </div>
                    <Switch
                      checked={settings.enableAITools}
                      onCheckedChange={(checked) => handleSettingChange('enableAITools', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

