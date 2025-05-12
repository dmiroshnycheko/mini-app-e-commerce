import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/config";
import App from "./App.tsx";
import { RoleUserProvider } from "./contexts/RoleUserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoleUserProvider>
      <App />
    </RoleUserProvider>
  </StrictMode>
);
