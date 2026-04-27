'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      disabled={pending}
      className="w-full bg-[#1e6b47] text-white font-semibold text-[15px] py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50" 
      type="submit"
    >
      {pending ? 'Creating Account...' : 'Create Account'}
    </button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar Minimal */}
      <header className="bg-surface-bright dark:bg-[#181d19] border-b border-surface-container-highest dark:border-[#3f4942] w-full top-0 z-50">
        <div className="flex items-center justify-center px-6 h-16 w-full max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim" data-icon="ecg_heart">ecg_heart</span>
            <span className="font-['Inter'] font-bold text-lg tracking-tight text-primary dark:text-primary-fixed-dim">NutriSense AI</span>
          </Link>
        </div>
      </header>
      
      {/* Main Canvas */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-[400px] z-10">
          {/* Centered Card */}
          <div className="bg-surface-container-lowest border border-[#e8e2d9] rounded-xl p-6 md:p-8 shadow-sm">
            {/* Branding inside card */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="font-semibold text-2xl text-on-surface">Create an Account</h2>
              <p className="text-sm text-on-surface-variant text-center mt-1">Start tracking your metabolic health</p>
            </div>
            
            {/* Form Fields */}
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="p-3 bg-error/10 text-error text-sm rounded-lg border border-error/20">
                  {state.error}
                </div>
              )}
              <div>
                <label className="text-xs font-bold tracking-wider text-on-surface-variant block mb-1">FULL NAME</label>
                <input 
                  name="fullName"
                  required
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-on-surface transition-all" 
                  placeholder="John Doe" 
                  type="text"
                />
              </div>
              <div>
                <label className="text-xs font-bold tracking-wider text-on-surface-variant block mb-1">EMAIL ADDRESS</label>
                <input 
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-on-surface transition-all" 
                  placeholder="name@example.com" 
                  type="email"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold tracking-wider text-on-surface-variant">PASSWORD</label>
                </div>
                <div className="relative">
                  <input 
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary outline-none text-base text-on-surface transition-all" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant" type="button">
                    <span className="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-4 pt-2">
                <SubmitButton />
                
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-outline-variant"></div>
                  <span className="flex-shrink mx-4 text-xs font-bold tracking-wider text-outline">OR</span>
                  <div className="flex-grow border-t border-outline-variant"></div>
                </div>
                
                <button className="w-full bg-white border border-[#e8e2d9] text-on-surface font-semibold text-[15px] py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all" type="button">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUl2oVUslHwlX7mheR30Y6r8HkM2fPoAn9H8NpmoWqCSwcsnpE9INW7pYp9eRkPXRambo5g2PYeZhfeccl9VNXamMwhA2A0RESORpx_xDoqGoKyTb5sPYZIu9sidgBksEb89Zkw23QdeY9ePSw35DAhWeSk-ek_08UsyBVYjFiUwkBGJMeXCDKfg3LtPLugZ2rRQsXAgV3NSnvUo7Y8W8_hIlad1CUidwlBzZPhbW1yaTlr345Wa4JaEAcOeGD9Kq_7DKuyq2s-Lw"/>
                  Sign up with Google
                </button>
              </div>
            </form>
            
            {/* Footer link inside card */}
            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                Already have an account? <Link className="text-[#e85d3a] font-semibold hover:underline" href="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative background blur elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 transform translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
      </main>
    </div>
  );
}
