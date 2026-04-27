import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import SideNav from '@/components/SideNav';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile to check onboarding status
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single();

  const headerList = headers();
  const pathname = headerList.get('x-pathname') || '';

  if (profile && !profile.onboarding_completed && pathname !== '/onboarding') {
    redirect('/onboarding');
  }

  if (profile?.onboarding_completed && pathname === '/onboarding') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-[#f7faf5] text-[#181d19]">
      <SideNav />
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
