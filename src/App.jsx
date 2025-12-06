import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchUserProfile from "./features/fetch-async/fetchUserProfile";
import { TOKEN_UNDEFINED } from "./features/constants";

import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import GuestLoginPage from "./pages/GuestLoginPage";
import UploadPage from "./pages/UploadPage";
import RagPage from "./pages/RagPage";

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
  const dispatch = useDispatch();
  const token = useSelector((state) => state.userDetails.token);
  const bootstrappedRef = useRef(false);

  const auth =
    typeof token === "string" &&
    token !== TOKEN_UNDEFINED &&
    token.trim() !== "";

  useEffect(() => {
    if (!auth || bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    dispatch(fetchUserProfile());
  }, [auth, dispatch]);
  return <RouterProvider router={router} />;
}

export default App;
