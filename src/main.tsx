// import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// this manifest is used temporarily for development purposes
const manifestUrl =
  'https://mmakankov.github.io/first_contract_front_end/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
);
