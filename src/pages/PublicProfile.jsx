import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BookSection from '@/components/BookSection';
import LinksSection from '@/components/LinksSection';
import MediumSection from '@/components/MediumSection';
import CreativitySection from '@/components/CreativitySection';
import ReadingSection from '@/components/ReadingSection';
import { getSiteData } from '@/lib/storage';

const PublicProfile = () => {
  const [data, setData] = useState(getSiteData());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setData(getSiteData());
    };

    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  const { profile, sections } = data;

  const renderSection = (section, index) => {
    const commonProps = {
      key: section.id,
      title: section.title,
      subtitle: section.subtitle,
      data: section.data,
      delay: 0.2 + (index * 0.1)
    };

    if (!section.isVisible) return null;

    switch (section.type) {
      case 'book': return <BookSection {...commonProps} />;
      case 'writing': return <MediumSection {...commonProps} />;
      case 'creativity': return <CreativitySection {...commonProps} />;
      case 'reading': return <ReadingSection {...commonProps} />;
      case 'links': return <LinksSection {...commonProps} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-16 md:py-24"
    >
      <Header profile={profile} />
      <div className="mt-16 space-y-12">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
      <div className="flex justify-center mt-20 pb-8">
        <Link 
          to="/login"
          className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 rounded-full hover:bg-[var(--bg-card)]"
        >
          <Shield className="w-3 h-3" />
          <span>Admin Login</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default PublicProfile;