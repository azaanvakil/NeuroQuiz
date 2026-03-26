import { useState, useEffect } from "react";
import { Home } from "./Home";
import { QuizPage } from "./QuizPage";
import { Profile } from "./Profile";
import { Login } from "@/components/Auth/Login";
import { Signup } from "@/components/Auth/Signup";
import { QuizAPI, User, QuizCategory } from "@/utils/api";

type AppPage = 'auth' | 'home' | 'quiz' | 'profile';
type AuthMode = 'login' | 'signup';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = QuizAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage('home');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('home');
  };

  const handleSignup = (newUser: User) => {
    setUser(newUser);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    QuizAPI.logout();
    setUser(null);
    setCurrentPage('auth');
    setAuthMode('login');
  };

  const handleStartQuiz = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentPage('quiz');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setSelectedCategory(null);
  };

  const handleViewProfile = () => {
    setCurrentPage('profile');
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  // Auth pages
  if (currentPage === 'auth') {
    if (authMode === 'login') {
      return <Login onLogin={handleLogin} onToggleMode={toggleAuthMode} />;
    } else {
      return <Signup onSignup={handleSignup} onToggleMode={toggleAuthMode} />;
    }
  }

  // Main app pages (require authentication)
  if (!user) {
    setCurrentPage('auth');
    return null;
  }

  switch (currentPage) {
    case 'home':
      return (
        <Home
          user={user}
          onStartQuiz={handleStartQuiz}
          onLogout={handleLogout}
          onViewProfile={handleViewProfile}
        />
      );

    case 'quiz':
      if (!selectedCategory) {
        setCurrentPage('home');
        return null;
      }
      return (
        <QuizPage
          category={selectedCategory}
          onGoHome={handleGoHome}
          onViewProfile={handleViewProfile}
        />
      );

    case 'profile':
      return (
        <Profile
          user={user}
          onGoHome={handleGoHome}
          onStartQuiz={(categoryName) => {
            // Find category by name and start quiz
            QuizAPI.getCategories().then(categories => {
              const category = categories.find(cat => cat.name === categoryName);
              if (category) {
                handleStartQuiz(category);
              }
            });
          }}
        />
      );

    default:
      return <Home user={user} onStartQuiz={handleStartQuiz} onLogout={handleLogout} onViewProfile={handleViewProfile} />;
  }
};

export default Index;
