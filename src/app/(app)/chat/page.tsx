'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MoreVertical, 
  Plus, 
  LayoutDashboard,
  CheckCircle2,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendChatMessage, getChatHistory } from './actions';
import { useUserStore } from '@/store/useUserStore';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const profile = useUserStore((state) => state.profile);

  useEffect(() => {
    async function loadHistory() {
      const history = await getChatHistory();
      setMessages(history);
    }
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(input, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response, created_at: new Date().toISOString() }]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] overflow-hidden rounded-3xl m-4 bg-white border border-[#e0e3de] shadow-sm">
      {/* Left Panel: Today's Snapshot (Desktop) */}
      <aside className="hidden lg:flex w-80 flex-col border-r border-[#E8E2D9] bg-white overflow-y-auto">
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => setInput(action)}
                  className="text-left p-3 text-sm text-gray-600 bg-[#f7faf5] hover:bg-[#ecefe9] border border-[#e0e3de] rounded-xl transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#e0e3de]">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Today's Snapshot</h2>
            <div className="space-y-4">
              <SnapshotBar label="CALORIES" current={1450} target={2000} unit="kcal" color="bg-[#1e6b47]" />
              <div className="grid grid-cols-3 gap-2">
                <SnapshotMini label="PRO" current={80} target={120} color="bg-[#ff6e49]" />
                <SnapshotMini label="CARB" current={150} target={250} color="bg-[#E0A800]" />
                <SnapshotMini label="FAT" current={40} target={65} color="bg-[#5D8AA8]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col bg-[#f7faf5] relative">
        <header className="px-6 py-4 bg-white border-b border-[#e0e3de] flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e6b47] flex items-center justify-center text-white font-bold">
              N
            </div>
            <div>
              <h2 className="font-bold text-gray-900">NutriAI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </Button>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
              <div className="w-16 h-16 bg-[#1e6b47]/10 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-[#1e6b47]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Start a new conversation</h3>
              <p className="text-gray-500 max-w-xs">Ask me about meal ideas, nutritional advice, or your daily progress.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#1e6b47] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                  N
                </div>
              )}
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1e6b47] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-[#e0e3de] rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#1e6b47] flex items-center justify-center text-white text-xs font-bold shrink-0">
                N
              </div>
              <div className="bg-white border border-[#e0e3de] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
              </div>
            </div>
          )}
        </div>

        <footer className="p-6 bg-white border-t border-[#e0e3de]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask NutriAI anything..."
                  rows={1}
                  className="w-full bg-[#f7faf5] border border-[#e0e3de] rounded-2xl pl-4 pr-12 py-4 text-sm focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none resize-none min-h-[56px] transition-all"
                />
                <button className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-[#1e6b47] transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#ff6e49] text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shrink-0"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
              AI responses may not be 100% accurate. Consult a doctor for medical advice.
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}

function SnapshotBar({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
        <span>{label}</span>
        <span>{current} / {target} {unit}</span>
      </div>
      <div className="h-2 bg-[#ecefe9] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function SnapshotMini({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1">
      <span className="text-[9px] font-bold text-gray-400 block uppercase">{label}</span>
      <div className="h-1.5 bg-[#ecefe9] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${color}`}
        />
      </div>
      <span className="text-[10px] font-bold text-gray-600">{current}g</span>
    </div>
  );
}

const QUICK_ACTIONS = [
  "What should I eat for dinner?",
  "Am I on track today?",
  "Healthy version of biryani?",
  "Post-workout meal ideas",
  "I'm craving something sweet",
  "Give me a weekly summary"
];
