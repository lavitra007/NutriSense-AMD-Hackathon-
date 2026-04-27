import { createClient } from '@/lib/supabase/server';
import { logout } from '@/app/(auth)/actions';
import { 
  Activity, 
  Flame, 
  Droplet, 
  TrendingUp, 
  Plus, 
  LayoutDashboard, 
  Camera, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  Settings,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { calculateMacros } from '@/lib/nutrition/calculations';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch today's meals
  const today = new Date().toISOString().split('T')[0];
  const { data: mealLogs } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('logged_at', today)
    .order('logged_at', { ascending: true });

  // Fetch recent AI insights
  const { data: insights } = await supabase
    .from('ai_insights')
    .select('*, meal_logs(food_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const targets = profile ? calculateMacros(
    profile.weight_kg || 70,
    profile.height_cm || 170,
    profile.age || 25,
    profile.sex || 'other',
    profile.activity_level || 'moderate',
    profile.health_goal || 'lose_weight'
  ) : { calories: 2000, protein_g: 150, carbs_g: 200, fat_g: 65 };

  const consumed = (mealLogs || []).reduce((acc, log) => ({
    calories: acc.calories + (log.calories || 0),
    protein: acc.protein + (log.protein_g || 0),
    carbs: acc.carbs + (log.carbs_g || 0),
    fat: acc.fat + (log.fat_g || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const caloriesRemaining = Math.max(0, targets.calories - consumed.calories);
  const proteinPercent = Math.min(100, (consumed.protein / targets.protein_g) * 100);

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto w-full space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome back, {profile?.name?.split(' ')[0] || 'there'}!</p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="CALORIES REMAINING" 
            value={caloriesRemaining} 
            total={targets.calories} 
            unit="kcal"
            icon={Flame}
            color="text-[#005232]"
            progress={(consumed.calories / targets.calories) * 100}
          />
          <ProgressCard 
            label="PROTEIN" 
            value={consumed.protein} 
            target={targets.protein_g} 
            unit="g"
            color="bg-[#1e6b47]"
          />
          <HydrationCard current={6} target={8} />
          <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex flex-col justify-center gap-1 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DAY STREAK</h3>
            <div className="text-2xl font-bold text-[#ff6e49]">7 days 🔥</div>
            <span className="text-xs text-gray-500">Clean eating streak</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Today's Meals */}
          <div className="lg:col-span-7 bg-white border border-[#e0e3de] rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-900">Today's Meals</h2>
              <Link href="/history" className="text-sm font-semibold text-[#1e6b47] hover:underline">See all</Link>
            </div>
            
            <div className="relative border-l-2 border-[#f1f5ef] ml-3 pl-8 py-2 space-y-8">
              {['breakfast', 'lunch', 'dinner'].map((type) => {
                const meal = mealLogs?.find(m => m.meal_type === type);
                return (
                  <div key={type} className="relative">
                    <div className={`absolute w-4 h-4 rounded-full -left-[41px] top-1 border-4 border-white ${
                      meal ? 'bg-[#1e6b47]' : 'bg-[#e0e3de]'
                    }`} />
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">{type}</h4>
                    
                    {meal ? (
                      <div className="bg-[#f7faf5] border border-[#e0e3de] rounded-xl p-4 flex items-center justify-between group hover:border-[#1e6b47] transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#a7f3c5] flex items-center justify-center text-[#005232] font-bold">
                            {meal.food_name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{meal.food_name}</p>
                            <p className="text-xs text-gray-500">{meal.calories} kcal</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-white border border-[#e0e3de] text-[10px] font-bold px-2 py-1 rounded-lg">P: {meal.protein_g}g</span>
                          <span className="bg-white border border-[#e0e3de] text-[10px] font-bold px-2 py-1 rounded-lg">C: {meal.carbs_g}g</span>
                        </div>
                      </div>
                    ) : (
                      <Link href="/scanner">
                        <button className="w-full border-2 border-dashed border-[#e0e3de] rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-[#1e6b47] hover:border-[#1e6b47] transition-all bg-white group">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-semibold">Add meal</span>
                        </button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="lg:col-span-5 bg-white border border-[#e0e3de] rounded-2xl p-6 shadow-sm flex flex-col">
            <h2 className="font-bold text-gray-900 mb-8">Daily Macro Breakdown</h2>
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5ef" strokeWidth="3" />
                  <circle 
                    cx="18" cy="18" r="16" fill="none" 
                    stroke="#1e6b47" strokeWidth="3" 
                    strokeDasharray={`${(consumed.calories / targets.calories) * 100}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs text-gray-500">Consumed</span>
                  <span className="text-2xl font-bold">{consumed.calories}</span>
                  <span className="text-[10px] font-bold text-gray-400">OF {targets.calories}</span>
                </div>
              </div>

              <div className="w-full grid grid-cols-3 gap-4">
                <MacroStat label="PROTEIN" value={consumed.protein} target={targets.protein_g} color="bg-[#1e6b47]" />
                <MacroStat label="CARBS" value={consumed.carbs} target={targets.carbs_g} color="bg-[#e2b050]" />
                <MacroStat label="FAT" value={consumed.fat} target={targets.fat_g} color="bg-[#ff6e49]" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Card */}
        {insights?.[0] && (
          <div className="bg-[#f1f5ef] border-l-4 border-[#1e6b47] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-[#a7f3c5] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-[#005232]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">AI Nutritional Insight</h3>
                <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">{insights[0].content}</p>
              </div>
            </div>
            <Link href="/chat">
              <Button variant="outline" className="border-[#1e6b47] text-[#1e6b47] hover:bg-[#1e6b47] hover:text-white rounded-xl py-6 px-8">
                Ask NutriAI
              </Button>
            </Link>
          </div>
        )}
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
        active 
          ? 'bg-[#f1f5ef] text-[#005232] border-r-4 border-[#1e6b47]' 
          : 'text-gray-500 hover:bg-[#f7faf5] hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-[#1e6b47]' : 'group-hover:text-gray-700'}`} />
      {label}
    </Link>
  );
}

function StatCard({ label, value, unit, icon: Icon, color, progress }: any) {
  return (
    <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex items-center justify-between shadow-sm group hover:border-[#1e6b47] transition-all">
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${color}`}>{value}</span>
          <span className="text-[10px] font-bold text-gray-400">/ {unit}</span>
        </div>
      </div>
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5ef" strokeWidth="2.5" />
          <circle 
            cx="18" cy="18" r="16" fill="none" 
            stroke="currentColor" strokeWidth="2.5" 
            strokeDasharray={`${progress}, 100`}
            className={`transition-all duration-1000 ${color}`}
          />
        </svg>
        <Icon className={`absolute w-5 h-5 ${color}`} />
      </div>
    </div>
  );
}

function ProgressCard({ label, value, target, unit, color }: any) {
  const percent = Math.min(100, (value / target) * 100);
  return (
    <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex flex-col justify-center gap-2 shadow-sm hover:border-[#1e6b47] transition-all">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold">{value}{unit}</span>
        <span className="text-[10px] text-gray-400 font-bold">/ {target}{unit}</span>
      </div>
      <div className="w-full bg-[#f1f5ef] h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function HydrationCard({ current, target }: any) {
  return (
    <div className="bg-white border border-[#e0e3de] rounded-2xl p-6 flex flex-col justify-center gap-3 shadow-sm hover:border-[#1e6b47] transition-all">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">HYDRATION</h3>
        <span className="text-xs font-bold">{current} / {target} glasses</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: target }).map((_, i) => (
          <Droplet 
            key={i} 
            className={`w-4 h-4 ${i < current ? 'text-[#4ea8de] fill-[#4ea8de]' : 'text-[#e0e3de]'}`} 
          />
        ))}
      </div>
    </div>
  );
}

function MacroStat({ label, value, target, color }: any) {
  return (
    <div className="text-center space-y-1">
      <div className="flex items-center justify-center gap-1">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-bold">{value}g</div>
      <div className="text-[9px] text-gray-400 font-bold">OF {target}g</div>
    </div>
  );
}
