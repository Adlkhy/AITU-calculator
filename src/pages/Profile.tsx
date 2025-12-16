import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useEffect } from 'react';
import { Navbar08 } from '@/components/Navbar2';
import { DotLoader } from '@/components/shadcn/gsap/dot-loader';

export default function Profile() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

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

  if (!user) {
    return null;
  }

  return (
    <>
    <Navbar08 />
    <div className="text-foreground min-h-screen font-sans px-4 sm:px-8">
      <Card className='max-w-4xl mx-auto my-8 '>
        <CardContent>
          <CardTitle className="text-3xl text-center mb-2 mt-4 sm:mt-6">Welcome back, {user.user_metadata?.full_name || 'User'}!</CardTitle>
          <CardDescription className="text-center text-foreground/70 text-base mb-4 sm:mb-6">
            Here is your profile overview. You can update your information and view your activity.
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="max-w-4xl mx-auto bg-card p-4 sm:p-8">
        <CardTitle className="text-2xl text-foreground">Profile</CardTitle>
        
        <CardContent className="space-y-6 px-0">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} alt='Avatar' />
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                { user.user_metadata?.full_name || 'No name set'}
              </h2>
              <p className="text-foreground">{user.email}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Full Name
              </label>
              <p className="text-foreground">
                { user.user_metadata?.full_name || 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Email
              </label>
              <p className="text-foreground">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Account Created
              </label>
              <p className="text-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* GitHub Info (if available) */}
          {user.user_metadata?.user_name && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                GitHub Username
              </label>
              <p className="text-foreground">@{user.user_metadata.user_name}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-foreground font-sans pt-4 sm:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-6 mb-8 shadow-lg border border-foreground">
            <h2 className="text-xl font-bold text-foreground mb-4">My Calculators</h2>
            <p>In the future you will be able to access your own created calculators here and the main page of course.</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}