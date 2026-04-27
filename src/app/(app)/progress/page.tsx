'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Moon, 
  Droplets, 
  AlertTriangle, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Verified,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeeklyStats } from './actions';

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getWeeklyStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f7faf5]">
        <Loader2 className="w-12 h-12 text-[#1e6b47] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8 bg-[#f7faf5] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Weekly Progress</h2>
          <p className="text-sm text-gray-500 mt-1">Review your nutritional journey and habit formation.</p>
        </div>
        <div className="flex items-center bg-white border border-[#e0e3de] rounded-xl p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold px-4">Apr 14–20, 2026</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Avg Daily Cals" value={stats.avgCals} unit="kcal" />
        <StatCard 
          label="Protein Goal Days" 
          value={stats.proteinGoalDays} 
          unit="/7" 
          icon={<Verified className="w-5 h-5 text-[#1e6b47]" />} 
          border="border-l-4 border-l-[#1e6b47]"
        />
        <StatCard 
          label="Clean Eating Days" 
          value={4} 
          unit="/7" 
          secondary="Target: 5" 
          border="border-l-4 border-l-[#ff6e49]"
        />
        <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e6b47]/5 to-transparent" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">NutriScore</span>
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#ecefe9" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" stroke="#1e6b47" strokeWidth="3" 
                  strokeDasharray="74, 100" strokeLinecap="round" 
                />
              </svg>
              <span className="absolute text-sm font-bold text-[#1e6b47]">74</span>
            </div>
            <span className="text-sm font-medium text-gray-500">/100</span>
          </div>
        </div>
      </div>

      {/* Calorie Chart */}
      <div className="bg-white border border-[#e0e3de] rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-gray-900">Calorie Intake vs Target</h3>
          <div className="flex gap-4">
            <LegendItem color="bg-[#1e6b47]" label="On Target" />
            <LegendItem color="bg-[#ff6e49]" label="Over Target" />
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" radius={[6, 6, 0, 0]} barSize={40}>
                {stats.chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.calories > 2000 ? '#ff6e49' : '#1e6b47'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Behavioral Insights */}
        <div className="bg-white border border-[#e0e3de] rounded-2xl p-8 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900">Behavioral Insights</h3>
          <InsightRow 
            icon={<TrendingUp className="w-5 h-5 text-[#1e6b47]" />}
            title="Protein consistency is up 15%"
            desc="You've hit your 120g target more frequently than last week."
            color="border-l-[#1e6b47]"
          />
          <InsightRow 
            icon={<Moon className="w-5 h-5 text-[#ff6e49]" />}
            title="Late night snacking detected"
            desc="Carb-heavy snacks observed after 9 PM on Thursday and Sunday."
            color="border-l-[#ff6e49]"
          />
          <InsightRow 
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
            title="Hydration needs attention"
            desc="Average intake dropped below 2L on active days."
            color="border-l-blue-500"
          />
        </div>

        {/* Highlights */}
        <div className="space-y-6">
          <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 relative overflow-hidden shadow-sm group">
            <div className="absolute right-0 top-0 w-32 h-full opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
               {/* Pattern overlay */}
            </div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Highest Calorie Meal</h3>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{stats.worstMeal?.food_name || 'N/A'}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-red-500">{stats.worstMeal?.calories || 0} kcal</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">Logged on {stats.worstMeal ? new Date(stats.worstMeal.created_at).toLocaleDateString() : '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Best Day</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1e6b47]/10 flex items-center justify-center text-[#1e6b47] font-bold">
                  TUE
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Perfectly Balanced</h4>
                  <p className="text-sm text-gray-500 mt-1">All macros within 5% of target</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowRight className="w-5 h-5 text-[#1e6b47]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projected Impact */}
      <div className="bg-emerald-950 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <Sparkles className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5" />
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Projected Impact
        </h3>
        <p className="text-emerald-100/80 mb-10 text-lg">If you maintain this week's habits for 3 months:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ImpactMetric label="Weight Change" value="-1.8 kg" sub="Projected" />
          <ImpactMetric label="Protein Adherence" value="85%" sub="High Consistency" />
          <ImpactMetric label="NutriScore" value="82" sub="+8 Improvement" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, secondary, icon, border }: any) {
  return (
    <div className={`bg-white border border-[#e0e3de] rounded-2xl p-6 flex flex-col justify-between h-36 shadow-sm ${border} transition-all hover:shadow-md`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
          {secondary && <span className="ml-3 text-[10px] font-bold text-[#ff6e49] bg-[#ff6e49]/10 px-2 py-1 rounded-full">{secondary}</span>}
        </div>
        {icon}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function InsightRow({ icon, title, desc, color }: any) {
  return (
    <div className={`p-4 bg-[#f7faf5] border border-[#e0e3de] border-l-4 ${color} rounded-2xl flex items-start gap-4 transition-all hover:translate-x-1`}>
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function ImpactMetric({ label, value, sub }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-2">{label}</span>
      <span className="text-3xl font-bold block">{value}</span>
      <span className="text-xs text-emerald-100/40 mt-1 block">{sub}</span>
    </div>
  );
}
