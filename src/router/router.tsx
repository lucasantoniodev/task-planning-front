import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';

import App from '../App';
import { AuthPage } from '../pages/auth.page.tsx';

const rootRoute = createRootRoute({
  component: App,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuthPage,
});

const routeTree = rootRoute.addChildren([authRoute]);

// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({ routeTree });

// Optional for TypeScript autocompletion
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const RouterProviderApp = () => <RouterProvider router={router} />;
