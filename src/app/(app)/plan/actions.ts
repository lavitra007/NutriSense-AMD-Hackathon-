'use server';
import { createClient } from '@/lib/supabase/server';
import { generateWeeklyMealPlan } from '@/lib/ai/gemini';
import { revalidatePath } from 'next/cache';

export async function getMealPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Check if there is an active meal plan
  const { data: existingPlan, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (existingPlan && existingPlan.plan_json) {
    return existingPlan.plan_json;
  }

  // If no plan, generate one
  return await regenerateMealPlan();
}

export async function regenerateMealPlan() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    // Generate new plan using AI
    const plan = await generateWeeklyMealPlan(profile);
    
    if (!plan || !plan.days) {
      throw new Error('AI returned invalid plan structure');
    }

    // Deactivate old plans
    await supabase
      .from('meal_plans')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Insert new plan
    const { error: insertError } = await supabase
      .from('meal_plans')
      .insert({
        user_id: user.id,
        plan_json: plan,
        is_active: true,
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

    if (insertError) {
      console.error('Failed to insert meal plan:', insertError);
      throw new Error('Failed to save meal plan');
    }

    revalidatePath('/plan');
    return plan;
  } catch (err: any) {
    console.error('Meal plan error:', err);
    throw new Error(err.message || 'Failed to generate meal plan');
  }
}
