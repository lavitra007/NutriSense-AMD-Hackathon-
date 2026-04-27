'use server';

import { createClient } from '@/lib/supabase/server';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

export async function getWeeklyStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: logs, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  if (error) throw error;

  // Process data for charts
  const days = eachDayOfInterval({ start, end });
  const chartData = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayLogs = logs?.filter(log => log.created_at.startsWith(dayStr)) || [];
    
    return {
      day: format(day, 'EEE'),
      calories: dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
      protein: dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0),
      carbs: dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0),
      fat: dayLogs.reduce((sum, log) => sum + (log.fat || 0), 0),
    };
  });

  // Calculate summary stats
  const totalCals = chartData.reduce((sum, d) => sum + d.calories, 0);
  const avgCals = Math.round(totalCals / 7);
  
  // Find "worst" meal (highest calorie)
  const worstMeal = logs?.reduce((prev, current) => (prev.calories > current.calories) ? prev : current, { calories: 0 });

  return {
    chartData,
    avgCals,
    worstMeal: worstMeal?.food_name ? worstMeal : null,
    proteinGoalDays: chartData.filter(d => d.protein >= 100).length, // Mock logic for goal
  };
}
