'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { nexusApi } from '@/lib/api/NexusApi';
import { useNotifications } from '@/lib/notification-context';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Breadcrumb from '@/components/SharedComponents/Breadcrumb/Breadcrumb';

// Simple typewriter hook for per-message animation
function useTypewriter(text: string, speed = 18) {
  const [out, setOut] = useState('');
  const iRef = useRef(0);
  const txtRef = useRef(text);

  useEffect(() => {
    txtRef.current = text || '';
    setOut('');
    iRef.current = 0;
    if (!txtRef.current) return;

    let raf = 0;
    let last = 0;

    const step = (t: number) => {
      if (!last) last = t;
      const delta = t - last;
      if (delta >= speed && iRef.current < txtRef.current.length) {
        const chunk = Math.max(1, Math.floor(delta / speed));
        iRef.current = Math.min(iRef.current + chunk, txtRef.current.length);
        setOut(txtRef.current.slice(0, iRef.current));
        last = t;
      }
      if (iRef.current < txtRef.current.length) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, speed]);

  return out;
}

type Role = 'user' | 'bot';

type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  // when animating, render typedText instead of text
  typed?: boolean;
};

export default function NexusPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'greet-1',
      role: 'bot',
      text: 'Hi there! I am Nexus Bot. Ask anything about datasets, payments, or KeynShare\'s flow, happy to help.',
      typed: true
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const { notify } = useNotifications();

  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    // Smoothly scroll to bottom
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Compute the last message to animate (if any)
  const lastAnimated = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].typed) return messages[i];
    }
    return null;
  }, [messages]);

  const typedOut = useTypewriter(lastAnimated?.text || '', 12);

  const renderText = (m: ChatMessage) => {
    if (!lastAnimated || m.id !== lastAnimated.id) return m.text;
    return typedOut;
  };

  async function sendPrompt(prompt: string): Promise<string> {
    try {
      const response = await nexusApi.sendMessage(prompt);
      return response;
    } catch (error) {
      console.error('Error sending message to Nexus:', error);
      throw new Error('Failed to get response from Nexus Bot');
    }
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setInput('');

    // Add user message (animated)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      typed: true
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Wait briefly so user typewriter can start before bot call completes
      await new Promise(r => setTimeout(r, 120));

      const answer = await sendPrompt(trimmed);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: answer,
        typed: true
      };
      setMessages(prev => {
        // end previous animated message (user) so only bot animates now
        const ended = prev.map(m => (m.id === userMsg.id ? { ...m, typed: false } : m));
        return [...ended, botMsg];
      });
    } catch (e: unknown) {
       const errText = (e as Error).message ?? "Something went wrong while contacting the assistant.";
      
      notify({
        message: errText,
        type: 'error'
      });
      
      const botErr: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: `Sorry, I encountered an error: ${errText}`,
        typed: true
      };
      setMessages(prev => {
        const ended = prev.map(m => (m.id === userMsg.id ? { ...m, typed: false } : m));
        return [...ended, botErr];
      });
    } finally {
      // End animation on last message after some delay
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m => (m.id === lastAnimated?.id ? { ...m, typed: false } : m))
        );
        setSending(false);
      }, 250);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Nexus Bot", isActive: true }
  ];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-gray-900 dark:text-white flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <header className="border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-bricola">Nexus Bot</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your AI assistant for KeyNShare</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Always ready to help
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div
          ref={listRef}
          className="max-w-4xl mx-auto h-[calc(100vh-200px)] overflow-y-auto px-4 py-6 space-y-6"
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3`}
            >
              {m.role === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`whitespace-pre-wrap break-words max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors
                ${
                  m.role === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                {renderText(m)}
                {m.typed && (
                  <span className="inline-block w-2 ml-1 animate-pulse">|</span>
                )}
              </div>
              
              {m.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className=" sticky bottom-0 border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors"
              placeholder="Type a message... Press Enter to send"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-4 py-3 text-sm font-medium text-white flex items-center gap-2 transition-colors"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            Messages are generated by Nexus Bot using Gemini AI. Avoid sharing sensitive data.
          </div>
        </div>
      </footer>
    </div>
  );
}
