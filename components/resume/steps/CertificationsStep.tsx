'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Certification } from '@/types/resume';

interface CertificationsStepProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export const CertificationsStep = ({ data, onChange }: CertificationsStepProps) => {
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      description: '',
    };
    onChange([...data, newCert]);
  };

  const removeCertification = (id: string) => {
    onChange(data.filter((cert) => cert.id !== id));
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onChange(data.map((cert) => (cert.id === id ? { ...cert, ...updates } : cert)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">Add your professional certifications</p>
        <Button onClick={addCertification} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Certification
        </Button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No certifications added yet</p>
          <Button onClick={addCertification} variant="outline">
            Add Your First Certification
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data.map((cert, index) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Certification #{index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification Name *
                  </label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issuing Organization *
                  </label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="month"
                    value={cert.expiryDate || ''}
                    onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credential ID
                  </label>
                  <Input
                    value={cert.credentialId || ''}
                    onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                    placeholder="ABC123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={cert.description || ''}
                  onChange={(e) => updateCertification(cert.id, { description: e.target.value })}
                  placeholder="Additional details about the certification..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

