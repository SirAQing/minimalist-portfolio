import { MessageSquare, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n';

const TwitterIcon = ({ size = 16, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size = 16, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const SectionTitle = ({ title }: { title: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-accent tracking-tight mb-3">{title}</h2>
  </div>
);

const RedditIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.508 1.183-.849 2.822-1.408 4.611-1.488l.89-4.179c.045-.205.234-.35.445-.333l3.056.644a1.249 1.249 0 0 1 1.019-1.042zM8.344 12.873c-.804 0-1.455.65-1.455 1.455 0 .804.651 1.455 1.455 1.455.805 0 1.456-.651 1.456-1.455 0-.805-.651-1.455-1.456-1.455zm7.312 0c-.805 0-1.456.65-1.456 1.455 0 .804.651 1.455 1.456 1.455.805 0 1.456-.651 1.456-1.455 0-.805-.651-1.455-1.456-1.455zm-3.656 4.316c-1.393 0-2.607-.463-2.825-1.127l-.046-.145h-1.041l.041.168c.328 1.346 2.052 2.195 3.871 2.195 1.822 0 3.546-.851 3.872-2.199l.041-.164h-1.041l-.045.14c-.218.667-1.433 1.132-2.827 1.132z"/>
  </svg>
);

interface SocialPostProps {
  type: 'twitter' | 'linkedin' | 'reddit';
  author?: string;
  sub?: string;
  quote?: string;
  metrics: string;
}

const SocialPost = ({ type, author, sub, quote, metrics }: SocialPostProps) => {
  const icons = {
    twitter: <TwitterIcon size={16} className="text-blue-400" />,
    linkedin: <LinkedinIcon size={16} className="text-blue-600" />,
    reddit: <RedditIcon size={16} />
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 hover:bg-bg-card-hover transition-colors group">
      <div className="flex items-center gap-2 mb-3">
        {icons[type]}
        <span className="text-sm font-medium text-accent">
          {author || sub || (type === 'twitter' ? 'X (Twitter)' : 'LinkedIn')}
        </span>
      </div>
      
      {quote && (
        <blockquote className="border-l-2 border-border pl-3 text-sm text-text-secondary italic mb-3">
          "{quote}"
        </blockquote>
      )}
      
      {!quote && (
        <p className="text-sm text-text-secondary mb-3">
          Post summary or preview text goes here... <span className="text-link hover:text-link-hover cursor-pointer">ver más</span>
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-text-muted mt-4">
        <span className="flex items-center gap-1.5 bg-bg-pill px-2 py-1 rounded-md">
          <MessageSquare size={12} /> {metrics}
        </span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-text-primary">
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};

const TalkEntry = ({ year, org, title, link }: { year: string, org: string, title: string, link?: string }) => (
  <div className="flex gap-4 group">
    <div className="text-xs font-mono text-text-muted pt-1 w-12 shrink-0">{year}</div>
    <div className="flex-1 pb-6 border-b border-border-subtle group-last:border-0 group-last:pb-0">
      <h4 className="text-base font-medium text-accent mb-1">{title}</h4>
      <p className="text-sm text-text-secondary mb-2">{org}</p>
      {link && (
        <a href={`https://${link}`} target="_blank" rel="noreferrer" className="text-xs text-link hover:text-link-hover flex items-center gap-1">
          {link.includes('PDF') ? 'Slides PDF' : 'Ver más'} <ExternalLink size={10} />
        </a>
      )}
    </div>
  </div>
);

export const SharingSection = () => {
  const { t } = useI18n();
  return (
    <section id="sharing" className="py-24">
      <SectionTitle title={t('share.title')} />

      <div className="flex items-center gap-4 mb-8">
        <img src="../assets/avatar-placeholder.svg" alt="santifer" className="w-12 h-12 rounded-full ring-2 ring-white/5" />
        <div>
          <div className="font-semibold text-accent">santifer | AI Builder</div>
          <div className="text-text-muted text-sm font-mono">@santifer</div>
        </div>
      </div>
      <p className="text-text-secondary mb-10 max-w-xl text-lg">
        {t('share.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <div className="space-y-4">
          <SocialPost type="twitter" quote="This is how you build AI products." author="Garry Tan, CEO YC" metrics="111 / 33 / 6.7K / 1.7M" />
          <SocialPost type="twitter" metrics="106 / 50 / 3.9K / 549.1K" />
          <SocialPost type="reddit" sub="r/SideProject" metrics="573 upvotes / 359 comments" />
        </div>
        <div className="space-y-4">
          <SocialPost type="reddit" sub="r/ClaudeAI" metrics="282 upvotes / 252 comments" />
          <SocialPost type="linkedin" metrics="300+ likes / 50+ comments" />
          <SocialPost type="linkedin" metrics="115+ likes / 10+ comments" />
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-8 mb-16">
        <h3 className="text-xl font-bold text-accent mb-2">{t('share.educator')}</h3>
        <p className="text-sm text-text-secondary mb-6">{t('share.educator.desc')}</p>
        
        <div className="flex flex-wrap gap-2">
          {["Teaching AI Fluency", "AI Fluency: Framework & Foundations", "AI Fluency for Educators", "AI Fluency for Students"].map(cert => (
            <span key={cert} className="px-3 py-1.5 text-xs rounded-md bg-white/5 text-text-primary border border-white/10">
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-accent mb-8">{t('share.talks')}</h3>
        <div className="space-y-0">
          <TalkEntry year="2026" org="Marily Nika AI PM Bootcamp" title={t('share.talk.1')} />
          <TalkEntry year="2026" org="AI Product Academy" title={t('share.talk.2')} link="santifer.io/n8n-para-pms" />
          <TalkEntry year="2025" org="Marily Nika AI PM Bootcamp" title={t('share.talk.3')} link="slides PDF" />
          <TalkEntry year="2025" org="Empresarios locales · Sevilla" title={t('share.talk.4')} link="slides PDF" />
        </div>
      </div>

    </section>
  );
};
