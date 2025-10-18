import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
