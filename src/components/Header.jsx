
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { MediumIcon, BehanceIcon, LinkedInIcon } from '@/components/SocialIcons';

const Header = ({ profile }) => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: `${action} feature coming soon!`,
      description: "🚧 This functionality is not yet implemented.",
    });
  };

  const getSocialIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'medium': return <MediumIcon className="w-4 h-4" />;
      case 'linkedin': return <LinkedInIcon className="w-4 h-4" />;
      case 'behance': return <BehanceIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 mb-20 items-center md:items-start pt-12"
    >
      {/* Left Column: Headshot */}
      <div className="flex justify-center md:justify-end">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-[1px] border-[#ffe000] shadow-sm grayscale-0 hover:grayscale transition-all duration-500"
        />
      </div>

      {/* Right Column: Name and Meta Info */}
      <div className="text-center md:text-left space-y-3">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
          {profile.name}
        </h1>
        
        <div className="flex flex-col items-center md:items-start gap-3 w-full">
          {/* First Row: Meta Info */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{profile.title}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>

            <a 
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 hover:text-[var(--accent-color)] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>E-Mail</span>
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#ffe000] opacity-50 max-w-md md:max-w-none" />

          {/* Second Row: Social Links */}
          <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
            <span className="uppercase tracking-wide text-[var(--text-muted)] text-[10px]">Social</span>
            <div className="flex flex-wrap items-center gap-4">
              {profile.socials.map((social) => (
                <a 
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-[var(--accent-color)] transition-colors group"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.platform)}
                  <span className="group-hover:underline decoration-[var(--accent-color)] underline-offset-4 decoration-1">
                    {social.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
