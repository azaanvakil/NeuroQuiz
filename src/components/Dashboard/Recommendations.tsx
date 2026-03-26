import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Star,
  Clock,
  Trophy
} from "lucide-react";
import { UserStats } from "@/utils/api";
import { useEffect, useState } from "react";
import { getGeminiInstance } from "@/utils/aiHelpers";

interface RecommendationsProps {
  stats: UserStats;
  onStartQuiz?: (category: string) => void;
}

export const Recommendations = ({ stats, onStartQuiz }: RecommendationsProps) => {
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAIRecommendations();
  }, [stats]);

  const loadAIRecommendations = async () => {
    const gemini = getGeminiInstance();
    if (!gemini) return;

    setIsLoading(true);
    try {
      const recommendations = await gemini.getRecommendations(stats);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalizedRecommendations = () => {
    const recommendations = [];

    if (stats.totalQuizzes === 0) {
      recommendations.push({
        type: 'start',
        title: 'Take your first quiz!',
        description: 'Begin your learning journey by taking a quiz in your favorite subject.',
        icon: <Star className="w-5 h-5 text-accent" />,
        action: 'Start Quiz',
        category: 'Science & Nature'
      });
    }

    if (stats.averageScore < 70 && stats.totalQuizzes > 0) {
      recommendations.push({
        type: 'improve',
        title: 'Focus on fundamentals',
        description: 'Your scores suggest reviewing basic concepts before attempting harder questions.',
        icon: <BookOpen className="w-5 h-5 text-primary" />,
        action: 'Practice Easy',
        category: stats.favoriteCategory
      });
    }

    if (stats.averageScore >= 80) {
      recommendations.push({
        type: 'challenge',
        title: 'Level up your challenge!',
        description: 'You\'re doing great! Try harder difficulty levels to push your limits.',
        icon: <TrendingUp className="w-5 h-5 text-success" />,
        action: 'Try Hard Mode',
        category: stats.favoriteCategory
      });
    }

    if (stats.streak < 3) {
      recommendations.push({
        type: 'consistency',
        title: 'Build a learning streak',
        description: 'Regular practice helps improve retention and builds lasting knowledge.',
        icon: <Clock className="w-5 h-5 text-destructive" />,
        action: 'Daily Challenge',
        category: 'Technology'
      });
    }

    if (stats.totalQuizzes >= 10) {
      recommendations.push({
        type: 'explore',
        title: 'Explore new categories',
        description: 'Branch out and test your knowledge in different subject areas.',
        icon: <Target className="w-5 h-5 text-accent" />,
        action: 'Explore Topics',
        category: 'History'
      });
    }

    return recommendations;
  };

  const personalRecommendations = getPersonalizedRecommendations();

  return (
    <div className="space-y-6">
      {/* AI-Powered Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              AI Study Recommendations
              <Badge variant="secondary" className="ml-auto">Powered by Gemini</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm">Generating personalized recommendations...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personalized Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Personalized Action Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {personalRecommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border hover:bg-secondary/70 transition-colors">
              <div className="flex items-start gap-3">
                {rec.icon}
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStartQuiz?.(rec.category)}
                className="ml-4 flex-shrink-0"
              >
                {rec.action}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
            
            {stats.achievements.length === 0 && (
              <div className="md:col-span-2 text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Complete quizzes to unlock achievements!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};