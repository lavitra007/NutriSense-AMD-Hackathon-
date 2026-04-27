'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Weight, 
  Dumbbell, 
  Activity, 
  Zap, 
  Leaf, 
  CheckCircle2, 
  User, 
  Scale, 
  Ruler,
  AlertCircle
} from 'lucide-react';
import { updateProfile } from './actions';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 1, title: 'Health Goal', description: 'What\'s your primary focus?' },
  { id: 2, title: 'Personal Info', description: 'Tell us a bit about yourself' },
  { id: 3, title: 'Physical Stats', description: 'Your current metrics' },
  { id: 4, title: 'Dietary Preferences', description: 'Any restrictions?' },
  { id: 5, title: 'Review', description: 'Confirm your details' },
];

const HEALTH_GOALS = [
  { id: 'lose_weight', label: 'Lose weight', icon: Weight },
  { id: 'build_muscle', label: 'Build muscle', icon: Dumbbell },
  { id: 'manage_diabetes', label: 'Manage diabetes', icon: Activity },
  { id: 'improve_energy', label: 'Improve energy', icon: Zap },
  { id: 'eat_cleaner', label: 'Eat cleaner', icon: Leaf },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Lightly Active', description: '1-3 days/week' },
  { id: 'moderate', label: 'Moderately Active', description: '3-5 days/week' },
  { id: 'very', label: 'Very Active', description: '6-7 days/week' },
  { id: 'extra', label: 'Extra Active', description: 'Professional athlete' },
];

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Nut-Free'
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'other',
    weight: '',
    height: '',
    health_goal: 'lose_weight',
    dietary_restrictions: [] as string[],
    activity_level: 'moderate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleGoalSelect = (goalId: string) => {
    setFormData({ ...formData, health_goal: goalId });
  };

  const handleDietaryToggle = (restriction: string) => {
    const current = formData.dietary_restrictions;
    const updated = current.includes(restriction)
      ? current.filter((r) => r !== restriction)
      : [...current, restriction];
    setFormData({ ...formData, dietary_restrictions: updated });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value.toString());
        }
      });
      
      const result = await updateProfile(data);
      if (result?.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#f7faf5] text-[#181d19] flex flex-col font-sans">
      <header className="w-full flex justify-between items-center py-4 px-6 border-b border-[#e0e3de] bg-white">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#005232] text-2xl">NutriSense AI</span>
        </div>
        <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Skip
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-[680px] mx-auto">
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Step {step} of {STEPS.length}
            </span>
            <span className="text-xs font-bold text-[#005232]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#e0e3de] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#1e6b47] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="bg-white border border-[#e0e3de] rounded-2xl shadow-sm w-full p-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {STEPS[step - 1].title}
                </h1>
                <p className="text-gray-500">
                  {STEPS[step - 1].description}
                </p>
              </div>

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {HEALTH_GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 group relative ${
                        formData.health_goal === goal.id
                          ? 'border-[#1e6b47] bg-[#f1f5ef]'
                          : 'border-[#e0e3de] hover:border-gray-400 bg-white'
                      }`}
                    >
                      <goal.icon className={`w-10 h-10 mb-3 ${
                        formData.health_goal === goal.id ? 'text-[#1e6b47]' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      <span className="font-semibold">{goal.label}</span>
                      {formData.health_goal === goal.id && (
                        <div className="absolute top-3 right-3 text-[#1e6b47]">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border border-[#e0e3de] rounded-xl focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full p-3 border border-[#e0e3de] rounded-xl focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none transition-all"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                      <select
                        value={formData.sex}
                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                        className="w-full p-3 border border-[#e0e3de] rounded-xl focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none transition-all appearance-none bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full p-3 border border-[#e0e3de] rounded-xl focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none transition-all"
                        placeholder="70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full p-3 border border-[#e0e3de] rounded-xl focus:ring-2 focus:ring-[#1e6b47] focus:border-transparent outline-none transition-all"
                        placeholder="175"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <div className="space-y-2">
                      {ACTIVITY_LEVELS.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => setFormData({ ...formData, activity_level: level.id })}
                          className={`w-full text-left p-4 border rounded-xl transition-all duration-200 ${
                            formData.activity_level === level.id
                              ? 'border-[#1e6b47] bg-[#f1f5ef]'
                              : 'border-[#e0e3de] hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="font-semibold">{level.label}</div>
                          <div className="text-xs text-gray-500">{level.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid grid-cols-2 gap-3">
                  {DIETARY_RESTRICTIONS.map((restriction) => (
                    <button
                      key={restriction}
                      onClick={() => handleDietaryToggle(restriction)}
                      className={`p-3 text-sm border rounded-xl transition-all duration-200 ${
                        formData.dietary_restrictions.includes(restriction)
                          ? 'border-[#1e6b47] bg-[#f1f5ef] text-[#1e6b47] font-semibold'
                          : 'border-[#e0e3de] hover:border-gray-400 bg-white text-gray-700'
                      }`}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="bg-[#f1f5ef] p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between border-b border-[#e0e3de] pb-2">
                      <span className="text-gray-500">Goal</span>
                      <span className="font-semibold capitalize">{formData.health_goal.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#e0e3de] pb-2">
                      <span className="text-gray-500">Name</span>
                      <span className="font-semibold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#e0e3de] pb-2">
                      <span className="text-gray-500">Age / Sex</span>
                      <span className="font-semibold capitalize">{formData.age} / {formData.sex}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#e0e3de] pb-2">
                      <span className="text-gray-500">Weight / Height</span>
                      <span className="font-semibold">{formData.weight}kg / {formData.height}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Restrictions</span>
                      <span className="font-semibold">
                        {formData.dietary_restrictions.length > 0 
                          ? formData.dietary_restrictions.join(', ') 
                          : 'None'}
                      </span>
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-4 pt-6 border-t border-[#e0e3de]">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className="text-gray-500 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {step < STEPS.length ? (
              <Button
                onClick={nextStep}
                className="bg-[#ff6e49] hover:bg-[#e85d3a] text-white px-8 py-6 rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#1e6b47] hover:bg-[#005232] text-white px-8 py-6 rounded-xl"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile'}
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
