'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Language, Award, Publication } from '@/types/resume';

interface AdditionalStepProps {
  languages: Language[];
  awards: Award[];
  publications: Publication[];
  onChange: (updates: { languages?: Language[]; awards?: Award[]; publications?: Publication[] }) => void;
}

export const AdditionalStep = ({ languages, awards, publications, onChange }: AdditionalStepProps) => {
  // Languages
  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'fluent',
    };
    onChange({ languages: [...languages, newLang] });
  };

  const removeLanguage = (id: string) => {
    onChange({ languages: languages.filter((lang) => lang.id !== id) });
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    onChange({
      languages: languages.map((lang) => (lang.id === id ? { ...lang, ...updates } : lang)),
    });
  };

  // Awards
  const addAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: '',
      issuer: '',
      date: '',
      description: '',
    };
    onChange({ awards: [...awards, newAward] });
  };

  const removeAward = (id: string) => {
    onChange({ awards: awards.filter((award) => award.id !== id) });
  };

  const updateAward = (id: string, updates: Partial<Award>) => {
    onChange({
      awards: awards.map((award) => (award.id === id ? { ...award, ...updates } : award)),
    });
  };

  // Publications
  const addPublication = () => {
    const newPub: Publication = {
      id: Date.now().toString(),
      title: '',
      publisher: '',
      date: '',
      url: '',
    };
    onChange({ publications: [...publications, newPub] });
  };

  const removePublication = (id: string) => {
    onChange({ publications: publications.filter((pub) => pub.id !== id) });
  };

  const updatePublication = (id: string, updates: Partial<Publication>) => {
    onChange({
      publications: publications.map((pub) => (pub.id === id ? { ...pub, ...updates } : pub)),
    });
  };

  return (
    <div className="space-y-8">
      {/* Languages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Languages</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">List languages you speak</p>
          </div>
          <Button onClick={addLanguage} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Language
          </Button>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2">
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                placeholder="English"
                className="flex-1"
              />
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value as any })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="basic">Basic</option>
                <option value="conversational">Conversational</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
                className="text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Awards & Honors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recognitions and achievements</p>
          </div>
          <Button onClick={addAward} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Award
          </Button>
        </div>
        <div className="space-y-4">
          {awards.map((award, index) => (
            <div key={award.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Award #{index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAward(award.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  value={award.title}
                  onChange={(e) => updateAward(award.id, { title: e.target.value })}
                  placeholder="Award Title"
                />
                <Input
                  value={award.issuer}
                  onChange={(e) => updateAward(award.id, { issuer: e.target.value })}
                  placeholder="Issuing Organization"
                />
                <Input
                  type="month"
                  value={award.date}
                  onChange={(e) => updateAward(award.id, { date: e.target.value })}
                  placeholder="Date"
                />
                <Input
                  value={award.description || ''}
                  onChange={(e) => updateAward(award.id, { description: e.target.value })}
                  placeholder="Description (optional)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Publications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Research papers, articles, blog posts</p>
          </div>
          <Button onClick={addPublication} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Publication
          </Button>
        </div>
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={pub.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publication #{index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePublication(pub.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  value={pub.title}
                  onChange={(e) => updatePublication(pub.id, { title: e.target.value })}
                  placeholder="Publication Title"
                />
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    value={pub.publisher}
                    onChange={(e) => updatePublication(pub.id, { publisher: e.target.value })}
                    placeholder="Publisher"
                  />
                  <Input
                    type="month"
                    value={pub.date}
                    onChange={(e) => updatePublication(pub.id, { date: e.target.value })}
                    placeholder="Date"
                  />
                </div>
                <Input
                  type="url"
                  value={pub.url || ''}
                  onChange={(e) => updatePublication(pub.id, { url: e.target.value })}
                  placeholder="URL (optional)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

