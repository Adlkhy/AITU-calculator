import React, { useEffect, useState, useRef } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { UserContext } from '@/hooks/useUser';
import LoadingPage from '@/pages/LoadingPage';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<unknown | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  useEffect(() => {
    if (profileLoading) {
      console.debug('Profile is loading...');
    }
  }, [profileLoading]);

  // Prevent race conditions
  const mountedRef = useRef(true);
  const fetchProfileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProfile = async (user: User) => {
    const userId = user.id;
    // Clear any existing timeout
    if (fetchProfileTimeoutRef.current) {
      clearTimeout(fetchProfileTimeoutRef.current);
    }

    setProfileLoading(true);
    
    // Set a timeout to prevent infinite loading
    fetchProfileTimeoutRef.current = setTimeout(() => {
      console.warn('Profile fetch timeout - continuing anyway');
      if (mountedRef.current) {
        setProfileLoading(false);
      }
    }, 5000); // 5 second timeout

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Clear timeout on successful fetch
      if (fetchProfileTimeoutRef.current) {
        clearTimeout(fetchProfileTimeoutRef.current);
      }

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('Creating profile for user...');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
            avatar_url: user.user_metadata?.avatar_url,
            email: user.email
          }])
          .select()
          .single();
          
        if (insertError) {
          console.error('Failed to create profile:', insertError);
        } else if (newProfile && mountedRef.current) {
          setProfile(newProfile);
        }
        return;
      } else if (error) {
        console.error('Error fetching profile:', error);
        if (mountedRef.current) {
          setProfile(null);
        }
        return;
      }

      if (data && mountedRef.current) {
        // If profile exists but email is missing, update it
        if (!data.email && user.email) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ email: user.email })
            .eq('id', userId)
            .select()
            .single();
          
          if (!updateError && updatedProfile) {
            setProfile(updatedProfile);
          } else {
            setProfile(data);
          }
        } else {
          setProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (mountedRef.current) {
        setProfile(null);
      }
    } finally {
      // Clear timeout
      if (fetchProfileTimeoutRef.current) {
        clearTimeout(fetchProfileTimeoutRef.current);
      }
      if (mountedRef.current) {
        setProfileLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (!mountedRef.current) return;

        console.log('Initial session:', initialSession?.user?.email || 'No user');
        
        setSession(initialSession);
        const initialUser = initialSession?.user ?? null;
        setUser(initialUser);

        // CRITICAL: Set loading to false IMMEDIATELY after getting auth state
        // Don't wait for profile fetch
        setLoading(false);

        // Fetch profile in background (non-blocking)
        if (initialUser) {
          fetchProfile(initialUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mountedRef.current) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        
        if (!mountedRef.current) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // CRITICAL: Set loading to false immediately
        setLoading(false);

        // Handle profile fetch based on auth state
        if (currentSession?.user) {
          // Fetch profile in background (non-blocking)
          fetchProfile(currentSession.user);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      if (fetchProfileTimeoutRef.current) {
        clearTimeout(fetchProfileTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading, session }}>
      {loading ? <LoadingPage /> : children}
    </UserContext.Provider>
  );
};