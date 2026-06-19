import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'zh';

interface I18nContextType {
  lang: Language;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Hero
    'hero.greeting': 'Hi, I\'m',
    'hero.title.1': 'AI × Data Engineer',
    'hero.title.2.1': 'with ETL architecture & scheduling platforms',
    'hero.title.2.2': 'with private LLM deployment & RAG systems',
    'hero.title.2.3': 'with AI-native development workflow',
    'hero.badge.builder': 'Data Engineer',
    'hero.badge.operator': 'AI Practitioner',
    'hero.press': 'PATENTS',
    'hero.bio.1.1': '4 years in lithium battery & energy storage data development.',
    'hero.bio.1.2': 'Led 10+ data systems to production.',
    'hero.bio.1.3': '2 invention patents filed. 5,000+ man-hours saved.',
    'hero.bio.2.1': 'Deep user of Claude Code and Codex.',
    'hero.bio.2.2': 'AI is embedded in every step:',
    'hero.bio.2.3': 'requirements, design, coding, debugging, testing, and docs.',
    'hero.bio.3': 'Solid foundation in ETL, data cleaning, scheduling, modeling, and automated reporting — combined with AI application capabilities from data governance and RAG knowledge bases to workflow orchestration and agent scenario validation.',
    'hero.bio.4.1': 'What drives me:',
    'hero.bio.4.2': 'connecting data and AI to solve real business problems.',
    'hero.bio.4.3': 'End-to-end, from architecture to production.',
    'hero.cta.path': 'My Path',
    'hero.cta.projects': 'What I Build',
    'hero.cta.talk': 'Let\'s Talk',
    'hero.cta.ask': 'Ask Me',

    // Nav
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.sharing': 'Sharing',
    'nav.education': 'Education',
    'nav.skills': 'Skills & Stack',
    'nav.contact': 'Contact',

    // Experience
    'exp.title': 'Work Experience',
    'exp.subtitle': 'End-to-end ownership of data products — from requirements research and architecture design to development, deployment, and iteration.',
    'exp.tag.1.title': 'AI-Native Development',
    'exp.tag.1.desc': 'Claude Code, Codex deeply integrated into requirements analysis, code generation, refactoring, debugging, testing, and documentation',
    'exp.tag.2.title': 'AI Applications & Agents',
    'exp.tag.2.desc': 'Private LLM deployment, Dify platform, RAG knowledge base, Workflow orchestration, NL2SQL Agent prototyping',
    'exp.tag.3.title': 'ETL Architecture',
    'exp.tag.3.desc': 'ETL pipelines, data cleaning & transformation, scheduling orchestration, data modeling, quality control',
    'exp.tag.4.title': 'Domain Expertise',
    'exp.tag.4.desc': 'Deep knowledge in lithium battery testing & energy storage labs — cycle life, thermal runaway, safety testing',
    'exp.tag.5.title': 'Measurable Impact',
    'exp.tag.5.desc': 'Up to 35x data processing speedup, 99.9% scheduling success rate, significant reduction in manual effort',
    'exp.tag.6.title': 'Standardization & Enablement',
    'exp.tag.6.desc': 'Standardized development docs, SOPs, and business rule abstraction — empowering 20+ R&D and testing staff',

    'exp.job.1.role': 'Software Development Engineer',
    'exp.job.1.desc': 'Led the full data lifecycle for lithium battery testing — built ETL platforms, automated reporting systems, and drove AI application adoption in production scenarios.',
    'exp.job.2.role': 'R&D Engineer Assistant',
    'exp.job.2.desc': 'Full-cycle data processing for thermal runaway experiments. Established production line data tracking and standardized testing report workflows.',

    // Projects
    'proj.title': 'Projects',
    'proj.infra.title': 'AI & Data Infrastructure',
    'proj.infra.private': 'Enterprise',
    'proj.infra.quote': '"From raw data to structured insights — fully automated."',
    'proj.infra.orchestrator': 'ETL Platform (Core)',
    'proj.status.opensource': 'Personal Project',
    'proj.status.portfolio': 'This Portfolio',
    'proj.status.production': 'In Production',

