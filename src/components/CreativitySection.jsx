
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import SectionLayout from '@/components/SectionLayout';

const CreativitySection = ({ title, subtitle, data, delay }) => {
  const [selectedId, setSelectedId] = useState(null);
  const items = data.items || [];

  return (
    <SectionLayout 
      title={title} 
      subtitle={<span className="italic">{subtitle}</span>}
      delay={delay}
    >
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`card-container-${item.id}`}
            onClick={() => setSelectedId(item.id)}
            className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]"
          >
            <motion.img
              layoutId={`card-image-${item.id}`}
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              {items.map((item) => {
                if (item.id === selectedId) {
                  return (
                    <motion.div
                      layoutId={`card-container-${item.id}`}
                      key={item.id}
                      className="relative bg-[var(--bg-page)] rounded-lg overflow-hidden shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.img
                        layoutId={`card-image-${item.id}`}
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                      <div className="p-4 bg-[var(--bg-page)] border-t border-[var(--border)] flex justify-between items-center">
                        <h3 className="font-bold text-[var(--text-primary)]">{item.title}</h3>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="p-2 rounded-full hover:bg-[var(--hover-bg)] transition-colors"
                        >
                          <X className="w-5 h-5 text-[var(--text-primary)]" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionLayout>
  );
};

export default CreativitySection;
