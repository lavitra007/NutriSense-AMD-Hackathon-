'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  ArrowLeft, 
  Calendar, 
  Search, 
  Filter, 
  ChevronRight,
  Utensils,
  Clock,
  History as HistoryIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f7faf5]">
        <div className="w-12 h-12 border-4 border-[#1e6b47] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Meal History</h2>
            <p className="text-sm text-gray-500 mt-1">Review your past logs and insights.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search meals..." 
              className="pl-10 pr-4 py-2 bg-white border border-[#e0e3de] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6b47]/20 w-full md:w-64"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-[#e0e3de] bg-white">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {logs.length === 0 ? (
        <div className="bg-white border border-[#e0e3de] rounded-3xl p-20 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-20 h-20 bg-[#f7faf5] rounded-full flex items-center justify-center">
            <HistoryIcon className="w-10 h-10 text-[#1e6b47]/30" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No History Yet</h3>
          <p className="text-sm text-gray-500 max-w-xs">Start scanning your meals to build your nutritional history.</p>
          <Link href="/scanner">
            <Button className="bg-[#1e6b47] hover:bg-[#005232] text-white px-8 py-6 rounded-xl mt-4">
              Open Scanner
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={log.id}
              className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#f1f5ef] flex items-center justify-center text-[#1e6b47] font-bold text-xl group-hover:scale-110 transition-transform">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{log.food_name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[10px] font-bold text-[#1e6b47] uppercase tracking-wider">{log.meal_type}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <p className="text-lg font-bold text-gray-900">{log.calories}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">CALORIES</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-[#f7faf5] border border-[#e0e3de] rounded-lg text-center min-w-[50px]">
                    <p className="text-[8px] font-bold text-gray-400">P</p>
                    <p className="text-xs font-bold">{log.protein_g}g</p>
                  </div>
                  <div className="px-3 py-1 bg-[#f7faf5] border border-[#e0e3de] rounded-lg text-center min-w-[50px]">
                    <p className="text-[8px] font-bold text-gray-400">C</p>
                    <p className="text-xs font-bold">{log.carbs_g}g</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e6b47] transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
