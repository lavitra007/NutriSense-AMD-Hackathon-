'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const name = formData.get('name') as string;
  const age = parseInt(formData.get('age') as string);
  const weight = parseFloat(formData.get('weight') as string);
  const height = parseFloat(formData.get('height') as string);
  const sex = formData.get('sex') as string;
  const health_goal = formData.get('health_goal') as string;
  const dietary_restrictions = formData.getAll('dietary_restrictions') as string[];
  const activity_level = formData.get('activity_level') as string;

  const { error } = await supabase
    .from('profiles')
    .update({
      name,
      age,
      weight_kg: weight,
      height_cm: height,
      sex,
      health_goal,
      dietary_restrictions,
      activity_level,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }

  redirect('/dashboard');
}
