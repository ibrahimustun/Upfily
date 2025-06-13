export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDays: number;
  createdAt: Date;
  progress: DailyProgress[];
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
}

export interface DailyProgress {
  date: string; // ISO date string
  completed: boolean;
  note?: string;
}

export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  totalDaysTracked: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}