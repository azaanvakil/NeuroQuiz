import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuestionCard, Question } from "@/components/Quiz/QuestionCard";
import { Timer } from "@/components/Quiz/Timer";
import { ResultCard, QuizResult } from "@/components/Quiz/ResultCard";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { QuizCategory, QuizAPI } from "@/utils/api";
import { getGeminiInstance } from "@/utils/aiHelpers";
import { toast } from "sonner";

interface QuizPageProps {
  category: QuizCategory;
  onGoHome: () => void;
  onViewProfile: () => void;
}

type QuizState = 'loading' | 'ready' | 'active' | 'paused' | 'completed';

export const QuizPage = ({ category, onGoHome }: QuizPageProps) => {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  const questionTimeLimit = 30; // seconds per question
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    loadQuestions();
  }, [category]);

  const loadQuestions = async () => {
    setQuizState('loading');
    
    try {
      const gemini = getGeminiInstance();
      
      if (gemini) {
        // Generate questions using AI
        const aiQuestions = await gemini.generateQuiz({
          topic: category.name,
          difficulty: category.difficulty,
          questionCount: category.questionCount
        });
        setQuestions(aiQuestions);
      } else {
        // Fallback to sample questions
        const fallbackQuestions = generateFallbackQuestions(category);
        setQuestions(fallbackQuestions);
        toast.info("Using sample questions. Add your Gemini API key for AI-generated content!");
      }
      
      setSelectedAnswers(new Array(category.questionCount).fill(null));
      setTimeRemaining(questionTimeLimit);
      setQuizState('ready');
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error("Failed to load quiz questions");
      onGoHome();
    }
  };

  const generateFallbackQuestions = (category: QuizCategory): Question[] => {
    const sampleQuestions: Record<string, Question[]> = {
      'Science & Nature': [
        {
          id: '1',
          question: 'What is the chemical symbol for water?',
          options: ['H2O', 'CO2', 'NaCl', 'O2'],
          correctAnswer: 0,
          explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.'
        },
        {
          id: '2',
          question: 'Which planet is closest to the Sun?',
          options: ['Venus', 'Earth', 'Mercury', 'Mars'],
          correctAnswer: 2,
          explanation: 'Mercury is the innermost planet in our solar system.'
        }
      ],
      'History': [
        {
          id: '1',
          question: 'In which year did the Berlin Wall fall?',
          options: ['1987', '1989', '1991', '1993'],
          correctAnswer: 1,
          explanation: 'The Berlin Wall fell on November 9, 1989.'
        }
      ],
      'Technology': [
        {
          id: '1',
          question: 'Who founded Microsoft?',
          options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'],
          correctAnswer: 1,
          explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975.'
        }
      ],
      'Sports': [
        {
          id: '1',
          question: 'How many players are on a soccer team on the field at one time?',
          options: ['9', '10', '11', '12'],
          correctAnswer: 2,
          explanation: 'Each soccer team has 11 players on the field, including the goalkeeper.'
        }
      ]
    };

    return sampleQuestions[category.name] || sampleQuestions['Science & Nature'];
  };

  const startQuiz = () => {
    setQuizState('active');
    setQuizStartTime(Date.now());
  };

  const pauseQuiz = () => {
    setQuizState('paused');
  };

  const resumeQuiz = () => {
    setQuizState('active');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleTimeUp = () => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      toast.warning("Time's up! Moving to next question.");
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    setShowResult(true);
    
    setTimeout(() => {
      if (isLastQuestion) {
        finishQuiz();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowResult(false);
        setTimeRemaining(questionTimeLimit);
      }
    }, 2000);
  };

  const finishQuiz = () => {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - quizStartTime) / 1000);
    
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === questions[index]?.correctAnswer ? count + 1 : count;
    }, 0);

    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const score = correctAnswers;

    const quizResult: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent,
      accuracy,
      category: category.name
    };

    setResult(quizResult);
    setQuizState('completed');
    
    // Save result
    QuizAPI.saveQuizResult(quizResult);
    
    toast.success(`Quiz completed! You scored ${correctAnswers}/${questions.length}`);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
    setTimeRemaining(questionTimeLimit);
    setResult(null);
    loadQuestions();
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (quizState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary">
        <Card className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Preparing Your Quiz</h2>
          <p className="text-muted-foreground">Generating {category.questionCount} {category.difficulty} questions about {category.name}...</p>
        </Card>
      </div>
    );
  }

  if (quizState === 'completed' && result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary">
        <ResultCard 
          result={result}
          onPlayAgain={restartQuiz}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onGoHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">{category.name} Quiz</h1>
                <p className="text-sm text-muted-foreground">{category.difficulty} • {category.questionCount} questions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {quizState === 'active' && (
                <Button variant="outline" size="sm" onClick={pauseQuiz}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              {quizState === 'paused' && (
                <Button variant="outline" size="sm" onClick={resumeQuiz}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
            </div>
          </div>
          
          <div className="pb-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizState === 'ready' && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground mb-6">
                You have {questionTimeLimit} seconds per question. Good luck!
              </p>
              <Button 
                onClick={startQuiz}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </Card>
          </div>
        )}

        {quizState === 'paused' && (
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Quiz Paused</h2>
              <p className="text-muted-foreground mb-6">
                Take your time. Click resume when you're ready to continue.
              </p>
              <Button 
                onClick={resumeQuiz}
                className="bg-gradient-to-r from-success to-success/80 hover:from-success/80 hover:to-success text-success-foreground shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Quiz
              </Button>
            </Card>
          </div>
        )}

        {(quizState === 'active') && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <QuestionCard
                  question={currentQuestion}
                  selectedAnswer={selectedAnswers[currentQuestionIndex]}
                  onAnswerSelect={handleAnswerSelect}
                  isAnswered={selectedAnswers[currentQuestionIndex] !== null}
                  showResult={showResult}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                />
              </div>
              
              <div className="w-64">
                <Timer
                  duration={questionTimeLimit}
                  onTimeUp={handleTimeUp}
                  isActive={quizState === 'active' && !showResult}
                  onTick={setTimeRemaining}
                />
              </div>
            </div>

            {selectedAnswers[currentQuestionIndex] !== null && !showResult && (
              <div className="text-center">
                <Button 
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground shadow-lg"
                >
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};