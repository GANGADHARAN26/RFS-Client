import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import MainPage from "./pages/Main/MainPage";
import Sidebar from "./components/Main/Sidebar";
import Cookies from "js-cookie";
import { useEffect } from "react";
import Candidates from "./pages/Dashboard/Candidates";

function App() {
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();

  // Redirect to `/candidates` if token exists
  useEffect(() => {
    if (token) {
      navigate("/candidates");
    }else{
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        {/* Routes for Unauthenticated Users */}
        {!token ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
          </>
        ) : (
          // Routes for Authenticated Users
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/candidates" element={<Candidates />} />
          </>
        )}
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
