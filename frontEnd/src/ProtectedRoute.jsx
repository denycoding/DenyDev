import { Navigate } from "react-router-dom";

const dashboards = {
  client: "/clientdashboard",
  freelancer: "/freelancerdashboard",
  admin: "/admindashboard",
};

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(role) ? role : [role];
  if (role && !allowed.includes(user.role)) {
    return <Navigate to={dashboards[user.role] || "/login"} replace />;
  }

  return children;
}
