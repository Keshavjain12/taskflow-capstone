import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectBoardPage } from "./pages/ProjectBoardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useAuthStore } from "./store/authStore";

function Root() {
  const { accessToken } = useAuthStore();
  return accessToken ? <Navigate to="/projects" replace /> : <LandingPage />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: "!bg-surface-900 !text-surface-50 !border !border-surface-800 !shadow-card-hover !text-sm",
          success: { iconTheme: { primary: "#7452f7", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectBoardPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
