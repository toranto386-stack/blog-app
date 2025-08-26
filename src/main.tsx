import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContex.tsx';


const queryClient = new QueryClient();

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Router>
        <App />
      </Router>
       </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
