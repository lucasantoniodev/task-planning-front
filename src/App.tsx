import { MantineProvider } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Outlet />
      </div>
    </MantineProvider>
  );
}
