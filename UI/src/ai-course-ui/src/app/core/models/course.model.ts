export interface Course {
  id: number;
  title: string;
  description: string;
  provider: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  rating: number;
  enrolledCount: number;
  thumbnailUrl?: string;
  tags: string[];
  skills: string[];
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  targetRole: string;
  totalHours: number;
  completionPercent: number;
  courses: LearningPathCourse[];
}

export interface LearningPathCourse {
  course: Course;
  order: number;
  status: 'not-started' | 'in-progress' | 'completed';
  completedDate?: string;
}

export interface Progress {
  userId: number;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalHoursLearned: number;
  currentStreak: number;
  weeklyActivity: WeeklyActivity[];
  recentActivity: ActivityItem[];
}

export interface WeeklyActivity {
  day: string;
  hours: number;
}

export interface ActivityItem {
  date: string;
  description: string;
  type: 'completed' | 'started' | 'achievement';
}
