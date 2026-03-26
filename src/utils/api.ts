// API utilities for quiz app
import { Question } from "@/components/Quiz/QuestionCard";
import { QuizResult } from "@/components/Quiz/ResultCard";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  favoriteCategory: string;
  streak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// Mock API functions - replace with real API calls when backend is ready
export class QuizAPI {
  private static users: Map<string, User> = new Map();
  private static results: Map<string, QuizResult[]> = new Map();
  private static categories: QuizCategory[] = [
    {
      id: '1',
      name: 'Science & Nature',
      description: 'Test your knowledge of the natural world',
      icon: '🔬',
      difficulty: 'medium',
      questionCount: 10
    },
    {
      id: '2',
      name: 'History',
      description: 'Journey through time and historical events',
      icon: '📚',
      difficulty: 'hard',
      questionCount: 15
    },
    {
      id: '3',
      name: 'Technology',
      description: 'Explore the digital world and innovations',
      icon: '💻',
      difficulty: 'medium',
      questionCount: 12
    },
    {
      id: '4',
      name: 'Sports',
      description: 'Athletic achievements and sporting facts',
      icon: '⚽',
      difficulty: 'easy',
      questionCount: 8
    }
  ];

  static async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    };
    
    this.users.set(user.id, user);
    localStorage.setItem('quiz-user', JSON.stringify(user));
    return user;
  }

  static async signup(email: string, password: string, name: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString()
    };
    
    this.users.set(user.id, user);
    localStorage.setItem('quiz-user', JSON.stringify(user));
    return user;
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('quiz-user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static logout(): void {
    localStorage.removeItem('quiz-user');
  }

  static async getCategories(): Promise<QuizCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.categories;
  }

  static async saveQuizResult(result: QuizResult): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userResults = this.results.get(user.id) || [];
    userResults.push({ ...result, timestamp: Date.now() } as any);
    this.results.set(user.id, userResults);
    
    // Save to localStorage for persistence
    localStorage.setItem(`quiz-results-${user.id}`, JSON.stringify(userResults));
  }

  static async getUserStats(): Promise<UserStats> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Load from localStorage
    const resultsStr = localStorage.getItem(`quiz-results-${user.id}`);
    const results: QuizResult[] = resultsStr ? JSON.parse(resultsStr) : [];
    
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        favoriteCategory: 'None',
        streak: 0,
        achievements: []
      };
    }
    
    const totalQuizzes = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.accuracy, 0) / totalQuizzes;
    const totalTimeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0);
    
    // Find favorite category
    const categoryCount = results.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
    
    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      totalTimeSpent,
      favoriteCategory,
      streak: Math.min(totalQuizzes, 5), // Mock streak
      achievements: this.generateAchievements(results)
    };
  }

  private static generateAchievements(results: QuizResult[]): Achievement[] {
    const achievements: Achievement[] = [];
    
    if (results.length >= 1) {
      achievements.push({
        id: 'first-quiz',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: '🎯'
      });
    }
    
    if (results.some(r => r.accuracy >= 90)) {
      achievements.push({
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Score 90% or higher',
        icon: '🏆'
      });
    }
    
    if (results.length >= 10) {
      achievements.push({
        id: 'dedicated-learner',
        name: 'Dedicated Learner',
        description: 'Complete 10 quizzes',
        icon: '📚'
      });
    }
    
    return achievements;
  }
}