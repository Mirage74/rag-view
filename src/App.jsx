import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import GuestLoginPage from "./pages/GuestLoginPage";
import UploadPage from "./pages/UploadPage";
import RagPage from "./pages/RagPage";

function hasToken() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("jwt"));
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "guest-login", element: <GuestLoginPage /> },
      { path: "upload", element: <UploadPage /> },
      { path: "rag", element: <RagPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
