// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { createBrowserRouter, Route } from "react-router-dom";
// import AuthForm from "./forms/Form.jsx";
// import { RouterProvider, createRoutesFromElements } from "react-router-dom";
// import HistoryPage from "./Components/HistoryPage.jsx";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route path="/" element={<AuthForm />} />
//       <Route path="/app/*" element={<App/>}>
//         <Route path="history/:id" element={<HistoryPage />} />
//       </Route>  

//     </>
//   )
// );

// createRoot(document.getElementById("root")).render(
//   <RouterProvider router={router} />
// );

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, Route } from "react-router-dom";
import AuthForm from "./forms/Form.jsx";
import { RouterProvider, createRoutesFromElements } from "react-router-dom";
import HistoryPage from "./Components/HistoryPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Login/Register form at root */}
      <Route path="/" element={<AuthForm />} />

      {/* App routes */}
      <Route path="/app/*" element={<App />}>
        <Route path="history/:id" element={<HistoryPage />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
