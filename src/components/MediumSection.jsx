import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import SectionLayout from '@/components/SectionLayout';

const MediumSection = ({ title, subtitle, data, delay }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${data.rssUrl}`
        );
        const resData = await response.json();
        
        if (resData.status === 'ok') {
          setArticles(resData.items.slice(0, 3));
        } else {
           setArticles([
            {
              title: "Finding Purpose in the Journey of Faith",
              description: "Exploring what it means to walk in faith as a new man in Christ...",
              pubDate: "2025-12-15",
              link: "#"
            },
            {
              title: "The Power of Transformation",
              description: "Understanding the transformative power of faith...",
              pubDate: "2025-11-28",
              link: "#"
            }
           ]);
        }
      } catch (err) {
        console.error("Failed to fetch articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [data.rssUrl]);

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <SectionLayout title={title} subtitle={subtitle} delay={delay}>
      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <article className="relative pl-5 border-l-2 border-[var(--border)] hover:border-[var(--accent-color)] transition-colors duration-300">
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-color)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-2 line-clamp-2 leading-relaxed">
                  {stripHtml(article.description)}
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.pubDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      )}
    </SectionLayout>
  );
};

export default MediumSection;