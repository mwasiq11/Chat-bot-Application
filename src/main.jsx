import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Route } from "react-router-dom";
import AuthForm from "./forms/Form.jsx";
import { RouterProvider, createRoutesFromElements } from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AuthForm />} />
      <Route path="/app" element={<App />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
