import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/authentications/Login";
import Register from "./pages/authentications/Register";
import Dashboard from "./pages/Dashboard";
import ContentsList from "./pages/contents/ContentsList";
import UsersList from "./pages/users/UsersList";
import UsersForm from "./pages/users/UsersForm";
import ContentForm from "./pages/contents/ContentsForm";
import ManagementLayout from "./layouts/ManagementLayout";
import PreviewContent from "./pages/contents/PreviewContent";
import ProfilePage from "./pages/profile/ProfilePage";

// import Login from "./pages/Login";
// import UserForm from "./pages/users/UserForm";
// import ContentForm from "./pages/contents/ContentForm";
// import Upload from "./pages/Upload";

export default function AppRoutes() {
  const auth = React.useContext(AuthContext)!;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            auth.user ? <Authenticated /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function Authenticated() {
  return (
    <Routes>
      <Route element={<ManagementLayout title="Home Page" />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ManagementLayout title="Content Management" />}>
        <Route path="contents" element={<ContentsList />} />
        <Route path="contents/new" element={<ContentForm />} />
        <Route path="contents/:id" element={<ContentForm />} />
        <Route path="preview" element={<PreviewContent />} />
      </Route>
      <Route element={<ManagementLayout title="User Management" />}>
        <Route path="users" element={<UsersList />} />
        <Route path="users/new" element={<UsersForm />} />
        <Route path="users/:id" element={<UsersForm />} />
      </Route>
      <Route path="profile" element={<ProfilePage />} />
      {/* Redirect unknown to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
