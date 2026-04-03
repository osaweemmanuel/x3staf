import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/index.css";
import "./styles/animation.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import { store } from "./store"; // Import the 'store' object from './store.tsx'

import axios from "axios";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap your component tree with Provider and provide the Redux store */}
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
