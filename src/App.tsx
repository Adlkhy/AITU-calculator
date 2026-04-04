import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import SubjectDirectory from './pages/SubjectDirectory';
import SubjectCalculator from './pages/SubjectCalculator';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import Leaderboard from './pages/Leaderboard';
import NotFoundPage from './components/NotFoundPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useUser } from './hooks/useUser';
import TermOfService from './pages/TermOfService';
import AI from './pages/AI';
import Settings from './pages/Settings';
import ResetPasswordPage from './pages/ResetPassword';

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
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* SEO-friendly calculator routes */}
          <Route path="/calculator" element={<SubjectDirectory />} />
          <Route path="/calculator/:subjectSlug" element={<SubjectCalculator />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/term-of-service" element={<TermOfService />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>}
            />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>}
            />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;