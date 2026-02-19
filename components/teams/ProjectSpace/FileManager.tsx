'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectSpace, ProjectFile } from '@/types/platform';
import { TeamCard as TeamCardType } from '@/types/platform';
import { Plus, FileText, Download, Trash2, Upload, File } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface FileManagerProps {
  projectSpace: ProjectSpace;
  team: TeamCardType;
}

export function FileManager({ projectSpace, team }: FileManagerProps) {
  const [files, setFiles] = useState<ProjectFile[]>(projectSpace.files || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📎';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    Array.from(selectedFiles).forEach((file) => {
      const newFile: ProjectFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        projectSpaceId: projectSpace.id,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedBy: 'current-user',
        uploadedByName: 'You',
        createdAt: new Date().toISOString(),
      };
      setFiles([...files, newFile]);
    });
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter((f) => f.id !== fileId));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Files</h3>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No files uploaded yet.</p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First File
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{getFileIcon(file.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.uploadedByName}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      {formatRelativeTime(file.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

