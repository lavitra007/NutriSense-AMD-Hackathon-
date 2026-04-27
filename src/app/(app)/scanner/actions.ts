'use server';

import { analyzeFoodImage } from '@/lib/ai/gemini';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function processScannerImage(imageBase64: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    const analysis = await analyzeFoodImage(imageBase64);

    // Save to meal_logs
    const { data: mealLog, error: logError } = await supabase
      .from('meal_logs')
      .insert({
        user_id: user.id,
        food_name: analysis.food_name,
        calories: analysis.macros.calories,
        protein_g: analysis.macros.protein,
        carbs_g: analysis.macros.carbs,
        fat_g: analysis.macros.fat,
        portion_description: analysis.portion,
        meal_type: determineMealType(),
        image_url: null, // We could upload to storage here
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (logError) throw logError;

    // Save AI insight
    await supabase
      .from('ai_insights')
      .insert({
        user_id: user.id,
        meal_log_id: mealLog.id,
        insight_type: 'nutritional_advice',
        content: analysis.tip,
        score: analysis.score,
      });

    revalidatePath('/dashboard');
    return { success: true, analysis };
  } catch (error: any) {
    console.error('Error processing scan:', error);
    return { error: error.message };
  }
}

function determineMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  if (hour < 20) return 'dinner';
  return 'snack';
}
