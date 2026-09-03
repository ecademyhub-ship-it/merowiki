import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  // treat explicit string values that represent missing tokens as unauthenticated
  const isValidToken = !!token && token !== "null" && token !== "undefined";

  if (!isValidToken) {
    return <Navigate to="/login" replace />;
  }


  return children;
}

export default ProtectedRoute;