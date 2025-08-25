import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Route } from "react-router-dom";
import AuthForm from "./forms/Form.jsx";
import { RouterProvider, createRoutesFromElements } from "react-router-dom";
import HistoryPage from "./Components/HistoryPage.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import ProtectedRoutes from "./Components/ProtectedRoutes.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login/Register form at root */}
      <Route path="/" element={<AuthForm />} />
      {/* App routes */}
      <Route path="/app/*" element={
        <ProtectedRoutes>
          <App/>
        </ProtectedRoutes>
      }>
        <Route path="history/:id" element={<HistoryPage />} />
      </Route>
      <Route path="*" element={<PageNotFound/>}/>
      
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
