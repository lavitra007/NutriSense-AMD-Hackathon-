import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background text-on-background font-body-base antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      {/* TopNavBar (Shared Component) */}
      <nav className="fixed top-0 w-full z-50 border-b border-surface-container-highest bg-surface/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-7xl mx-auto">
          {/* Brand */}
          <Link className="text-2xl font-black text-primary-container tracking-tight" href="/">
            NutriSense AI
          </Link>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link className="font-body-base text-body-base text-on-surface-variant hover:text-primary-container transition-colors" href="#">
              How it works
            </Link>
            <Link className="font-body-base text-body-base text-on-surface-variant hover:text-primary-container transition-colors" href="#">
              Features
            </Link>
            <Link className="font-body-base text-body-base text-on-surface-variant hover:text-primary-container transition-colors" href="#">
              Pricing
            </Link>
            <Link className="font-body-base text-body-base text-on-surface-variant hover:text-primary-container transition-colors" href="#">
              About
            </Link>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link className="hidden md:block font-button text-button text-on-surface-variant hover:text-primary-container transition-colors" href="/login">
              Login
            </Link>
            <Link href="/dashboard" className="bg-secondary-container text-on-secondary-container font-button text-button px-6 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all">
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center gap-16">
          {/* Hero Text */}
          <div className="flex-1 space-y-8">
            <h1 className="font-display-lg text-[56px] leading-[64px] font-bold text-on-background tracking-tight">
              Your personal nutritionist.<br />Available every meal.
            </h1>
            <p className="font-body-base text-[20px] leading-8 text-on-surface-variant max-w-xl">
              AI-powered food intelligence built for how Indians actually eat. Scan, log, and understand your nutrition in seconds.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/dashboard" className="bg-primary-container text-on-primary font-button text-button px-8 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm inline-block">
                Get started free
              </Link>
              <button className="bg-transparent border border-outline text-on-surface font-button text-button px-8 py-3 rounded-lg hover:bg-surface-container-low active:scale-95 transition-all">
                See how it works
              </button>
            </div>
          </div>
          {/* Hero Visual (Split Mockup) */}
          <div className="flex-1 w-full relative">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-surface-container-highest bg-surface-container-lowest shadow-sm flex">
              {/* Left: Scanner */}
              <div className="w-1/2 h-full border-r border-surface-container-highest relative bg-surface">
                <Image
                  alt="Bowl of Dal Makhani"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5BKrVM82Wd9mCLuWmsLPsVsuCk0_h_MgF1kHXNx05ZbWxMnqcsSfp95inyRFVm27JLHG7cA37peop_3ev76fuws8vB331ITMJISCsejgHCZY8tX8jebiX3qjcpLDaCTghF2w72T_eYSvr39uAWFNifitdfcfy5z0UG3t99ghF6EQngKxUN78nnqhTIBz5yHW_I9r09DaR20GUP7zykVxnfk4C62GZ1_yZ_HUvZbYd_tmWxq4cg0nuFIKGBNSSSXxi1ho3rCfn0bQ"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 border-4 border-primary/30 m-4 rounded-lg flex flex-col justify-between p-4">
                  <div className="self-end bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full border border-surface-container-highest shadow-sm">
                    <span className="font-label-caps text-label-caps text-primary-container">SCANNING...</span>
                  </div>
                  <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-lg border-l-2 border-primary-container shadow-sm">
                    <p className="font-title-sm text-title-sm text-on-surface">Dal Makhani</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Est. 1 bowl (150g)</p>
                  </div>
                </div>
              </div>
              {/* Right: Dashboard */}
              <div className="w-1/2 h-full p-6 bg-surface-container-lowest flex flex-col justify-center gap-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">TODAY&apos;S SUMMARY</span>
                  <span className="material-symbols-outlined text-outline text-[20px]">more_horiz</span>
                </div>
                {/* Circular Progress Mockup */}
                <div className="relative w-32 h-32 mx-auto rounded-full border-8 border-surface-container flex items-center justify-center">
                  {/* Simulated stroke */}
                  <div className="absolute inset-[-8px] rounded-full border-8 border-primary-container" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 70%)" }}></div>
                  <div className="text-center">
                    <p className="font-title-sm text-[24px] leading-tight font-bold text-on-surface">1,450</p>
                    <p className="font-label-caps text-[10px] text-on-surface-variant">KCAL</p>
                  </div>
                </div>
                {/* Macro Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-label-caps text-[10px] mb-1">
                      <span className="text-on-surface">PROTEIN</span>
                      <span className="text-on-surface-variant">45g / 80g</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-container w-[55%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-label-caps text-[10px] mb-1">
                      <span className="text-on-surface">CARBS</span>
                      <span className="text-on-surface-variant">120g / 200g</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container w-[60%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-y border-surface-container-highest bg-surface-container-low py-4">
          <div className="max-w-7xl mx-auto px-8 flex justify-center items-center gap-8 text-center flex-wrap">
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">psychology</span> Powered by Gemini AI
            </span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">database</span> 500+ Indian foods in database
            </span>
            <span className="text-outline-variant hidden md:inline">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span> Free to use
            </span>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Smarter nutrition, simplified.</h2>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl mx-auto">Everything you need to understand your diet, without the guesswork.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-6 border-l-2 border-l-primary-container hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant">photo_camera</span>
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface mb-3">Scan any food</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Instantly recognize 500+ Indian dishes and get accurate macro estimates.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-6 border-l-2 border-l-secondary-container hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface mb-3">AI meal planning</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Personalized weekly plans that adapt to your preferences and calorie goals.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-[12px] p-6 border-l-2 border-l-primary-container hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant">bar_chart</span>
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface mb-3">Track macros intelligently</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Deep visibility into your P/C/F ratios and how they impact your health.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="max-w-4xl mx-auto px-8 pb-24 text-center">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-8 uppercase tracking-widest">Join 12,000+ people eating smarter</h3>
          <div className="grid grid-cols-3 gap-4 border-t border-b border-surface-container-highest py-8 bg-surface-container-lowest rounded-xl">
            <div>
              <p className="font-display-lg text-display-lg text-primary-container">1.2M+</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Meals Scanned</p>
            </div>
            <div className="border-l border-r border-surface-container-highest">
              <p className="font-display-lg text-display-lg text-secondary-container">500+</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Indian Dishes</p>
            </div>
            <div>
              <p className="font-display-lg text-display-lg text-primary-container">98%</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Accuracy</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Shared Component) */}
      <footer className="w-full border-t border-surface-container-highest bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 w-full max-w-7xl mx-auto">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <p className="font-bold text-primary-container mb-2 text-lg">NutriSense AI</p>
            <p className="font-body-sm text-xs text-on-surface-variant">© 2024 NutriSense AI. Premium Nutrition for Urban India.</p>
          </div>
          <div className="flex gap-6">
            <Link className="font-body-sm text-xs text-on-surface-variant hover:text-primary-container transition-colors" href="#">Privacy Policy</Link>
            <Link className="font-body-sm text-xs text-on-surface-variant hover:text-primary-container transition-colors" href="#">Terms of Service</Link>
            <Link className="font-body-sm text-xs text-on-surface-variant hover:text-primary-container transition-colors" href="#">Contact Us</Link>
            <Link className="font-body-sm text-xs text-on-surface-variant hover:text-primary-container transition-colors" href="#">Careers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
