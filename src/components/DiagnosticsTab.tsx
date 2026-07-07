/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, Thermometer, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

interface DiagnosticsTabProps {
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isThinking: boolean;
}

const QUICK_QUESTIONS = [
  { text: "💧 Mi aire gotea agua por la unidad interior", short: "Goteo de agua" },
  { text: "❄️ Enciende pero no enfría la habitación", short: "No está enfriando" },
  { text: "🔊 Hace un ruido metálico extraño al arrancar", short: "Ruido extraño" },
  { text: "🤢 Huele a humedad/sucio cuando lo prendo", short: "Mal olor" },
];

export default function DiagnosticsTab({ chatMessages, onSendMessage, isThinking }: DiagnosticsTabProps) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickQuestionClick = (text: string) => {
    if (isThinking) return;
    onSendMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Bot Chat Header Banner */}
      <div className="bg-[#1e293b] text-white px-4 py-3 border-b border-slate-700/50 shadow-xs flex items-center gap-2.5 z-10 select-none">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
          <Sparkles className="w-4 h-4 fill-blue-400 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">Soporte Inteligente</span>
            <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25 rounded px-1.5 py-0.2 select-none">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              SISTEMA AI
            </span>
          </div>
          <span className="text-[10px] text-slate-300 block mt-0.5">Diagnóstico preventivo de aire acondicionado</span>
        </div>
      </div>

      {/* Message History Scroller */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col gap-4 my-auto py-4">
            
            {/* Welcoming message */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3 items-center text-center max-w-md mx-auto w-full">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-800">¿Qué le pasa a tu equipo hoy?</span>
                <p className="text-xs text-slate-500 leading-normal mt-1.5">
                  Hola, soy tu asistente experto de aire acondicionado. Describe los síntomas de tu equipo y te daré un diagnóstico preventivo inmediato.
                </p>
              </div>
            </div>

            {/* Quick Suggestions list */}
            <div className="flex flex-col gap-2.5 max-w-md mx-auto w-full">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Consultas Técnicas Comunes</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestionClick(q.text)}
                    className="w-full text-left text-xs py-2.5 px-3 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl font-medium text-slate-700 transition-all shadow-2xs cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-blue-500">•</span>
                    {q.short}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                  isUser ? 'bg-slate-700' : 'bg-blue-600'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble container */}
                <div className={`flex flex-col gap-0.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`rounded-2xl p-3 text-xs leading-normal font-medium shadow-2xs whitespace-pre-line ${
                    isUser
                      ? 'bg-slate-800 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400/80 px-1 mt-0.5">{msg.timestamp}</span>
                </div>
              </div>
            );
          })
        )}

        {/* AI typing state bubble */}
        {isThinking && (
          <div className="flex gap-2 self-start max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-2xs flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">ClimaSoporte está diagnosticando...</span>
              <div className="flex gap-0.5 mt-1.5 align-middle">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatBottomRef} />
      </div>

      {/* Safety warning */}
      <div className="px-4 py-1.5 bg-amber-50 text-amber-700 border-t border-b border-amber-100 flex items-center gap-1.5 text-[9px] select-none">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <p className="leading-tight">
          <strong>Aviso de Seguridad:</strong> El diagnóstico virtual es meramente indicativo. No manipules instalaciones eléctricas o tuberías de refrigerante de alta presión tú mismo.
        </p>
      </div>

      {/* Input controls form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ej: Mi aire minisplit parpadea un led rojo..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
