import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';

interface AdminRouteProps {
  children: React.ReactNode;
}

interface ProfileRoleResponse {
  role: 'user' | 'admin';
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkRole() {
      if (loading) {
        return;
      }

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setIsCheckingRole(true);

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!cancelled) {
          const typedData = data as ProfileRoleResponse;
          setIsAdmin(typedData.role === 'admin');
        }
      } catch (error) {
        console.error('Failed to check admin role:', error);
        if (!cancelled) {
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) {
          setIsCheckingRole(false);
        }
      }
    }

    void checkRole();

    return () => {
      cancelled = true;
    };
  }, [loading, navigate, user]);

  if (loading || isCheckingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold">Unauthorized</h1>
          <p className="text-muted-foreground mt-2">You do not have access to this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
