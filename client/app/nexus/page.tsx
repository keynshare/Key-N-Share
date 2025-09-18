'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

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

const BACKEND_ENDPOINT = '/api/nexus'; // adjust if different eg:- { "userInput":"What is KeyNShare"}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'greet-1',
      role: 'bot',
      text:
        'Hi there! I am Nexus Bot. Ask anything about datasets, payments, or KeynShare’s flow—happy to help.',
      typed: true
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

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
    // You can pass additional context or model overrides here if needed.
    const body = {
      prompt,
      context: {
        source: 'Nexus Bot UI',
        timestamp: new Date().toISOString()
      },
      model: 'gemini-2.0-flash',
      temperature: 0.2,
      maxTokens: 768
    };

    const resp = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      throw new Error(`Backend ${resp.status}: ${t || 'Unknown error'}`);
    }
    const data = await resp.json();
    // Expecting { answer: string }
    return data?.answer || 'Sorry, I could not generate a response.';
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
    } catch (e: any) {
      const errText =
        e?.message || 'Something went wrong while contacting the assistant.';
      const botErr: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: `Error: ${errText}`,
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

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="border-b border-neutral-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Nexus Bot</h1>
          <span className="text-xs text-neutral-400">Always ready to help</span>
        </div>
      </header>

      <main className="flex-1">
        <div
          ref={listRef}
          className="max-w-3xl mx-auto h-[calc(100vh-160px)] overflow-y-auto px-4 py-6 space-y-4"
        >
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`whitespace-pre-wrap break-words max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors
                ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-800 text-neutral-100'
                }`}
              >
                {renderText(m)}
                {m.typed && (
                  <span className="inline-block w-2 ml-1 animate-pulse">|</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm outline-none focus:border-indigo-600 transition-colors"
              placeholder="Type a message... Press Enter to send"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-3 text-sm font-medium"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Messages are generated by Nexus Bot. Avoid sharing sensitive data.
          </div>
        </div>
      </footer>
    </div>
  );
}
