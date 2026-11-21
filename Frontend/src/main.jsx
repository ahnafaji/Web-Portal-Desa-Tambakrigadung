import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/apbd.css";
import "./styles/potensi.css";
import "./styles/berita.css";
import "./styles/umkm.css";
import "./styles/galeri.css";
import "./styles/kontak.css";
import "./styles/admin-login.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);