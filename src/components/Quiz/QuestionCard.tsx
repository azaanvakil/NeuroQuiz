import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  isAnswered: boolean;
  showResult?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswered,
  showResult = false,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) => {
  const getOptionStyles = (index: number) => {
    if (!showResult && !isAnswered) {
      return selectedAnswer === index 
        ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg scale-[1.02] border-primary" 
        : "bg-card hover:bg-secondary/50 hover:scale-[1.01] border-border";
    }

    if (showResult) {
      const isCorrect = index === question.correctAnswer;
      const isSelected = index === selectedAnswer;
      
      if (isCorrect) {
        return "bg-gradient-to-r from-success to-success text-success-foreground shadow-lg border-success";
      }
      if (isSelected && !isCorrect) {
        return "bg-gradient-to-r from-destructive to-destructive text-destructive-foreground shadow-lg border-destructive";
      }
      return "bg-muted text-muted-foreground border-border opacity-60";
    }

    return "bg-card border-border";
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;
    
    const isCorrect = index === question.correctAnswer;
    const isSelected = index === selectedAnswer;
    
    if (isCorrect) {
      return <CheckCircle className="w-5 h-5" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border shadow-lg">
      <CardContent className="p-8">
        <div className="mb-6">
      <div className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="text-sm text-muted-foreground">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => !isAnswered && onAnswerSelect(index)}
              disabled={isAnswered}
              className={cn(
                "w-full p-4 h-auto text-left justify-between transition-all duration-200",
                getOptionStyles(index)
              )}
            >
              <span className="text-base font-medium">{option}</span>
              {getOptionIcon(index)}
            </Button>
          ))}
        </div>

        {showResult && question.explanation && (
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Explanation:</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};