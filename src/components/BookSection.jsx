import React from 'react';
import { ExternalLink } from 'lucide-react';
import SectionLayout from '@/components/SectionLayout';

const BookSection = ({ title, subtitle, data, delay }) => {
  return (
    <SectionLayout title={title} subtitle={subtitle} delay={delay}>
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-full md:w-auto">
            <img
              src={data.image}
              alt={`${data.title} cover`}
              className="w-32 h-auto rounded shadow-lg grayscale-0 group-hover:grayscale transition-all duration-500 mx-auto md:mx-0"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-color)] transition-colors">
              {data.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3 uppercase tracking-wide">First Edition</p>
            <p className="text-[var(--text-muted)] mb-4 italic leading-relaxed text-sm">
              {data.description}
            </p>
            <div className="inline-flex items-center gap-2 text-[var(--text-primary)] font-medium text-xs group-hover:text-[var(--accent-color)] transition-colors border-b border-transparent group-hover:border-[var(--accent-color)] pb-0.5">
              <span>View on Amazon</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </a>
    </SectionLayout>
  );
};

export default BookSection;