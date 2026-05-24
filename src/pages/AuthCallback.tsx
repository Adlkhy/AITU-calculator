import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SeoMeta } from '@/lib/seo';

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    const searchParams = new URLSearchParams(window.location.search);
    const authType = hashParams.get('type') || searchParams.get('type');

    if (authType === 'recovery') {
      navigate('/reset-password', { replace: true });
      return;
    }

  // console.log('Current URL:', window.location.href);
  // console.log('URL hash:', window.location.hash);
  // console.log('URL search:', window.location.search);
    const handleAuthCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // console.log('User data:', user);
        // console.log('User metadata:', user?.user_metadata);
        
        if (error) {
          console.error('Auth error:', error);
          navigate('/login?error=auth_failed');
        } else if (user) {
          console.log('✅ User authenticated:', user.email);
          
          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one
            console.log('Creating profile for user...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: user.id, 
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
                avatar_url: user.user_metadata?.avatar_url,
                email: user.email
              }]);
              
            if (insertError) {
              console.error('Failed to create profile:', insertError);
            } else {
              console.log('✅ Profile created successfully');
            }
          } else if (profileError) {
            console.error('Profile fetch error:', profileError);
          } else {
            console.log('✅ Profile exists:', profile);
          }
          
          navigate('/', { replace: true });
        } else {
          console.log('❌ No user found');
          navigate('/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate('/login?error=unknown');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <>
      <SeoMeta
        title="Authentication Callback | Evalis"
        description="Finalizing your Evalis authentication session."
        path="/auth/callback"
        noindex
      />
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground">Processing authentication... don't move, eyes on me</p>
        </div>
      </div>
    </>
  );
}
