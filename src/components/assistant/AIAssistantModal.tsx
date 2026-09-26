import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Pill, 
  Activity, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Trash2,
  Globe,
  ExternalLink,
  Search,
  Info
} from 'lucide-react';
import { 
  ChatMessage, 
  UserProfile, 
  Allergy, 
  MedicalCondition, 
  Medication, 
  ReportAnalysis, 
  EquipmentScan, 
  Appointment 
} from '../../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  allergies?: Allergy[];
  conditions?: MedicalCondition[];
  medications?: Medication[];
  reports?: ReportAnalysis[];
  equipment?: EquipmentScan[];
  appointments?: Appointment[];
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  user,
  allergies,
  conditions,
  medications,
  reports,
  equipment,
  appointments,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const firstName = user?.name ? user.name.split(' ')[0] : 'there';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello ${firstName}, I am **BioLens Assistant**.\n\nI have securely accessed your authorized profile context (including your recent **CBC blood panel**, active **Lisinopril** prescription, and upcoming check-up with **Dr. Sarah Jenkins**).\n\nHow can I help you understand your medical information today?`,
      timestamp: 'Just now',
      citations: [
        { type: 'record', sourceName: 'Verified Patient Dossier', detail: 'Medications, Conditions & Reports' }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick prompt recommendations
  const quickPrompts = [
    'What does my latest blood test mean?',
    'Explain my previous report.',
    'What questions should I ask my doctor?',
    'Show me my current medications.'
  ];

  // Auto-scroll on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle incoming initialPrompt (e.g. from ReportAnalyzer "Ask Assistant About This Report")
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [isOpen, initialPrompt]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages,
          user,
          allergies,
          conditions,
          medications,
          reports,
          equipment,
          appointments
        })
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to assist with your medical questions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [
          { type: 'record', sourceName: 'Verified Patient Dossier' }
        ],
        webSearchQueries: data.webSearchQueries || [],
        groundedWithGoogleSearch: data.groundedWithGoogleSearch || false,
        quotaNotice: data.quotaNotice
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: 'Unable to connect to the BioLens clinical intelligence engine right now. Please verify your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Chat session refreshed. How can I help you explore your medical records or lab reports?`,
        timestamp: 'Just now'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end sm:p-6 pointer-events-none">
      {/* Dim backdrop on mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-xs sm:hidden pointer-events-auto"
        onClick={onClose}
      />

      <div
        className={`pointer-events-auto w-full sm:rounded-3xl bg-white/95 backdrop-blur-2xl border border-emerald-500/25 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-10 ${
          isExpanded
            ? 'h-[92vh] sm:w-[680px]'
            : 'h-[85vh] sm:h-[620px] sm:w-[460px] rounded-t-3xl'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-emerald-500/15 bg-gradient-to-r from-emerald-50/80 via-white to-[#EAFFF4]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F7F51] via-[#18A66A] to-emerald-400 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#18A66A]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-[#12201B]">BioLens Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-[#18A66A] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#0F7F51] flex items-center gap-1 font-medium">
                <Globe className="w-3 h-3 text-[#18A66A]" />
                <span>Live Verified Clinical Intelligence</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Guardrail Indicator */}
        <div className="px-4 py-1.5 bg-[#EAFFF4]/70 border-b border-emerald-500/10 flex items-center justify-between text-[11px] text-[#0F7F51] font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18A66A]" />
            <span>Educational health engine · Never replaces direct doctor consultation</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-500/15 font-bold">
            <Search className="w-2.5 h-2.5 text-[#18A66A]" />
            <span>Google Search</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0F7F51] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#18A66A] text-white rounded-tr-xs'
                      : 'bg-white border border-emerald-500/15 text-[#12201B] rounded-tl-xs space-y-2'
                  }`}
                >
                  {/* Markdown-style content rendering */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content.split('\n').map((line, lIdx) => {
                      if (line.startsWith('• ') || line.startsWith('- ')) {
                        return (
                          <div key={lIdx} className="flex items-start gap-1.5 my-0.5">
                            <span className="text-[#18A66A]">•</span>
                            <span>{line.replace(/^[•-]\s*/, '')}</span>
                          </div>
                        );
                      }
                      return <p key={lIdx} className={line === '' ? 'h-2' : ''}>{line}</p>;
                    })}
                  </div>

                  {/* Grounded Citation Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-emerald-500/10 flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, cIdx) => {
                        if (cite.type === 'web' && cite.url) {
                          return (
                            <a
                              key={cIdx}
                              href={cite.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 transition-colors shadow-2xs group"
                              title={cite.title || cite.url}
                            >
                              <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                              <span className="truncate max-w-[140px]">{cite.sourceName}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-blue-400 group-hover:text-blue-600 shrink-0" />
                            </a>
                          );
                        }
                        return (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0F7F51] bg-[#EAFFF4] px-2 py-0.5 rounded-md border border-emerald-500/15"
                          >
                            <FileText className="w-3 h-3 text-[#18A66A]" />
                            {cite.sourceName}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Google Search Queries Grounding Note */}
                  {msg.webSearchQueries && msg.webSearchQueries.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Search className="w-3 h-3 text-[#18A66A] shrink-0" />
                      <span>Google Search:</span>
                      <span className="italic text-slate-600 truncate max-w-[240px]">
                        "{msg.webSearchQueries.join('", "')}"
                      </span>
                    </div>
                  )}

                  {msg.quotaNotice && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-[11px] leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Assistant Notice:</span>
                        <span>{msg.quotaNotice}</span>
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right mt-1 ${
                      isUser ? 'text-emerald-100' : 'text-[#6C7C75]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#0F7F51] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-white border border-emerald-500/15 rounded-2xl rounded-tl-xs p-3.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#0F7F51] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#18A66A] animate-ping" />
                  <span>Consulting medical record index...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-emerald-500/10 overflow-x-auto scrollbar-none flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium text-slate-700 hover:text-[#0F7F51] bg-white border border-slate-200 hover:border-emerald-500/30 px-3 py-1 rounded-full shrink-0 transition-colors shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-emerald-500/15">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about your labs, medications, or doctor questions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:border-[#18A66A] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-[#18A66A] hover:bg-[#0F7F51] disabled:opacity-40 text-white shadow-sm transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
