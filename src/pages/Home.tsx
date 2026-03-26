import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Play, 
  Zap, 
  Users, 
  Trophy, 
  Settings,
  LogOut,
  Search,
  Sparkles,
  Plus
} from "lucide-react";
import { QuizAPI, QuizCategory, User } from "@/utils/api";
import { getGeminiInstance, setGeminiApiKey } from "@/utils/aiHelpers";
import { CustomQuizGenerator } from "@/components/Quiz/CustomQuizGenerator";
import { toast } from "sonner";

interface HomeProps {
  user: User;
  onStartQuiz: (category: QuizCategory) => void;
  onLogout: () => void;
  onViewProfile: () => void;
}

export const Home = ({ user, onStartQuiz, onLogout, onViewProfile }: HomeProps) => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCustomQuizGenerator, setShowCustomQuizGenerator] = useState(false);

  useEffect(() => {
    loadCategories();
    checkGeminiApiKey();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await QuizAPI.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load quiz categories");
    } finally {
      setIsLoading(false);
    }
  };

  const checkGeminiApiKey = () => {
    const gemini = getGeminiInstance();
    if (!gemini) {
      setShowApiKeyInput(true);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setGeminiApiKey(apiKey);
    setShowApiKeyInput(false);
    toast.success("Gemini API key saved! AI features are now available.");
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/20 text-success border-success/40';
      case 'medium': return 'bg-accent/20 text-accent border-accent/40';
      case 'hard': return 'bg-destructive/20 text-destructive border-destructive/40';
      default: return 'bg-muted/20 text-muted-foreground border-muted/40';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">QuizMaster</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-foreground hidden sm:inline">
                Welcome, {user.name}!
              </span>
              <Button variant="ghost" size="sm" onClick={onViewProfile}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Setup */}
        {showApiKeyInput && (
          <Card className="mb-8 border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Enable AI-Powered Quizzes
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your Gemini API key to unlock AI-generated quizzes and personalized recommendations.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey}>
                  Save Key
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Challenge Your Mind with 
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"> AI-Powered</span> Quizzes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Test your knowledge, track your progress, and learn with intelligent recommendations powered by cutting-edge AI.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">5K+</div>
                <div className="text-sm text-muted-foreground">Learners</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search quiz categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </section>

        {/* Custom Quiz Generator */}
        <section className="mb-8">
          <Card 
            className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/10"
            onClick={() => setShowCustomQuizGenerator(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      Create Custom Quiz
                    </h3>
                    <p className="text-muted-foreground">
                      Generate AI-powered questions on any topic you choose
                    </p>
                  </div>
                </div>
                <Button 
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCustomQuizGenerator(true);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quiz Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Preset Categories</h2>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {filteredCategories.length} Categories
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {category.questionCount} questions
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => onStartQuiz(category)}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary-glow/5">
              <Zap className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-2">Quick Challenge</h3>
              <p className="text-sm text-muted-foreground mb-4">Take a random 5-question quiz</p>
              <Button variant="outline" size="sm">
                Quick Start
              </Button>
            </Card>

            <Card className="text-center p-6 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-success" />
              <h3 className="font-semibold text-foreground mb-2">Leaderboard</h3>
              <p className="text-sm text-muted-foreground mb-4">See how you rank globally</p>
              <Button variant="outline" size="sm">
                View Rankings
              </Button>
            </Card>

            <Card className="text-center p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <Brain className="w-12 h-12 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-foreground mb-2">AI Tutor</h3>
              <p className="text-sm text-muted-foreground mb-4">Get personalized learning paths</p>
              <Button variant="outline" size="sm">
                Start Learning
              </Button>
            </Card>
          </div>
        </section>
      </main>

      {/* Custom Quiz Generator Modal */}
      {showCustomQuizGenerator && (
        <CustomQuizGenerator
          onGenerateQuiz={(customCategory) => {
            setShowCustomQuizGenerator(false);
            onStartQuiz(customCategory);
          }}
          onClose={() => setShowCustomQuizGenerator(false)}
        />
      )}
    </div>
  );
};