import { HeroSection } from './components/HeroSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection, CertificationsSection, SkillsSection } from './components/MiscSections';
import { HeaderActions } from './components/HeaderActions';
import { SidebarNav } from './components/SidebarNav';
import { FloatingAssistant } from './components/FloatingAssistant';
import { I18nProvider, useI18n } from './i18n';

const ContactSection = () => {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-32 flex flex-col items-center text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-accent mb-6 tracking-tight">{t('contact.title')}</h2>
      <p className="text-text-secondary max-w-md mx-auto mb-10 leading-relaxed text-lg">
        {t('contact.desc')}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="mailto:lmq0205a@163.com"
           className="px-8 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity text-sm flex items-center gap-2 shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          {t('contact.btn')}
        </a>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-border-subtle py-8 flex justify-between items-center text-xs text-text-muted mt-12">
    <span>© 2026 刘明青</span>
  </footer>
);

function AppContent() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans antialiased selection:bg-white/20 dot-bg relative">
      <div className="fixed inset-0 pointer-events-none z-[-1] hero-glow-1"></div>
      <div className="fixed inset-0 pointer-events-none z-[-1] hero-glow-2"></div>
      
      <HeaderActions />
      <SidebarNav />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-accent focus:text-bg-base focus:z-50">
        Skip to content
      </a>
      
      <main id="main-content" className="max-w-4xl mx-auto px-6 lg:pl-32">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        
        <div id="education">
          <EducationSection />
          <CertificationsSection />
        </div>
        
        <div id="skills">
          <SkillsSection />
        </div>
        
        <ContactSection />
      </main>
      
      <div className="max-w-4xl mx-auto px-6 lg:pl-32">
        <Footer />
      </div>

      <FloatingAssistant />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
