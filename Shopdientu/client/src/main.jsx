import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { store, perStore } from './redux/Store.jsx';
import { Provider } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ultils/i18n.jsx"
import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={perStore}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
)
