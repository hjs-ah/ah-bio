
import React from 'react';
import { ExternalLink } from 'lucide-react';
import SectionLayout from '@/components/SectionLayout';
import { useToast } from '@/components/ui/use-toast';
import { MediumIcon, BehanceIcon, LinkedInIcon } from '@/components/SocialIcons';

const LinksSection = ({ title, subtitle, data, delay }) => {
  const { toast } = useToast();
  const links = data.links || [];

  const getIcon = (name) => {
    switch(name) {
      case 'LinkedIn': return LinkedInIcon;
      case 'Behance': return BehanceIcon;
      case 'Medium': return MediumIcon;
      default: return ExternalLink;
    }
  };

  return (
    <SectionLayout title={title} subtitle={subtitle} delay={delay}>
      <div className="grid gap-3">
        {links.map((link, index) => {
          const Icon = getIcon(link.icon);
          return (
            <a
              key={index}
              href={link.url}
              onClick={(e) => {
                if (link.url === '#') {
                  e.preventDefault();
                  toast({ title: `${link.title} link coming soon!` });
                }
              }}
              className="block group"
            >
              <div className="bg-[var(--bg-card)] rounded-lg p-4 hover:bg-[var(--hover-bg)] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-page)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-[var(--text-primary)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">{link.subtitle}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </SectionLayout>
  );
};

export default LinksSection;
