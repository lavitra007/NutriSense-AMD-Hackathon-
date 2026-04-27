'use server';

import { createClient } from '@/lib/supabase/server';
import { getChatResponse } from '@/lib/ai/gemini';
import { revalidatePath } from 'next/cache';

export async function sendChatMessage(content: string, history: any[]) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Save user message
  const { error: userMsgError } = await supabase
    .from('chat_messages')
    .insert({
      user_id: user.id,
      role: 'user',
      content: content
    });

  if (userMsgError) throw userMsgError;

  // Format history for Gemini
  const geminiHistory = history.map(m => ({
    role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
    parts: m.content
  }));

  const aiResponse = await getChatResponse(content, geminiHistory);

  // Save AI response
  const { error: aiMsgError } = await supabase
    .from('chat_messages')
    .insert({
      user_id: user.id,
      role: 'assistant',
      content: aiResponse
    });

  if (aiMsgError) throw aiMsgError;

  revalidatePath('/chat');
  return aiResponse;
}

export async function getChatHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}
