import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { role, loading } = useContext(UserContext);
  const location = useLocation();

  console.log("Role:", role);
  console.log("RequiredRole:", requiredRole);

  // Check if the user has access
  const hasAccess = requiredRole
    ? Array.isArray(requiredRole)
      ? requiredRole.some(r => role.includes(r)) // Check if any required role exists in the user's roles
      : role.includes(requiredRole) // If requiredRole is a string, check if it's in the role array
    : true; // Allow access if no requiredRole is passed

  console.log("HasAccess:", hasAccess);

  if (loading) {
    return <div>Loading...</div>; // Show loading while role is being determined
  }

  if (!role) {
    console.warn("No role found. Redirecting to login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    console.warn(`Unauthorized access to ${location.pathname}. Redirecting to unauthorized.`);
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children; // Allow access if role matches or no restriction is applied
};

export default ProtectedRoute;
