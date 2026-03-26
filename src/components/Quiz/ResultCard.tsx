import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Clock, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  accuracy: number;
  category: string;
}

interface ResultCardProps {
  result: QuizResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const ResultCard = ({ result, onPlayAgain, onGoHome }: ResultCardProps) => {
  const { score, totalQuestions, correctAnswers, timeSpent, accuracy, category } = result;
  
  const getGrade = () => {
    if (accuracy >= 90) return { grade: "A+", color: "success", message: "Outstanding!" };
    if (accuracy >= 80) return { grade: "A", color: "success", message: "Excellent!" };
    if (accuracy >= 70) return { grade: "B", color: "primary", message: "Good Job!" };
    if (accuracy >= 60) return { grade: "C", color: "accent", message: "Not Bad!" };
    return { grade: "D", color: "destructive", message: "Keep Practicing!" };
  };

  const gradeInfo = getGrade();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreAnimation = () => {
    if (accuracy >= 80) return "animate-bounce";
    if (accuracy >= 60) return "animate-pulse";
    return "";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className={cn("mx-auto mb-4", getScoreAnimation())}>
          <Trophy className={cn(
            "w-16 h-16 mx-auto mb-2",
            accuracy >= 80 ? "text-success" : accuracy >= 60 ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Quiz Complete!</CardTitle>
        <p className="text-muted-foreground">Category: {category}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground mb-4">
            <span className="text-2xl font-bold">{Math.round(accuracy)}%</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-lg px-4 py-2 font-bold",
              gradeInfo.color === "success" && "border-success text-success",
              gradeInfo.color === "primary" && "border-primary text-primary",
              gradeInfo.color === "accent" && "border-accent text-accent",
              gradeInfo.color === "destructive" && "border-destructive text-destructive"
            )}
          >
            Grade: {gradeInfo.grade}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">{gradeInfo.message}</p>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{correctAnswers}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </div>
          
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground">?</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          
          <div className="text-center p-4 bg-secondary rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{formatTime(timeSpent)}</p>
            <p className="text-xs text-muted-foreground">Time</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Accuracy</span>
            <span className="text-sm font-bold text-primary">{accuracy}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div 
              className="h-3 bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button 
            onClick={onGoHome}
            variant="outline"
            className="flex-1"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};