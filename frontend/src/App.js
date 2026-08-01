import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ContentProvider } from "./context/ContentContext";
import SmoothScroll from "./components/site/SmoothScroll";
import Home from "./pages/Home";
import ServiceDetail from "./pages/ServiceDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import "@/App.css";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#080D10]">
        <span className="font-head font-bold text-2xl tracking-[0.18em] text-white animate-pulse">VEYORA</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function PublicSite() {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
      </Routes>
    </SmoothScroll>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/*" element={<PublicSite />} />
            </Routes>
            <Toaster position="top-right" theme="dark" />
          </BrowserRouter>
        </ContentProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
