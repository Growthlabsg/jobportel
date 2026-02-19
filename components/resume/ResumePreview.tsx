'use client';

import { ResumeData } from '@/types/resume';
import { formatDate } from '@/lib/utils';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const { personalInfo, workExperience, education, skills, projects, certifications, languages, awards, publications } = data;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm max-h-[800px] overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-6 border-b-2 border-primary">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
            {personalInfo.website && (
              <a href={personalInfo.website} className="text-primary hover:underline">
                Website
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} className="text-primary hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github} className="text-primary hover:underline">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Work Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      {exp.startDate && (
                        <span>
                          {new Date(exp.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' - '}
                          {exp.current
                            ? 'Present'
                            : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.location && <p className="text-xs text-gray-500 mb-2">{exp.location}</p>}
                  {exp.description && (
                    <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                      {edu.startDate && (
                        <span>
                          {new Date(edu.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                          {' - '}
                          {edu.current
                            ? 'Present'
                            : edu.endDate
                            ? new Date(edu.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  {edu.location && <p className="text-xs text-gray-500 dark:text-gray-400">{edu.location}</p>}
                  {edu.gpa && <p className="text-xs text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>}
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="space-y-3">
              {['technical', 'soft', 'language'].map((category) => {
                const categorySkills = skills.filter((s) => s.category === category);
                if (categorySkills.length === 0) return null;
                return (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                      {category === 'language' ? 'Languages' : `${category} Skills`}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {skill.name}
                          {skill.level && ` (${skill.level})`}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4 text-xs">
                    {project.url && (
                      <a href={project.url} className="text-primary hover:underline">
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="text-primary hover:underline">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {cert.issuer}
                    {cert.date && ` • ${new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    {cert.credentialId && ` • ID: ${cert.credentialId}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {(languages.length > 0 || awards.length > 0 || publications.length > 0) && (
          <div className="mb-6">
            {languages.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {lang.name} ({lang.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {awards.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Awards & Honors</h2>
                <div className="space-y-2">
                  {awards.map((award) => (
                    <div key={award.id}>
                      <h3 className="font-semibold text-gray-900 text-sm">{award.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {award.issuer}
                        {award.date && ` • ${new Date(award.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {publications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Publications</h2>
                <div className="space-y-2">
                  {publications.map((pub) => (
                    <div key={pub.id}>
                      <h3 className="font-semibold text-gray-900 text-sm">{pub.title}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {pub.publisher}
                        {pub.date && ` • ${new Date(pub.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      </p>
                      {pub.url && (
                        <a href={pub.url} className="text-xs text-primary hover:underline">
                          View Publication
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

