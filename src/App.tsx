import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from './components/theme-provider';
import LoadingPage from './pages/LoadingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useEffect } from 'react';
import { useUser } from './hooks/useUser';
import { Navbar08 } from './components/Navbar';
import Footer from './components/Footer';
import GPA from './components/GPA';
import Attendance from './components/Attendance';
import Budget from './components/Budget';
import Dynamic from './components/Dynamic';
import FinalGrade from './components/FinalGrade';

const SubjectDirectory = lazy(() => import('./pages/SubjectDirectory'));
const SubjectCalculator = lazy(() => import('./pages/SubjectCalculator'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const Profile = lazy(() => import('./pages/Profile'));
const TermOfService = lazy(() => import('./pages/TermOfService'));
const AI = lazy(() => import('./pages/AI'));
const Settings = lazy(() => import('./pages/Settings'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const ModerationQueuePage = lazy(() => import('./pages/admin/ModerationQueuePage'));
const ModerationDetailPage = lazy(() => import('./pages/admin/ModerationDetailPage'));
const SubmitSyllabusPage = lazy(() => import('./pages/SubmitSyllabusPage'));

function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar08 />
      <main className="flex-1 px-4 py-10 sm:px-8 lg:px-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

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
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/grade-tracker" element={<SubjectDirectory />} />
            <Route path="/calculator" element={<SubjectDirectory />} />
            <Route path="/gpa-calculator" element={<CalculatorLayout><GPA /></CalculatorLayout>} />
            <Route path="/calculator/final-grade" element={<CalculatorLayout><FinalGrade /></CalculatorLayout>} />
            <Route path="/calculator/:subjectSlug" element={<SubjectCalculator />} />
            <Route path="/calculator/gpa" element={<CalculatorLayout><GPA /></CalculatorLayout>} />
            <Route path="/calculator/attendance" element={<CalculatorLayout><Attendance /></CalculatorLayout>} />
            <Route path="/calculator/budget" element={<CalculatorLayout><Budget /></CalculatorLayout>} />
            <Route path="/calculator/custom" element={<CalculatorLayout><Dynamic /></CalculatorLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/term-of-service" element={<TermOfService />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/syllabus/submit" element={
              <ProtectedRoute>
                <SubmitSyllabusPage />
              </ProtectedRoute>}
            />
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
            <Route path="/admin/moderation" element={
              <AdminRoute>
                <ModerationQueuePage />
              </AdminRoute>}
            />
            <Route path="/admin/moderation/:id" element={
              <AdminRoute>
                <ModerationDetailPage />
              </AdminRoute>}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;