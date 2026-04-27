'use client';

import { useState, useEffect } from 'react';
import { getMealPlan, regenerateMealPlan } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function MealPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const data = await getMealPlan();
        setPlan(data);
        // Default select the first meal of the first day
        if (data?.days?.[0]?.meals?.[0]) {
          setSelectedMeal(data.days[0].meals[0]);
        }
      } catch (error) {
        console.error('Failed to fetch plan:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const data = await regenerateMealPlan();
      setPlan(data);
      if (data?.days?.[0]?.meals?.[0]) {
        setSelectedMeal(data.days[0].meals[0]);
      }
    } catch (error) {
      console.error('Failed to regenerate plan:', error);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f7faf5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1E6B47] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#1E6B47] font-medium">Curating your personalized plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f7faf5] h-full overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-[#e0e3de] bg-white">
        <div>
          <h1 className="text-2xl font-bold text-[#181d19]">Your 7-day meal plan</h1>
          <p className="text-sm text-[#3f4942]">Based on your health goals and preferences</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-2 rounded-lg border border-[#ff6e49] text-[#ad3313] font-semibold text-sm hover:bg-[#f1f5ef] transition-colors disabled:opacity-50"
          >
            {regenerating ? 'Regenerating...' : 'Regenerate plan'}
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#1E6B47] text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export grocery list
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex-shrink-0 flex gap-2 py-3 px-6 overflow-x-auto no-scrollbar border-b border-[#e0e3de] bg-[#f7faf5]">
        {['My goals', 'Budget-friendly', 'Under 30 min', 'Vegetarian', 'High protein'].map((filter, i) => (
          <button 
            key={filter}
            className={`px-4 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
              i === 0 ? 'bg-[#1E6B47] text-white' : 'bg-[#ecefe9] text-[#3f4942] hover:bg-[#e0e3de]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Grid Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[800px] flex flex-col gap-4">
            {/* Days Header */}
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 mb-2">
              <div></div>
              {plan?.days?.map((day: any) => (
                <div key={day.day} className="text-center text-xs font-bold uppercase tracking-wider text-[#707a71]">
                  {day.day}
                </div>
              ))}
            </div>

            {/* Row: Breakfast */}
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 items-stretch">
              <div className="flex items-center justify-center text-xs font-bold uppercase tracking-wider text-[#707a71] bg-[#f1f5ef] rounded-xl">
                Breakfast
              </div>
              {plan?.days?.map((day: any) => {
                const meal = day.meals.find((m: any) => m.type === 'Breakfast');
                const isSelected = selectedMeal?.name === meal?.name && selectedMeal?.type === 'Breakfast';
                return (
                  <div 
                    key={`${day.day}-breakfast`}
                    onClick={() => setSelectedMeal(meal)}
                    className={`bg-white border rounded-xl p-4 flex flex-col gap-2 hover:shadow-md cursor-pointer transition-all ${
                      isSelected ? 'border-[#1E6B47] ring-1 ring-[#1E6B47]' : 'border-[#e0e3de]'
                    }`}
                  >
                    <h3 className="text-sm font-bold text-[#181d19] line-clamp-2 leading-tight">{meal?.name}</h3>
                    <div className="flex justify-between items-end mt-auto pt-2">
                      <span className="text-xs text-[#707a71]">{meal?.macros?.calories} kcal</span>
                      <span className="px-1.5 py-0.5 bg-[#ecefe9] rounded-full text-[10px] font-bold text-[#3f4942]">
                        {meal?.prep_time}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Row: Lunch */}
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4 items-stretch">
              <div className="flex items-center justify-center text-xs font-bold uppercase tracking-wider text-[#707a71] bg-[#f1f5ef] rounded-xl">
                Lunch
              </div>
              {plan?.days?.map((day: any) => {
                const meal = day.meals.find((m: any) => m.type === 'Lunch');
                const isSelected = selectedMeal?.name === meal?.name && selectedMeal?.type === 'Lunch';
                return (
                  <div 
                    key={`${day.day}-lunch`}
                    onClick={() => setSelectedMeal(meal)}
                    className={`bg-white border rounded-xl p-4 flex flex-col gap-2 hover:shadow-md cursor-pointer transition-all ${
                      isSelected ? 'border-[#1E6B47] ring-1 ring-[#1E6B47]' : 'border-[#e0e3de]'
                    }`}
                  >
                    <h3 className="text-sm font-bold text-[#181d19] line-clamp-2 leading-tight">{meal?.name}</h3>
                    <div className="flex justify-between items-end mt-auto pt-2">
                      <span className="text-xs text-[#707a71]">{meal?.macros?.calories} kcal</span>
                      <span className="px-1.5 py-0.5 bg-[#ecefe9] rounded-full text-[10px] font-bold text-[#3f4942]">
                        {meal?.prep_time}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recipe Side Panel */}
        <AnimatePresence mode="wait">
          {selectedMeal && (
            <motion.aside 
              key={selectedMeal.name}
              initial={{ x: 380 }}
              animate={{ x: 0 }}
              exit={{ x: 380 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[380px] flex-shrink-0 bg-white border-l border-[#e0e3de] flex flex-col shadow-xl z-20"
            >
              {/* Hero Image - Placeholder for now or I could generate one if I had a tool for specific meal images */}
              <div className="relative h-48 bg-[#ecefe9] w-full">
                <div className="w-full h-full flex items-center justify-center text-[#707a71]">
                  <span className="material-symbols-outlined text-4xl">restaurant</span>
                </div>
                <button 
                  onClick={() => setSelectedMeal(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors text-[#181d19]"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#f1f5ef] rounded text-[10px] font-bold text-[#707a71] uppercase">
                      {selectedMeal.type}
                    </span>
                    <span className="px-2 py-0.5 bg-[#f1f5ef] rounded text-[10px] font-bold text-[#707a71] uppercase">
                      {selectedMeal.prep_time} MIN
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#181d19] leading-tight mb-2">{selectedMeal.name}</h2>
                  <p className="text-sm text-[#3f4942]">{selectedMeal.description}</p>
                </div>

                {/* Macro Bento */}
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[
                    { label: 'CALS', value: selectedMeal.macros.calories, unit: '' },
                    { label: 'PRO', value: selectedMeal.macros.protein, unit: 'g', color: 'text-[#ad3313]' },
                    { label: 'CARB', value: selectedMeal.macros.carbs, unit: 'g' },
                    { label: 'FAT', value: selectedMeal.macros.fat, unit: 'g' },
                  ].map((macro) => (
                    <div key={macro.label} className="bg-[#f7faf5] p-3 rounded-lg border border-[#e0e3de] flex flex-col items-center justify-center gap-1">
                      <span className="text-[10px] font-bold text-[#707a71]">{macro.label}</span>
                      <span className={`text-sm font-bold ${macro.color || 'text-[#181d19]'}`}>
                        {macro.value}{macro.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Benefit */}
                <div className="mb-8 p-4 bg-[#a7f3c5]/20 border border-[#a7f3c5] rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#1E6B47]">verified_user</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#002111]">Why it works</h4>
                    <p className="text-xs text-[#005232]">{selectedMeal.benefit}</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-[#181d19] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1E6B47]">shopping_basket</span>
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedMeal.ingredients.map((ing: string, i: number) => (
                      <li key={i} className="flex justify-between items-center py-2 border-b border-[#e0e3de]/50">
                        <span className="text-sm text-[#3f4942]">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-sm font-bold text-[#181d19] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ad3313]">restaurant</span>
                    Instructions
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-[0.5px] bg-[#e0e3de]"></div>
                    {selectedMeal.instructions.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1E6B47] text-[#1E6B47] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-[#3f4942] pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
