import { computed, type Ref } from 'vue';
import { useLocalStorage } from './useLocalStorage';
import { format, parseISO, differenceInDays } from 'date-fns';
import type { Goal, DailyProgress, GoalStats } from '../types/Goal';

export function useGoals() {
  const [goals] = useLocalStorage<Goal[]>('uplify-goals', []);



  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      createdAt: new Date(),
      progress: [],
      isCompleted: false
    };
    
    goals.value.push(newGoal);
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    const goalIndex = goals.value.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      goals.value[goalIndex] = { ...goals.value[goalIndex], ...updates };
    }
  };

  const deleteGoal = (goalId: string) => {
    const goalIndex = goals.value.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      goals.value.splice(goalIndex, 1);
    }
  };

  const markDayComplete = (goalId: string, date: string, completed: boolean, note?: string) => {
    const goal = goals.value.find(g => g.id === goalId);
    if (!goal) return;

    const existingProgressIndex = goal.progress.findIndex(p => p.date === date);
    const progressEntry: DailyProgress = { date, completed, note };

    if (existingProgressIndex !== -1) {
      goal.progress[existingProgressIndex] = progressEntry;
    } else {
      goal.progress.push(progressEntry);
    }

    
    const completedDays = goal.progress.filter(p => p.completed).length;
    goal.isCompleted = completedDays >= goal.targetDays;
  };

  const getGoalProgress = (goalId: string) => {
    const goal = goals.value.find(g => g.id === goalId);
    if (!goal) return null;

    const completedDays = goal.progress.filter(p => p.completed).length;
    const progressPercentage = (completedDays / goal.targetDays) * 100;
    const currentStreak = calculateCurrentStreak(goal.progress);

    return {
      completedDays,
      totalDays: goal.targetDays,
      progressPercentage: Math.min(progressPercentage, 100),
      currentStreak,
      isCompletedToday: goal.progress.some(p => p.date === format(new Date(), 'yyyy-MM-dd') && p.completed)
    };
  };

  const stats = computed<GoalStats>(() => {
    const totalGoals = goals.value.length;
    const completedGoals = goals.value.filter(g => g.isCompleted).length;
    const activeGoals = totalGoals - completedGoals;
    
    const allProgress = goals.value.flatMap(g => g.progress);
    const totalDaysTracked = allProgress.filter(p => p.completed).length;
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (goals.value.length > 0) {
      const streaks = goals.value.map(g => calculateCurrentStreak(g.progress));
      currentStreak = Math.max(...streaks, 0);
      
      const allStreaks = goals.value.map(g => calculateLongestStreak(g.progress));
      longestStreak = Math.max(...allStreaks, 0);
    }
    
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      activeGoals,
      totalDaysTracked,
      currentStreak,
      longestStreak,
      completionRate
    };
  });

  return {
    goals: goals as Ref<Goal[]>,
    addGoal,
    updateGoal,
    deleteGoal,
    markDayComplete,
    getGoalProgress,
    stats
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateCurrentStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const sortedProgress = progress
    .filter(p => p.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (sortedProgress.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedProgress) {
    const entryDate = parseISO(entry.date);
    const daysDiff = differenceInDays(currentDate, entryDate);
    
    if (daysDiff === streak) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const completedDates = progress
    .filter(p => p.completed)
    .map(p => parseISO(p.date))
    .sort((a, b) => a.getTime() - b.getTime());
  
  if (completedDates.length === 0) return 0;
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < completedDates.length; i++) {
    const daysDiff = differenceInDays(completedDates[i], completedDates[i - 1]);
    
    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}