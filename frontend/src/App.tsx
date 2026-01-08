// src/App.tsx (GÜNCELLENMİŞ)
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/login";
import Register from "./pages/Register";
// ForgotPassword removed
import Write from "./pages/write";
import PostDetail from "./pages/PostDetail";
import AdminPanel from "./pages/AdminPanel";
import EditPost from "./pages/EditPost";
import Profile from "./pages/profile"; // 🔥 BU SATIRI EKLE
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Layout'lu sayfalar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile/:username" element={<Profile />} /> {/* 🔥 BU SATIRI EKLE */}
        <Route path="/profile" element={ /* 🔥 Opsiyonel: /profile (kendi profilim) */
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Protected routes */}
        <Route path="/write" element={
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <Write />
          </ProtectedRoute>
        } />

        <Route path="/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <EditPost />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Route>

      {/* Auth routes (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;