    // Sharing
    'share.title': 'Sharing',
    'share.subtitle': '',
    'share.educator': '',
    'share.educator.desc': '',
    'share.talks': '',
    'share.talk.1': '',
    'share.talk.2': '',
    'share.talk.3': '',
    'share.talk.4': '',

    // Education
    'edu.title': 'Education',
    'edu.1.degree': 'Photovoltaic Power Generation Technology',
    'edu.1.note': 'Top 5-10% · National Scholarship',
    'edu.2.degree': '',
    'edu.3.degree': '',
    'edu.3.quote': '',
    'edu.4.degree': '',
    'edu.4.note': '',

    // Certs
    'cert.title': 'Patents',

    // Skills
    'skills.title': 'Skills',
    'skills.lang': 'Languages',
    'skills.lang.es': 'Chinese (Mandarin)',
    'skills.lang.es.level': 'Native',
    'skills.lang.en': 'English',
    'skills.lang.en.level': 'Reading technical docs',
    'skills.soft': 'Soft Skills',
    'skills.tech': 'Tech Stack',
    'skills.soft.1': 'Requirements Analysis',
    'skills.soft.2': 'Architecture Design',
    'skills.soft.3': 'End-to-End Ownership',
    'skills.soft.4': 'Problem Solving',
    'skills.soft.5': 'Documentation & SOP',
    'skills.soft.6': 'Cross-team Collaboration',
    'skills.soft.7': 'AI-Native Workflow',

    // Contact
    'contact.title': 'Let\'s Talk?',
    'contact.desc': 'I build data systems and AI applications in production. If you have interesting challenges where data and AI can make a difference — drop me a line.',
    'contact.btn': 'Contact Me',

