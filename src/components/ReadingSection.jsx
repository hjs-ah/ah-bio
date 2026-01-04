
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionLayout from '@/components/SectionLayout';

const ReadingSection = ({ title, subtitle, data, delay }) => {
  const books = data.items || [];

  return (
    <SectionLayout title={title} subtitle={subtitle} delay={delay}>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <a
            key={book.id}
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative aspect-[2/3] rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={book.image}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
                <p className="text-white text-xs font-bold mb-1">{book.title}</p>
                <p className="text-white/80 text-[10px]">{book.author}</p>
                <ExternalLink className="text-white w-4 h-4 mt-2" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </SectionLayout>
  );
};

export default ReadingSection;
