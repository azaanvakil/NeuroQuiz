import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Brain, 
  Clock, 
  Target, 
  Sparkles,
  X 
} from "lucide-react";
import { QuizCategory } from "@/utils/api";
import { toast } from "sonner";

interface CustomQuizGeneratorProps {
  onGenerateQuiz: (customCategory: QuizCategory) => void;
  onClose: () => void;
}

export const CustomQuizGenerator = ({ onGenerateQuiz, onClose }: CustomQuizGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  // Suggested topics for quick selection
  const suggestedTopics = [
    "Artificial Intelligence", "Climate Change", "Space Exploration", 
    "Modern Literature", "Cryptocurrency", "Psychology", 
    "Ancient Civilizations", "Renewable Energy", "Marine Biology",
    "Philosophy", "Art History", "Cybersecurity"
  ];

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a quiz topic");
      return;
    }

    if (questionCount < 5 || questionCount > 50) {
      toast.error("Question count must be between 5 and 50");
      return;
    }

    setIsGenerating(true);

    try {
      // Create a custom category object
      const customCategory: QuizCategory = {
        id: `custom-${Date.now()}`,
        name: topic.trim(),
        description: description.trim() || `A ${difficulty} quiz about ${topic.trim()}`,
        icon: '🧠',
        difficulty,
        questionCount
      };

      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onGenerateQuiz(customCategory);
      toast.success(`Generating custom quiz: ${topic}`);
    } catch (error) {
      toast.error("Failed to generate custom quiz");
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyDescription = (level: string) => {
    switch (level) {
      case 'easy':
        return 'Basic concepts and well-known facts';
      case 'medium':
        return 'Mix of basic and intermediate knowledge';
      case 'hard':
        return 'Deep understanding and complex scenarios';
      default:
        return '';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy':
        return 'bg-success/20 text-success border-success/40';
      case 'medium':
        return 'bg-accent/20 text-accent border-accent/40';
      case 'hard':
        return 'bg-destructive/20 text-destructive border-destructive/40';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/40';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Create Custom Quiz</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate AI-powered questions on any topic
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-3">
            <Label htmlFor="topic" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Quiz Topic
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Machine Learning, Renaissance Art, World War II..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-base"
            />
            
            {/* Suggested Topics */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-colors"
                    onClick={() => setTopic(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="description">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Provide additional context or specific focus areas for your quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Quiz Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Difficulty Level
              </Label>
              <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-success rounded-full"></span>
                      Easy
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      Hard
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getDifficultyDescription(difficulty)}
              </p>
            </div>

            {/* Question Count */}
            <div className="space-y-3">
              <Label htmlFor="questionCount" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Number of Questions
              </Label>
              <Input
                id="questionCount"
                type="number"
                min={5}
                max={50}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(5, Math.min(50, parseInt(e.target.value) || 10)))}
              />
              <p className="text-xs text-muted-foreground">
                Between 5-50 questions (≈ {Math.ceil(questionCount * 0.5)}-{questionCount} minutes)
              </p>
            </div>
          </div>

          {/* Quiz Preview */}
          {topic && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Quiz Preview</h3>
                  <Badge className={getDifficultyColor(difficulty)}>
                    {difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Topic:</strong> {topic}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Questions:</strong> {questionCount}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Estimated Time:</strong> {Math.ceil(questionCount * 0.5)}-{questionCount} minutes
                </p>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateQuiz}
              disabled={!topic.trim() || isGenerating}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};