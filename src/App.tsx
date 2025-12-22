import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import MainCalculator from './pages/CalculatorApp'; // We'll create this
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Leaderboard from './pages/Leaderboard';
import NotFoundPage from './components/NotFoundPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useUser } from './hooks/useUser';
import FinalGrades from './pages/FinalGrades';
import TermOfService from './pages/TermOfService';
import AI from './pages/AI';

function App() {
  const { user, loading, session } = useUser();

  useEffect(() => {
    console.log('App - User state:', { 
      user: user?.email, 
      loading: loading,
      hasSession: !!session 
    });
  }, [user, loading, session]);
  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Router>
        <Routes>
          <Route path="/" element={<MainCalculator />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/term-of-service" element={<TermOfService />} />
          <Route path="/ai" element={
            <ProtectedRoute>
              <AI subject={''} />
            </ProtectedRoute>}
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>} 
            />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>} 
            />
          <Route path="/final-grades" element={
            <ProtectedRoute>
              <FinalGrades />
            </ProtectedRoute>} 
            />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;