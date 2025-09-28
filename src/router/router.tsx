import { AppShell } from '@mantine/core';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';
import App from '../App';
import { AppNavbar } from '../components/navbar';
import { useAuth } from '../hooks/use-auth.ts';
import { LoginPage } from '../pages/login';
import { NewPlanningRoomPage } from '../pages/new-planning-room';
import { PlanningRoom } from '../pages/planning-room';
import { RegisterPage } from '../pages/register';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const user = useAuth();
  if (user === undefined) return <div className="p-4">Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
};

const rootRoute = createRootRoute({
  component: App,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => (
    <ProtectedRoute>
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <AppNavbar />
        </AppShell.Header>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ProtectedRoute>
  ),
});

const newPlanningRoomPage = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/',
  component: NewPlanningRoomPage,
});

// eslint-disable-next-line react-refresh/only-export-components
export const planningRoomPage = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/$id',
  component: PlanningRoom,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  protectedLayoutRoute.addChildren([newPlanningRoomPage, planningRoomPage]),
]);

// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RouterProviderApp = () => <RouterProvider router={router} />;
