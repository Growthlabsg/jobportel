'use client';

import { useState, useEffect } from 'react';
import { useProject, useMyProjects } from '@/hooks/useFreelancer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useParams, useRouter } from 'next/navigation';
import { 
  Trophy, 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowLeft, 
  Home, 
  Upload, 
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle2,
  Clock,
  Eye,
  Star,
  Award,
  ThumbsUp,
  Filter,
  Search
} from 'lucide-react';
import { ContestEntry } from '@/types/freelancer';
import Link from 'next/link';
import { getActiveJobProfile } from '@/services/platform/auth';

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.id as string;
  const { data: contest, isLoading } = useProject(contestId);
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryDescription, setEntryDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<'details' | 'entries'>('details');
  const [selectedEntry, setSelectedEntry] = useState<ContestEntry | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'shortlisted' | 'winner'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if current user is the client
  useEffect(() => {
    const checkClient = async () => {
      try {
        const profile = await getActiveJobProfile();
        if (profile && contest) {
          // In a real app, check contest.clientId against profile.userId
          setIsClient(true); // For now, assume client view
        }
      } catch (error) {
        console.error('Error checking client status:', error);
      }
    };
    if (contest) {
      checkClient();
    }
  }, [contest]);

  // Mock entries - replace with API call
  const mockEntries: ContestEntry[] = contest?.contestEntries || [];
  
  // Filter entries
  const filteredEntries = mockEntries.filter(entry => {
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      entry.submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.submission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'files' | 'images') => {
    const files = Array.from(e.target.files || []);
    if (type === 'files') {
      setUploadedFiles([...uploadedFiles, ...files]);
    } else {
      setUploadedImages([...uploadedImages, ...files]);
    }
  };

  const removeFile = (index: number, type: 'files' | 'images') => {
    if (type === 'files') {
      setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    } else {
      setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmitEntry = async () => {
    if (!entryTitle || !entryDescription) {
      alert('Please fill in title and description');
      return;
    }

    if (uploadedFiles.length === 0 && uploadedImages.length === 0) {
      alert('Please upload at least one file or image');
      return;
    }

    // TODO: Submit entry via API
    alert('Entry submitted successfully!');
    setShowSubmitModal(false);
    setEntryTitle('');
    setEntryDescription('');
    setUploadedFiles([]);
    setUploadedImages([]);
  };

  const isContestOpen = contest?.contestStatus === 'open' || contest?.status === 'open';
  const isContestEnded = contest?.contestEndDate && new Date(contest.contestEndDate) < new Date();
  const canSubmit = isContestOpen && !isContestEnded;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (!contest || contest.type !== 'contest') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contest Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This contest doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/jobs/freelancer/contests')}>
              Back to Contests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/jobs/freelancer')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{contest.title}</h1>
            <Badge variant="primary" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Contest
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('details')}
              className={`px-4 py-2 font-medium transition-colors ${
                viewMode === 'details'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setViewMode('entries')}
              className={`px-4 py-2 font-medium transition-colors ${
                viewMode === 'entries'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Entries ({mockEntries.length})
            </button>
          </div>
        </div>

        {viewMode === 'details' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contest Description */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Contest Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {contest.description}
                  </p>
                </CardContent>
              </Card>

              {/* Skills Required */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contest.skills?.map((skill) => (
                      <Badge key={skill} variant="primary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Submission Guidelines */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Submission Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Submit your best work that matches the contest requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Include high-quality images or files showcasing your work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Provide a clear description of your submission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>Only original work will be considered</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-2 border-gray-200 dark:border-gray-700 sticky top-4">
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6">
                    {contest.contestPrize && (
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                        <DollarSign className="w-8 h-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          ${contest.contestPrize.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Prize Pool</div>
                      </div>
                    )}
                    
                    {contest.contestWinners && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {contest.contestWinners} Winner{contest.contestWinners > 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Will be selected</div>
                        </div>
                      </div>
                    )}

                    {contest.contestEndDate && (
                      <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {isContestEnded ? 'Ended' : 'Ends'}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(contest.contestEndDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {mockEntries.length} Entries
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Submitted so far</div>
                      </div>
                    </div>
                  </div>

                  {canSubmit ? (
                    <Button
                      className="w-full"
                      onClick={() => setShowSubmitModal(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Entry
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Clock className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isContestEnded ? 'This contest has ended' : 'Submissions are closed'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Entries View */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Contest Entries ({filteredEntries.length})
              </h2>
              <div className="flex gap-2">
                {canSubmit && !isClient && (
                  <Button onClick={() => setShowSubmitModal(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Your Entry
                  </Button>
                )}
                {isClient && (
                  <Button variant="outline" onClick={() => {
                    // TODO: Award winners
                    alert('Award winners functionality - to be implemented');
                  }}>
                    <Award className="w-4 h-4 mr-2" />
                    Award Winners
                  </Button>
                )}
              </div>
            </div>

            {/* Client Controls */}
            {isClient && (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterStatus === 'all' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('all')}
                        className="whitespace-nowrap"
                      >
                        All
                      </Button>
                      <Button
                        variant={filterStatus === 'submitted' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('submitted')}
                        className="whitespace-nowrap"
                      >
                        Submitted
                      </Button>
                      <Button
                        variant={filterStatus === 'shortlisted' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('shortlisted')}
                        className="whitespace-nowrap"
                      >
                        Shortlisted
                      </Button>
                      <Button
                        variant={filterStatus === 'winner' ? 'primary' : 'outline'}
                        onClick={() => setFilterStatus('winner')}
                        className="whitespace-nowrap"
                      >
                        Winners
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredEntries.length === 0 ? (
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <Trophy className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No entries yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Be the first to submit your work!
                  </p>
                  {canSubmit && (
                    <Button onClick={() => setShowSubmitModal(true)}>
                      Submit Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="border-2 border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {entry.submission.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {entry.submission.description}
                          </p>
                        </div>
                        {entry.status === 'winner' && (
                          <Trophy className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {entry.freelancer.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {entry.freelancer.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {entry.submission.images && entry.submission.images.length > 0 && (
                        <div className="mb-3">
                          <div className="grid grid-cols-2 gap-2">
                            {entry.submission.images.slice(0, 4).map((img, idx) => (
                              <div
                                key={idx}
                                className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                              >
                                <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {entry.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {entry.rating}/5
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Badge
                          variant={
                            entry.status === 'winner'
                              ? 'success'
                              : entry.status === 'shortlisted'
                              ? 'warning'
                              : 'outline'
                          }
                        >
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {isClient && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Shortlist entry
                                  alert('Shortlist functionality - to be implemented');
                                }}
                                disabled={entry.status === 'shortlisted' || entry.status === 'winner'}
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Select as winner
                                  alert('Select winner functionality - to be implemented');
                                }}
                                disabled={entry.status === 'winner'}
                              >
                                <Award className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEntry(entry);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Entry Modal */}
        <Modal
          isOpen={showSubmitModal}
          title="Submit Contest Entry"
          onClose={() => setShowSubmitModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Entry Title *
              </label>
              <Input
                placeholder="e.g., Modern Logo Design"
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe your submission, your approach, and why it's the best fit..."
                rows={6}
                value={entryDescription}
                onChange={(e) => setEntryDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Images (JPG, PNG, GIF)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload images of your work
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'images')}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outline" type="button" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                </label>
              </div>
              {uploadedImages.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedImages.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        onClick={() => removeFile(idx, 'images')}
                        className="text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Files (PDF, ZIP, etc.)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Upload supporting files
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'files')}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" type="button" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </label>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        onClick={() => removeFile(idx, 'files')}
                        className="text-red-600 dark:text-red-400 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEntry}
                disabled={!entryTitle || !entryDescription || (uploadedFiles.length === 0 && uploadedImages.length === 0)}
                className="flex-1"
              >
                Submit Entry
              </Button>
            </div>
          </div>
        </Modal>

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <Modal
            isOpen={!!selectedEntry}
            title={selectedEntry.submission.title}
            onClose={() => setSelectedEntry(null)}
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                    {selectedEntry.freelancer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedEntry.freelancer.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEntry.freelancer.title}
                    </p>
                  </div>
                  <Link href={`/jobs/freelancer/freelancers/${selectedEntry.freelancer.id}`}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {selectedEntry.submission.description}
                </p>
              </div>

              {selectedEntry.submission.images && selectedEntry.submission.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEntry.submission.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEntry.submission.files && selectedEntry.submission.files.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Files</h3>
                  <div className="space-y-2">
                    {selectedEntry.submission.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <FileText className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file}</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Rating Section */}
              {isClient && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Rate This Entry</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          // TODO: Submit rating via API
                          alert(`Rate ${rating} stars - to be implemented`);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            selectedEntry.rating && rating <= selectedEntry.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    {selectedEntry.rating && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        ({selectedEntry.rating}/5)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Shortlist entry
                        alert('Shortlist entry - to be implemented');
                      }}
                      disabled={selectedEntry.status === 'shortlisted' || selectedEntry.status === 'winner'}
                      className="flex-1"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {selectedEntry.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                    </Button>
                    <Button
                      onClick={() => {
                        // TODO: Select as winner
                        alert('Select as winner - to be implemented');
                      }}
                      disabled={selectedEntry.status === 'winner'}
                      className="flex-1"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      {selectedEntry.status === 'winner' ? 'Winner' : 'Select Winner'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Badge
                  variant={
                    selectedEntry.status === 'winner'
                      ? 'success'
                      : selectedEntry.status === 'shortlisted'
                      ? 'warning'
                      : 'outline'
                  }
                >
                  {selectedEntry.status.charAt(0).toUpperCase() + selectedEntry.status.slice(1)}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted {new Date(selectedEntry.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

