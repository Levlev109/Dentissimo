
  import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./i18n";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
  