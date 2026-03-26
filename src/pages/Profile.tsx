import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PerformanceChart } from "@/components/Dashboard/PerformanceChart";
import { Recommendations } from "@/components/Dashboard/Recommendations";
import { 
  ArrowLeft, 
  User, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Calendar,
  Award,
  Settings
} from "lucide-react";
import { User as UserType, QuizAPI, UserStats } from "@/utils/api";
import { toast } from "sonner";

interface ProfileProps {
  user: UserType;
  onGoHome: () => void;
  onStartQuiz?: (category: string) => void;
}

export const Profile = ({ user, onGoHome, onStartQuiz }: ProfileProps) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const userStats = await QuizAPI.getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load Profile</h2>
          <p className="text-muted-foreground mb-4">There was an error loading your profile data.</p>
          <Button onClick={onGoHome}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onGoHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Profile & Analytics</h1>
            </div>
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatJoinDate(user.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {stats.totalQuizzes} quizzes completed
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {stats.averageScore}% average score
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  Level {Math.floor(stats.totalQuizzes / 5) + 1}
                </Badge>
                <Badge variant="outline">
                  🔥 {stats.streak} day streak
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {stats.totalQuizzes > 0 ? (
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-400">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-6">
              <PerformanceChart stats={stats} />
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <Recommendations stats={stats} onStartQuiz={onStartQuiz} />
            </TabsContent>
          </Tabs>
        ) : (
          // First-time user experience
          <div className="text-center py-16">
            <Card className="max-w-2xl mx-auto p-8">
              <div className="mb-8">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to QuizMaster!</h2>
                <p className="text-muted-foreground">
                  You haven't taken any quizzes yet. Start your learning journey and track your progress here.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <h3 className="font-semibold text-foreground">Earn Achievements</h3>
                  <p className="text-sm text-muted-foreground">Unlock badges as you learn</p>
                </div>
                
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
                  <h3 className="font-semibold text-foreground">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">See your improvement over time</p>
                </div>
                
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-foreground">Get Recommendations</h3>
                  <p className="text-sm text-muted-foreground">AI-powered learning suggestions</p>
                </div>
              </div>
              
              <Button 
                onClick={onGoHome}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg"
              >
                Take Your First Quiz
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};