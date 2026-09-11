import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { AuthWrapper } from './context/auth.context.jsx';

// cool function that refreshes the console when changing the code. thanks to Tim!
/* if (import.meta.hot) {
  import.meta.hot.on(
    "vite:beforeUpdate",
    () => console.clear()
  );
} */

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </BrowserRouter>
)

