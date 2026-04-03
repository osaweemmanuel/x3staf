import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
  const location = useLocation();
  const { roles } = useAuth();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounting(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const isAuthorized = Array.isArray(roles) && roles.some((role) => allowedRoles.includes(role));
  
  console.log('DEBUG: RequireAuth Render:', { roles, allowedRoles, isAuthorized, isMounting });

  if (isMounting) {
    return (
      <div className="h-screen bg-[#0A0F14] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] animate-pulse">Authenticating Identity...</p>
      </div>
    );
  }

  const content = isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
