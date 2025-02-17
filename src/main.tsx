import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import '../polyfills';
import { App } from './App';
import { logger } from './shared/lib/logger';
import '@twa-dev/sdk';
import WebAppService from './shared/api/telegram/WebAppService';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    logger.info('The application has been launched successfully');
  } catch (error) {
    console.error('Critical error:', error);
    WebAppService.getInstance().showAlert('Application initialization error');
  }
});
