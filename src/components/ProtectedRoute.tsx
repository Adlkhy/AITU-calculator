import { useUser } from '@/hooks/useUser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLoader } from './shadcn/gsap/dot-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true }); 
    }
  }, [user, loading, navigate]);

  const game = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
  ];

  // 1. Show Loader while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex items-center gap-5 rounded px-4 py-3">
          <DotLoader 
            frames={game}
            className='gap-0.5'
            color="primary"
            duration={150}
            isPlaying={true}
            dotClassName='bg-foreground/15 [&.active]:bg-foreground size-1.5 sm:size-2.5' 
          ></DotLoader>
          <p className="text-base sm:text-2xl font-medium text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // 2. Double check: If loading is done and still no user, render nothing 
  if (!user) {
    return null; 
  }

  // 3. User is confirmed, render the page
  return <>{children}</>;
}