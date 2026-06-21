import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Briefcase, GitFork, HelpCircle, Mail } from 'lucide-react';
import avatarImg from '../assets/avatar.jpg';
import { useI18n } from '../i18n';

const API_BASE = import.meta.env.VITE_API_BASE || '';

interface Message {
  role: 'ai' | 'user';
  content: string;
  streaming?: boolean;
}

export const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const { t, lang } = useI18n();
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'ai', content: t('chat.welcome') }]);
    }
  }, [isOpen, messages.length, t, lang]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleQuickAction = (text: string) => {
    setInputValue(text);
    // Use setTimeout to ensure state is updated before sending
    setTimeout(() => {
      // Create a synthetic event object or call logic directly
      // Since handleSend uses inputValue from state, we need to pass text directly
      handleSendDirect(text);
    }, 0);
  };

  const handleSendDirect = async (text: string) => {
    if (!text || isSending) return;

    setInputValue('');
    setIsSending(true);

    // Add visitor message
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);

    // Add placeholder for streaming AI reply
    const aiMsgIndex = newMessages.length;
    setMessages(prev => [...prev, { role: 'ai', content: '', streaming: true }]);

    try {
      const resp = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: convId,
          message: text,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let fullReply = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'conv_id') {
              setConvId(data.conversation_id);
            } else if (data.type === 'chunk') {
              fullReply += data.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[aiMsgIndex] = { role: 'ai', content: fullReply, streaming: true };
                return updated;
              });
            } else if (data.type === 'done') {
              setMessages(prev => {
                const updated = [...prev];
                updated[aiMsgIndex] = { role: 'ai', content: fullReply, streaming: false };
                return updated;
              });
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      // Finalize: ensure streaming flag is off
      setMessages(prev => {
        const updated = [...prev];
        if (updated[aiMsgIndex]?.streaming) {
          updated[aiMsgIndex] = { ...updated[aiMsgIndex], streaming: false };
        }
        return updated;
      });
    } catch {
      const errorMsg = t('chat.error.network');
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = { role: 'ai', content: errorMsg, streaming: false };
        return updated;
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => handleSendDirect(inputValue.trim());

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[360px] h-[500px] max-h-[calc(100vh-120px)] bg-bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={avatarImg} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-border" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-bg-card"></div>
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">{t('chat.name')}</div>
                  <div className="text-xs text-text-secondary">{t('chat.subtitle') || 'Ask me about my experience'}</div>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-bg-pill border border-border text-text-primary rounded-tl-none'}`}>
                    {msg.streaming && !msg.content ? (
                      <span className="flex items-center gap-1 text-text-muted">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                    ) : (
                      <>
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                        {msg.streaming && (
                          <span className="inline-block w-1 h-3.5 bg-blue-400 animate-pulse ml-0.5 align-middle"></span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick Actions (only show if it's the beginning) */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => handleQuickAction(t('chat.action.exp'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors">
                    <Briefcase size={12} /> {t('chat.action.exp')}
                  </button>
                  <button onClick={() => handleQuickAction(t('chat.action.projects'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-colors">
                    <GitFork size={12} /> {t('chat.action.projects')}
                  </button>
                  <button onClick={() => handleQuickAction(t('chat.action.why'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors">
                    <HelpCircle size={12} /> {t('chat.action.why')}
                  </button>
                  <button onClick={() => handleQuickAction(t('chat.action.contact'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 transition-colors">
                    <Mail size={12} /> {t('chat.action.contact')}
                  </button>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-border-subtle bg-bg-card">
              <div className="flex items-center gap-2 px-3 py-2 bg-bg-base border border-border rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  disabled={isSending}
                />
                <button 
                  onClick={handleSend}
                  disabled={isSending || !inputValue.trim()}
                  className={`p-1.5 rounded-lg transition-colors ${inputValue.trim() && !isSending ? 'bg-blue-500 text-white' : 'bg-transparent text-text-muted hover:text-text-primary'}`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg border-2 border-white dark:border-border bg-bg-card flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-white">
            <X size={24} />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img src={avatarImg} alt="AI Assistant" className="w-full h-full rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[2.5px] border-white dark:border-bg-card"></div>
          </div>
        )}
      </button>
    </>
  );
};
