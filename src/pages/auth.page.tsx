import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth.ts';
import { PlannerPage } from './planner.page.tsx';

export const AuthPage = () => {
  const user = useAuth();

  if (user === undefined) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <PlannerPage />;
};
