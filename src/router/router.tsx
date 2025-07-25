import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  RouterProvider,
} from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import App from '../App';
import { useAuth } from '../hooks/useAuth.ts';
import { AuthPage } from '../pages/auth.page.tsx';
import { LoginPage } from '../pages/login.page.tsx';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = useAuth();
  if (user === undefined) return <div className="p-4">Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
};

const rootRoute = createRootRoute({
  component: App,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([authRoute, loginRoute]);

// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({ routeTree });

// Optional for TypeScript autocompletion
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RouterProviderApp = () => <RouterProvider router={router} />;
