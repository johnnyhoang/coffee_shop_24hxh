import { ReactNode } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Loading } from '../components/loading';
import { LoginPage } from '../modules/auth/login-page';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
