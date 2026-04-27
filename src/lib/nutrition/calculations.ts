export interface NutritionData {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
}

export function calculateMacros(weight: number, height: number, age: number, sex: string, activityLevel: string, goal: string): NutritionData {
  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (sex === 'male') {
    bmr += 5;
  } else if (sex === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78; // Average for 'other'
  }

  // Total Daily Energy Expenditure (TDEE)
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Adjust for health goals
  let targetCalories = tdee;
  if (goal === 'lose_weight') {
    targetCalories -= 500; // 0.5kg/week loss
  } else if (goal === 'build_muscle') {
    targetCalories += 300; // Lean bulk
  }

  // Macro split (Protein: 30%, Carbs: 40%, Fat: 30%)
  const protein_g = (targetCalories * 0.3) / 4;
  const carbs_g = (targetCalories * 0.4) / 4;
  const fat_g = (targetCalories * 0.3) / 9;

  return {
    calories: Math.round(targetCalories),
    protein_g: Math.round(protein_g),
    carbs_g: Math.round(carbs_g),
    fat_g: Math.round(fat_g),
  };
}

export function formatNutrient(value: number | undefined): string {
  if (value === undefined) return '0';
  return Math.round(value).toString();
}
