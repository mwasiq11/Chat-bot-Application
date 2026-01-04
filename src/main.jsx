import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./forms/Form.jsx";
import { RouterProvider, createRoutesFromElements } from "react-router-dom";
import HistoryPage from "./Components/HistoryPage.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import ProtectedRoutes from "./Components/ProtectedRoutes.jsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login/Register form at root */}
      <Route path="/" element={<AuthForm />} />

      {/* App routes */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoutes>
            <App />
          </ProtectedRoutes>
        }
      >
        <Route path="history/:id" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
      }}
    />
    <RouterProvider router={router} />
  </>
);