    // Chat
    'chat.welcome': 'Hi! I\'m Hermes, Liu\'s AI assistant. How can I help you?',
    'chat.subtitle': 'Ask me about my experience',
    'chat.placeholder': 'Type your question...',
  },
  zh: {
    // Hero
    'hero.greeting': '你好，我是',
    'hero.title.1': 'AI × 数据工程师',
    'hero.title.2.1': 'ETL 全链路架构与调度平台建设',
    'hero.title.2.2': '私有化大模型部署与 RAG 知识库',
    'hero.title.2.3': 'AI Native 开发工作流实践者',
    'hero.badge.builder': '数据工程师',
    'hero.badge.operator': 'AI 应用实践者',
    'hero.press': '发明专利',
    'hero.bio.1.1': '4 年新能源锂电行业数据开发经验。',
    'hero.bio.1.2': '主导 10+ 套数据系统落地。',
    'hero.bio.1.3': '沉淀 2 项发明专利，节省 5000+ 工时。',
    'hero.bio.2.1': '长期深度使用 Claude Code、Codex。',
    'hero.bio.2.2': 'AI 已融入需求分析、方案设计、',
    'hero.bio.2.3': '编码、调试、测试与文档沉淀的全流程。',
    'hero.bio.3': '具备 ETL、数据清洗转换、调度编排、入库建模、报表自动化全链路开发能力，同时拥有从数据治理、RAG 知识库、Workflow 编排到 Agent 场景验证的完整 AI 应用实践。',
    'hero.bio.4.1': '我关注的核心问题：',
    'hero.bio.4.2': '让数据和 AI 解决真实的业务问题。',
    'hero.bio.4.3': '端到端，从架构设计到生产上线。',
    'hero.cta.path': '我的经历',
    'hero.cta.projects': '我的项目',
    'hero.cta.talk': '联系我',
    'hero.cta.ask': '向我提问',

    // Nav
    'nav.experience': '工作经历',
    'nav.projects': '项目',
    'nav.sharing': '分享',
    'nav.education': '教育背景',
    'nav.skills': '技能与技术栈',
    'nav.contact': '联系方式',

    // Experience
    'exp.title': '工作经历',
    'exp.subtitle': '数据产品全生命周期管理 — 从需求调研、架构设计到开发部署与运维迭代。',
    'exp.tag.1.title': 'AI Native 开发方式',
    'exp.tag.1.desc': 'Claude Code、Codex 深度融入需求拆解、代码生成、重构调优、日志排查、测试补全与文档输出',
    'exp.tag.2.title': 'AI 应用与 Agent 场景',
    'exp.tag.2.desc': '本地大模型部署、Dify 平台搭建、RAG 知识库治理、Workflow 编排、NL2SQL Agent 原型开发',
    'exp.tag.3.title': 'ETL 架构设计',
    'exp.tag.3.desc': 'ETL 开发、数据清洗转换、调度编排、入库建模、数据质量管控',
    'exp.tag.4.title': '新能源垂直业务',
    'exp.tag.4.desc': '深耕锂电测试与储能实验室场景，熟悉循环寿命、热失控、安全测试等核心流程',
    'exp.tag.5.title': '量化结果导向',
    'exp.tag.5.desc': '数据处理效率最高提升 35 倍，调度成功率 99.9%，显著降低人工成本与出错率',
    'exp.tag.6.title': '标准化与赋能',
    'exp.tag.6.desc': '标准化开发文档与 SOP 输出，业务规则抽象与系统化建设，赋能 20+ 名研发测试人员',

    'exp.job.1.role': '软件开发工程师',
    'exp.job.1.desc': '主导锂电测试数据全链路治理体系搭建，研发自动化数据处理工具与标准化 ETL 流程，推动私有化大模型与 AI 应用在生产场景落地。',
    'exp.job.2.role': '研发工程师助理',
    'exp.job.2.desc': '参与电芯热失控实验全流程数据处理，建立产线数据跟踪机制，统筹多维度测试数据整理与报告编制。',

    // Projects
    'proj.title': '项目',
    'proj.infra.title': 'AI 与数据基础设施',
    'proj.infra.private': '企业项目',
    'proj.infra.quote': '"从原始数据到结构化洞察 — 全流程自动化。"',
    'proj.infra.orchestrator': 'ETL 平台（核心）',
    'proj.status.opensource': '个人项目',
    'proj.status.portfolio': '本作品集',
    'proj.status.production': '生产环境',

    // Sharing
    'share.title': '分享',
    'share.subtitle': '',
    'share.educator': '',
    'share.educator.desc': '',
    'share.talks': '',
    'share.talk.1': '',
    'share.talk.2': '',
    'share.talk.3': '',
    'share.talk.4': '',

    // Education
    'edu.title': '教育背景',
    'edu.1.degree': '光伏发电技术与应用',
    'edu.1.note': '专业前 5-10% · 国家励志奖学金',
    'edu.2.degree': '',
    'edu.3.degree': '',
    'edu.3.quote': '',
    'edu.4.degree': '',
    'edu.4.note': '',

    // Certs
    'cert.title': '专利',

    // Skills
    'skills.title': '技能',
    'skills.lang': '语言',
    'skills.lang.es': '中文（普通话）',
    'skills.lang.es.level': '母语',
    'skills.lang.en': '英语',
    'skills.lang.en.level': '技术文档阅读',
    'skills.soft': '软技能',
    'skills.tech': '技术栈',
    'skills.soft.1': '需求分析',
    'skills.soft.2': '架构设计',
    'skills.soft.3': '端到端交付',
    'skills.soft.4': '问题诊断',
    'skills.soft.5': '文档与 SOP',
    'skills.soft.6': '跨团队协作',
    'skills.soft.7': 'AI 原生工作流',

    // Contact
    'contact.title': '聊聊吗？',
    'contact.desc': '我在生产环境中构建数据系统和 AI 应用。如果你有数据和 AI 能发挥作用的有趣挑战 — 请联系我。',
    'contact.btn': '联系我',

    // Chat
    'chat.welcome': '你好！我是刘明青的 AI 助理 Hermes。有什么可以帮你的？',
    'chat.subtitle': '了解我的经验',
    'chat.placeholder': '输入消息...',
  }
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: (key: string) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      if (e.detail) {
        setLang(e.detail as Language);
      } else {
        const savedLang = localStorage.getItem('lang') as Language;
        if (savedLang) setLang(savedLang);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    
    // Initial load
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) setLang(savedLang);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const t = (key: string): string => {
    // @ts-ignore
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
