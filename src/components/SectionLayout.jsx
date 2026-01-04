
import React from 'react';
import { motion } from 'framer-motion';

const SectionLayout = ({ title, subtitle, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 mb-16 items-start"
    >
      <div className="md:text-right md:sticky md:top-8 pt-1">
        <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest opacity-50">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-tight font-medium">
            {subtitle}
          </p>
        )}
      </div>
      <div className="min-w-0 space-y-6">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionLayout;
