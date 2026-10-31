import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/manrope/wght.css';
import '../index.css';
import SeatingPlanner from './SeatingPlanner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SeatingPlanner />
  </StrictMode>,
);
