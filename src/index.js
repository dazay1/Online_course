import React from 'react';
import { createRoot } from 'react-dom/client';  // Updated import
import App from './App';
import { Provider } from 'react-redux';
import store from './components/Redux/store';
import ErrorBoundary from './ErrorBoundary'; 
// Get the root DOM element
const container = document.getElementById('root');
// Create a root
const root = createRoot(container);
// Render your app
root.render(
  <Provider store={store}>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
  </Provider>
);