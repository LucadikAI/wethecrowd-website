import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// In productie is de pagina geprerenderd, dus hydrateren we de bestaande HTML
// in plaats van hem weg te gooien. Tijdens `npm run dev` is #root leeg en is
// createRoot de juiste route.
if (container.firstChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
