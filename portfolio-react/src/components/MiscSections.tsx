import { ExternalLink, GraduationCap, Award, Wrench } from 'lucide-react';
import { useI18n } from '../i18n';
import { SectionTitle } from './shared/SectionTitle';

const EduCard = ({ year, org, degree, note, link, testimonial }: { year: string, org: string, degree: string, note?: string, link?: string, testimonial?: { text: string, name: string, role: string } }) => (
  <div className="flex gap-4 group mb-6">
    <div className="text-xs font-mono text-text-muted pt-1 w-20 shrink-0">{year}</div>
    <div className="flex-1 pb-6 border-b border-border-subtle group-last:border-0 group-last:pb-0">
      <h4 className="text-base font-medium text-accent mb-1 flex items-center gap-2">
        {degree}
        {note && <span className="px-2 py-0.5 text-[10px] bg-yellow-900/30 text-yellow-400 rounded-full">{note}</span>}
      </h4>
      <p className="text-sm text-text-secondary mb-2">{org}</p>
      {link && (
        <a href={`https://${link}`} target="_blank" rel="noreferrer" className="text-xs text-link hover:text-link-hover flex items-center gap-1 mb-2">
          {link} <ExternalLink size={10} />
        </a>
      )}
      {testimonial && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
          <p className="text-sm text-text-secondary italic mb-2">"{testimonial.text}"</p>
          <p className="text-xs text-text-muted">— {testimonial.name}, {testimonial.role}</p>
        </div>
      )}
    </div>
  </div>
);

export const EducationSection = () => {
  const { t } = useI18n();
  return (
  <section className="py-24">
    <SectionTitle 
      icon={<GraduationCap size={20} className="text-blue-500" />}
      title={t('edu.title')} 
    />
    <div className="space-y-2">
      <EduCard year="2019-2022" org="常州信息职业技术学院" degree={t('edu.1.degree')} note={t('edu.1.note')} />
    </div>
  </section>
)};

const PATENTS = [
  { name: "电芯数据报表的生成方法、设备和存储介质", issuer: "CN119166678A · 第一发明人", year: "实审中", url: "#" },
  { name: "一种储能设备测试报告生成方法及电子设备", issuer: "CN120045414A · 第三发明人", year: "实审中", url: "#" }
];

export const CertificationsSection = () => {
  const { t } = useI18n();
  return (
  <section className="py-24">
    <SectionTitle 
      icon={<Award size={20} className="text-blue-500" />}
      title={t('cert.title')} 
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {PATENTS.map(patent => (
        <div key={patent.name} className="flex justify-between items-center bg-bg-card border border-border rounded-xl px-5 py-4 hover:bg-bg-card-hover hover:border-white/20 transition-all group">
          <div>
            <div className="text-sm font-medium text-accent group-hover:text-white transition-colors">{patent.name}</div>
            <div className="text-xs text-text-muted mt-1">{patent.issuer}</div>
          </div>
          <span className="text-xs text-text-muted font-mono">{patent.year}</span>
        </div>
      ))}
    </div>
  </section>
)};

const StackGroup = ({ label, items }: { label: string, items: string[] }) => (
  <div className="mb-6">
    <h4 className="text-sm font-medium text-text-secondary mb-3">{label}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <span key={item} className="px-2.5 py-1 text-xs rounded-md bg-tag-bg text-tag-text font-mono border border-border/50">
          {item}
        </span>
      ))}
    </div>
  </div>
);

export const SkillsSection = () => {
  const { t } = useI18n();
  return (
  <section className="py-24">
    <SectionTitle 
      icon={<Wrench size={20} className="text-blue-500" />}
      title={t('skills.title')} 
    />
    
    <div className="mb-12">
      <h3 className="text-lg font-semibold text-accent mb-6">{t('skills.lang')}</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-text-primary">{t('skills.lang.es')}</span><span className="text-text-muted">{t('skills.lang.es.level')}</span></div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-full rounded-full"></div></div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1"><span className="text-text-primary">{t('skills.lang.en')}</span><span className="text-text-muted">{t('skills.lang.en.level')}</span></div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-accent w-[50%] rounded-full"></div></div>
        </div>
      </div>
    </div>

    <div className="mb-12">
      <h3 className="text-lg font-semibold text-accent mb-6">{t('skills.soft')}</h3>
      <div className="flex flex-wrap gap-2">
        {[
          t('skills.soft.1'), t('skills.soft.2'), t('skills.soft.3'), 
          t('skills.soft.4'), t('skills.soft.5'), t('skills.soft.6'), t('skills.soft.7')
        ].map(tag => (
          <span key={tag} className="px-3 py-1.5 text-sm rounded-full bg-white/5 text-text-primary border border-white/10">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-semibold text-accent mb-6">{t('skills.tech')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <StackGroup label="ETL & Data Integration" items={["Kettle", "DolphinScheduler", "Data Cleaning", "Scheduling", "Data Quality"]} />
          <StackGroup label="Programming" items={["Python (Pandas / NumPy)", "VBA", "Shell"]} />
          <StackGroup label="Database" items={["MySQL"]} />
        </div>
        <div>
          <StackGroup label="AI Application" items={["Ollama", "Dify", "RAG", "Chatflow", "Workflow", "FastAPI", "LangGraph", "ChromaDB"]} />
          <StackGroup label="DevOps & Deploy" items={["Linux (CentOS)", "Docker", "Docker Compose"]} />
          <StackGroup label="AI Coding Workflow" items={["Claude Code", "Codex", "GitHub Copilot"]} />
        </div>
      </div>
    </div>
  </section>
)};
