import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { Typography } from '../components/core/Typography';
import { useChatHistory, useSendMessage } from '../hooks/useChat';

export function Chat() {
  const { data: chatHistory, isLoading, isError } = useChatHistory();
  const sendMessageMutation = useSendMessage();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = chatHistory || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);

  const handleSend = () => {
    if (!inputText.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate(inputText, {
      onSuccess: () => {
        setInputText('');
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      <div className="flex flex-col h-full max-w-4xl mx-auto w-full md:border-x md:border-surface-border md:shadow-2xl bg-background md:bg-surface/20">
        {/* Header */}
        <div className="flex items-center px-6 py-4 bg-surface border-b border-surface-border z-10 shrink-0">
          <div className="p-2.5 rounded-xl bg-brand-muted border border-brand/30 mr-4">
            <Sparkles size={24} color="#00F2FE" />
          </div>
          <div>
            <Typography variant="h2" color="ink" className="font-bold text-xl">
              Gemini AI
            </Typography>
            <Typography variant="caption" color="inkMuted" className="text-xs">
              TELEMETRY & WATER QUALITY ASSISTANT
            </Typography>
          </div>
        </div>

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} color="#00F2FE" className="animate-spin" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Typography variant="body" color="danger">Failed to load chat history.</Typography>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center h-full">
              <Bot size={64} color="#1A253A" className="mb-6" />
              <Typography variant="body" color="inkMuted" className="max-w-md text-lg">
                Hi, I'm the SHELLOC AI. Ask me to interpret water quality readings, explain flocculation logs, or provide remediation advice!
              </Typography>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-10 h-10 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center mr-4 mt-1 shrink-0">
                      <Bot size={18} color="#00F2FE" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
                      isUser
                        ? 'bg-brand rounded-tr-sm shadow-sm shadow-brand/30'
                        : 'bg-surface-elevated border border-surface-border rounded-tl-sm'
                    }`}
                  >
                    <Typography
                      variant="body"
                      color={isUser ? 'dark' : 'ink'}
                      className={isUser ? 'font-medium md:text-lg' : 'md:text-lg leading-relaxed'}
                    >
                      {msg.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isUser ? 'dark' : 'inkSubtle'}
                      className={`text-[11px] mt-3 block text-right ${isUser ? 'opacity-70' : ''}`}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </div>

                  {isUser && (
                    <div className="w-10 h-10 rounded-full bg-surface-elevated border border-brand/40 flex items-center justify-center ml-4 mt-1 shrink-0">
                      <User size={18} color="#00F2FE" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Pending indicator when mutation is loading */}
          {sendMessageMutation.isPending && (
            <div className="w-full flex justify-start">
              <div className="w-10 h-10 rounded-full bg-surface-elevated border border-surface-border flex items-center justify-center mr-4 mt-1 shrink-0">
                <Bot size={18} color="#00F2FE" />
              </div>
              <div className="bg-surface-elevated border border-surface-border rounded-2xl rounded-tl-sm p-5 flex items-center justify-center">
                <Loader2 size={20} color="#00F2FE" className="animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-surface border-t border-surface-border flex items-center shrink-0">
          <div className="flex-1 bg-[#050914] border border-surface-border rounded-3xl flex items-center px-5 py-1 mr-4 min-h-[56px] shadow-inner focus-within:border-brand/50 transition-colors">
            <textarea
              className="flex-1 bg-transparent text-ink font-sans text-base md:text-lg outline-none resize-none overflow-hidden max-h-40 min-h-[28px] pt-4 placeholder:text-slate-600"
              placeholder="Ask about water quality..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={500}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || sendMessageMutation.isPending}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              inputText.trim() && !sendMessageMutation.isPending
                ? 'bg-brand shadow-md shadow-brand/40 hover:bg-brand-dark hover:scale-105'
                : 'bg-surface-elevated border border-surface-border cursor-not-allowed opacity-50'
            }`}
          >
            <Send
              size={20}
              color={inputText.trim() && !sendMessageMutation.isPending ? '#0B111E' : '#475569'}
              className={inputText.trim() && !sendMessageMutation.isPending ? 'ml-1' : ''}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
