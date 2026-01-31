import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ServerAwake from "./components/ServerAwake";
import { Toaster } from "sonner";

// Lazy loading imports
const Homepage = lazy(() => import("./pages/Homepage"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/Register"));
const Write = lazy(() => import("./pages/write"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const EditPost = lazy(() => import("./pages/EditPost"));
const Profile = lazy(() => import("./pages/profile"));

function App() {
  return (
    <>
      <ServerAwake />
      <Toaster position="top-center" richColors />
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

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

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;