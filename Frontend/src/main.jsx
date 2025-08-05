import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProvider from './components/ThemeProvider.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.js";

import {
  SignIn,
  Dashboard,
  Analyse
} from './Pages'

const routes = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: '/sign-in', element: <SignIn /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/analyze-games/:game_id', element: <Analyse /> },
])

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RouterProvider router={routes} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
)
