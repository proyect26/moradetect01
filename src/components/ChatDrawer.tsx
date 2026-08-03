import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Language, Pathogen } from '../types';
import { USER_PROFILE, PATHOGENS_LIBRARY } from '../data/mockData';
import pdfData from '../data/pdfKnowledge.json';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  knowledgeBase?: Pathogen[];
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  groundedSource?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  knowledgeBase = PATHOGENS_LIBRARY,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text:
        lang === 'es'
          ? '¡Hola! Soy tu Asistente Agrónomo Moradetec. Puedo resolver tus consultas fitosanitarias sobre Mora de Castilla y Rosas basándome en los estudios científicos y la base de conocimiento local.'
          : 'Hello! I am your Moradetec AI Agronomist Assistant. I can resolve your phytosanitary queries based on scientific research and local knowledge.',
      time: 'Ahora',
    },
  ]);
  const [inputMsg, setInputMsg] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputMsg(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Scroll lock removed per user request

  if (!isOpen) return null;

  // Local Offline Grounded Search Engine over user knowledgeBase
  const searchLocalKnowledge = (query: string): Pathogen | null => {
    const q = query.toLowerCase();
    for (const p of knowledgeBase) {
      const sciName = p.scientificName.toLowerCase();
      const comEs = p.commonNameEs.toLowerCase();
      const comEn = p.commonNameEn.toLowerCase();
      const descEs = p.descriptionEs.toLowerCase();
      const symptoms = p.symptomsEs.join(' ').toLowerCase();

      if (
        q.includes(sciName) ||
        sciName.includes(q) ||
        q.includes(comEs) ||
        comEs.includes(q) ||
        comEn.includes(q) ||
        symptoms.includes(q) ||
        descEs.includes(q)
      ) {
        return p;
      }
    }
    return null;
  };

  // Filtered pathogens for Liquid Glass Search Modal
  const filteredKnowledge = searchQuery.trim()
    ? knowledgeBase.filter(
        (p) =>
          p.commonNameEs.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.symptomsEs.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.controlMeasuresEs.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : knowledgeBase;

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userText = (customText || inputMsg).trim();
    if (!userText || isLoading) return;

    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setShowSearchModal(false);
    setIsLoading(true);

    // First check offline/local knowledge base match
    const matchedPathogen = searchLocalKnowledge(userText);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, knowledgeContext: knowledgeBase }),
      });
      const data = await response.json();

      let replyText = data.reply;
      if (!replyText || replyText.includes('actualmente opero con la base de datos interna')) {
        if (matchedPathogen) {
          replyText = `📌 [Base de Conocimiento Local - ${matchedPathogen.commonNameEs} (${matchedPathogen.scientificName})]\n\n` +
            `• Severidad: ${matchedPathogen.severityEs}\n` +
            `• Diagnóstico: ${matchedPathogen.descriptionEs}\n\n` +
            `🔍 Síntomas principales:\n` +
            matchedPathogen.symptomsEs.map(s => ` - ${s}`).join('\n') + `\n\n` +
            `🛡️ Medidas de control recomendadas:\n` +
            matchedPathogen.controlMeasuresEs.map(c => ` - ${c}`).join('\n');
        } else {
          replyText = `He consultado la base de datos local de moras y rosas (${knowledgeBase.length} fichas registradas). Para consultas específicas, ingresa palabras clave como 'Botrytis', 'Mildeo', 'Mora', 'Antracnosis' o agrega la enfermedad en la Biblioteca.`;
        }
      }

      const aiMsgObj: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedSource: matchedPathogen ? matchedPathogen.commonNameEs : undefined
      };

      setMessages((prev) => [...prev, aiMsgObj]);
    } catch (err) {
      console.error('Chat error, running offline search fallback:', err);
      let replyText = '';
      if (matchedPathogen) {
        replyText = `📱 [Modo Offline - Datos Ingresados]\n\n` +
          `Enfermedad: ${matchedPathogen.commonNameEs} (${matchedPathogen.scientificName})\n` +
          `Estado: ${matchedPathogen.severityEs}\n\n` +
          `• Descripción: ${matchedPathogen.descriptionEs}\n` +
          `• Síntomas: ${matchedPathogen.symptomsEs.join(', ')}\n` +
          `• Control: ${matchedPathogen.controlMeasuresEs.join('; ')}`;
      } else {
        // Fallback to PDF Knowledge Search
        const qTerms = userText.toLowerCase().split(' ').filter(t => t.length > 3);
        const matchedChunks = pdfData.chunks.filter((chunk: string) => 
          qTerms.some(term => chunk.toLowerCase().includes(term))
        ).slice(0, 2);

        if (matchedChunks.length > 0) {
          replyText = `📱 [Modo Offline - Literatura Científica]\nEncontré información relevante en los documentos PDF:\n\n`;
          matchedChunks.forEach((chunk: string, i: number) => {
            replyText += `...${chunk.substring(0, 300)}...\n\n`;
          });
          replyText += `(Resultados extraídos de los documentos locales: ${pdfData.documents.join(', ')})`;
        } else {
          replyText = `📱 [Modo Offline]\nHe buscado en las ${knowledgeBase.length} fichas y en los manuales ICA locales, pero no encontré coincidencias exactas para tu consulta.`;
        }
      }

      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999998,
        display: 'flex',
        justifyContent: 'flex-end',
        pointerEvents: 'none', // Permite scroll e interacción con el fondo
        background: 'rgba(15, 5, 35, 0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'modalOverlayIn 0.22s ease-out forwards',
      }}
    >
      {/* Liquid Glass Main Panel Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '448px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
          pointerEvents: 'auto', // El panel sí captura clicks
          background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(237,220,255,0.82) 50%, rgba(255,255,255,0.90) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderLeft: '2px solid rgba(255,255,255,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '-8px 0 48px rgba(91,6,189,0.22), -2px 0 8px rgba(0,0,0,0.12), inset 1px 0 0 rgba(255,255,255,1)',
          color: '#0f172a',
          animation: 'slideFromRight 0.30s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        
        {/* Header */}
        <div className="relative z-10 flex justify-between items-center border-b border-purple-900/15 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 neu-raised p-1 flex items-center justify-center" style={{ borderRadius: '90px' }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                <img src={USER_PROFILE.labAvatar} alt="Moradetec AI" className="w-full h-full object-cover" />
              </div>
              {isLoading && (
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 blur-sm opacity-80 animate-ping pointer-events-none"></div>
              )}
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                Moradetec AI
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-[10px] text-purple-900 font-extrabold uppercase tracking-wider">
                {lang === 'es' ? 'Asistente Agrónomo • Liquid Glass Engine' : 'AI Agronomist • Liquid Glass Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 neu-raised flex items-center justify-center text-slate-800 font-black cursor-pointer active:neu-pressed"
            style={{ borderRadius: '90px' }}
          >
            ✕
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="relative z-10 flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[88%] p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'neu-btn-primary-raised text-white font-extrabold'
                      : 'liquid-glass text-slate-900 font-bold bg-white/80 border border-white'
                  }`}
                  style={{ borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px' }}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-purple-900/80 font-black mt-1 px-1">{msg.time}</span>
              </div>
            );
          })}

          {/* Thinking Module */}
          {isLoading && (
            <div className="flex flex-col items-start space-y-2 animate-fadeIn my-2">
              <div className="liquid-glass p-4 text-purple-950 max-w-[90%] flex items-center gap-4 relative overflow-hidden bg-white/80 border border-white" style={{ borderRadius: '20px 20px 20px 4px' }}>
                <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center neu-raised" style={{ borderRadius: '90px' }}>
                  <span className="material-symbols-outlined text-purple-900 text-base z-10 animate-spin">
                    auto_awesome
                  </span>
                </div>

                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-purple-950">
                      {lang === 'es' ? 'Procesando consulta fitosanitaria...' : 'Analyzing phytosanitary data...'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 h-4 pt-1">
                    <div className="w-1 bg-purple-600 rounded-full animate-wave-1"></div>
                    <div className="w-1 bg-purple-800 rounded-full animate-wave-2"></div>
                    <div className="w-1 bg-purple-900 rounded-full animate-wave-3"></div>
                    <div className="w-1 bg-purple-700 rounded-full animate-wave-4"></div>
                    <div className="w-1 bg-purple-500 rounded-full animate-wave-2"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* LIQUID GLASS SEARCH WINDOW POPUP / MODAL */}
        {showSearchModal && (
          <div className="relative z-20 liquid-glass p-4 rounded-2xl border border-white shadow-2xl bg-white/90 space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-300/60 pb-2">
              <span className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-purple-900">search</span>
                {lang === 'es' ? 'Ventana de Búsqueda Liquid Glass:' : 'Liquid Glass Search Window:'}
              </span>
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="text-xs font-black text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'es' ? 'Buscar plaga, hongo, síntoma o dosis...' : 'Search pest, disease or dosage...'}
              className="w-full px-3.5 py-2 neu-input text-xs font-bold text-slate-900 focus:outline-none"
            />

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredKnowledge.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleSendMessage(
                      undefined,
                      lang === 'es'
                        ? `¿Cuáles son los síntomas y protocolo de control para ${item.commonNameEs} (${item.scientificName})?`
                        : `What are symptoms and control steps for ${item.commonNameEn}?`
                    )
                  }
                  className="p-2.5 rounded-xl bg-white/80 hover:bg-purple-100/80 border border-purple-200/60 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="font-black text-xs text-purple-950">{item.commonNameEs}</p>
                    <p className="text-[10px] text-slate-600 italic font-medium">{item.scientificName}</p>
                  </div>
                  <span className="px-2 py-1 neu-raised text-[10px] font-black text-purple-900">
                    Preguntar →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liquid Glass Quick Action Pills */}
        <div className="relative z-10 flex gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <button
            type="button"
            onClick={() => setShowSearchModal(!showSearchModal)}
            className="px-3.5 py-2 liquid-glass hover:bg-purple-100/60 text-purple-950 font-black whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 border border-purple-300"
            style={{ borderRadius: '90px' }}
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span>{lang === 'es' ? 'Buscar Protocolo Liquid Glass' : 'Liquid Glass Search'}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(undefined, lang === 'es' ? '¿Cómo controlo el Mildeo Velloso en Mora?' : 'How to control Downy Mildew?')}
            className="px-3.5 py-2 liquid-glass hover:bg-white/90 text-slate-900 font-extrabold whitespace-nowrap cursor-pointer transition-all border border-white"
            style={{ borderRadius: '90px' }}
          >
            🍇 Mildeo Velloso Mora
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(undefined, lang === 'es' ? '¿Cómo prevengo el Moho Gris (Botrytis en Mora)?' : 'How to prevent Grey Mold?')}
            className="px-3.5 py-2 liquid-glass hover:bg-white/90 text-slate-900 font-extrabold whitespace-nowrap cursor-pointer transition-all border border-white"
            style={{ borderRadius: '90px' }}
          >
            🍇 Moho Gris Mora
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(undefined, lang === 'es' ? '¿Qué síntoma produce la Antracnosis de la Mora?' : 'What are symptoms of Anthracnose?')}
            className="px-3.5 py-2 liquid-glass hover:bg-white/90 text-slate-900 font-extrabold whitespace-nowrap cursor-pointer transition-all border border-white"
            style={{ borderRadius: '90px' }}
          >
            🍇 Antracnosis Mora
          </button>
        </div>

        {/* Input Controls in Liquid Glass Styling */}
        <form onSubmit={(e) => handleSendMessage(e)} className="relative z-10 flex gap-2 pt-2 border-t border-purple-900/15">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder={
              lang === 'es'
                ? 'Escribe tu pregunta al Robot IA...'
                : 'Ask your AI agronomist...'
            }
            className="flex-1 px-4 py-3 liquid-glass bg-white/80 border border-white text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            style={{ borderRadius: '18px' }}
          />
          <button
            type="submit"
            disabled={!inputMsg.trim() || isLoading}
            className="w-11 h-11 neu-btn-primary-raised hover:neu-btn-primary-pressed active:neu-btn-primary-pressed text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
            style={{ borderRadius: '90px' }}
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </form>

      </div>

      {/* Keyframes para la animación del drawer */}
      <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes modalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
};


