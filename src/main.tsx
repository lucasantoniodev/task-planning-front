import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProviderApp } from './router/router.tsx';

import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProviderApp />
  </StrictMode>,
);
