import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { SectionTitle } from './shared/SectionTitle';

// const GithubIcon = ({ size = 16 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
//   </svg>
// );

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-white/5 text-text-secondary";
  if (status === "Open Source" || status === "开源" || status === "Personal Project" || status === "个人项目") colorClass = "bg-badge-green text-badge-green-t";
  if (status === "En producción" || status === "In Production" || status === "生产环境") colorClass = "bg-badge-blue text-badge-blue-t";
  if (status === "Este Portfolio" || status === "This Portfolio" || status === "本作品集") colorClass = "bg-purple-900/30 text-purple-400";
  if (status === "Enterprise" || status === "企业项目") colorClass = "bg-orange-900/30 text-orange-400";

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-medium ${colorClass} mb-3 inline-block`}>
      {status}
    </span>
  );
};

interface ProjectCardProps {
  title: string;
  status: string;
  description: string;
  tags: string[];
  stars?: string;
  forks?: string;
  link?: string;
}

const ProjectCard = ({ title, status, description, tags, stars, forks, link }: ProjectCardProps) => {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-6 hover:bg-bg-card-hover transition-colors flex flex-col h-full group">
      <StatusBadge status={status} />
      <h3 className="text-lg font-semibold text-accent mb-2 flex items-center gap-2">
        {title}
        {link && <ExternalLink size={14} className="text-text-muted group-hover:text-text-primary transition-colors" />}
      </h3>
      <p className="text-sm text-text-secondary mb-4 flex-grow">{description}</p>
      
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-xs rounded-md bg-tag-bg text-tag-text font-mono">
            {tag}
          </span>
        ))}
      </div>

      {(stars || forks || link) && (
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted mt-auto">
          <div className="flex items-center gap-4">
            {stars && <span className="flex items-center gap-1"><Star size={12} className="text-star-color" /> {stars}</span>}
            {forks && <span className="flex items-center gap-1"><GitFork size={12} /> {forks}</span>}
          </div>
          {link && <a href={`https://${link}`} target="_blank" rel="noreferrer" className="hover:text-text-primary transition-colors">{link}</a>}
        </div>
      )}
    </div>
  );
};

// const AgentInfraCard = () => {
//   const { t } = useI18n();
//   return (
//   <div className="bg-bg-card border border-border rounded-xl p-6 mb-6">
//     <div className="flex justify-between items-start mb-4">
//       <h3 className="text-lg font-semibold text-accent">{t('proj.infra.title')}</h3>
//       <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full font-medium bg-white/5 text-text-muted border border-border">{t('proj.infra.private')}</span>
//     </div>
//     <p className="text-sm text-text-secondary italic mb-6">{t('proj.infra.quote')}</p>
//     
//     <div className="flex flex-col items-center">
//       <div className="px-4 py-2 bg-tag-bg border border-border rounded-md text-sm font-mono text-accent mb-4">
//         {t('proj.infra.orchestrator')}
//       </div>
//       <div className="flex flex-wrap justify-center gap-2 w-full max-w-lg mx-auto">
//         {['brand', 'venture', 'career', 'community', 'portfolio'].map(op => (
//           <div key={op} className="flex-1 min-w-[80px] text-center p-2 border border-border-subtle rounded bg-[#0a0a0a]">
//             <div className="text-xs text-text-secondary font-mono">{op} ops</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )};

export const ProjectsSection = () => {
  const { t } = useI18n();
  const PROJECTS: ProjectCardProps[] = [
    {
      title: "ETL Data Integration & Scheduling Platform",
      status: t('proj.status.production'),
      description: "Fully automated ETL pipeline for lithium battery testing data — from raw CSV to structured MySQL storage. 4-layer architecture with DolphinScheduler scheduling, Kettle transformation, and Docker Compose deployment.",
      tags: ["Kettle", "DolphinScheduler", "MySQL", "Docker Compose", "Python", "Shell"],
    },
    {
      title: "Battery Cycle Test Report Automation",
      status: t('proj.status.production'),
      description: "End-to-end automated report generation for 5000+ test channels. Reduced batch report time from 4-6 hours to 8 minutes (35x speedup). Patented core algorithm.",
      tags: ["VBA", "Excel", "ADO", "MySQL"],
    },
    {
      title: "Private LLM & Dify AI Platform",
      status: t('proj.status.production'),
      description: "Enterprise-grade local LLM deployment with Dify application platform. Includes RAG knowledge base, Chatflow, and Workflow for lithium testing standards query, customer needs analysis, and internal knowledge retrieval.",
      tags: ["Ollama", "Dify", "RAG", "Docker", "Linux", "Chatflow"],
    },
    {
      title: "NL2SQL Agent Platform",
      status: t('proj.status.opensource'),
      description: "AI-driven natural language to SQL query platform with LangGraph state machine workflow, RAG schema retrieval, and multi-layer security. Built with VibeCoding approach using Claude Code & Codex.",
      tags: ["FastAPI", "LangGraph", "ChromaDB", "Gradio", "Docker"],
    }
  ];

  return (
    <section id="projects" className="py-24">
      <SectionTitle 
        icon={<Code2 size={20} className="text-blue-500" />}
        title={t('proj.title')} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {PROJECTS.map(p => <ProjectCard key={p.title} {...p} />)}
      </div>
    </section>
  );
};
