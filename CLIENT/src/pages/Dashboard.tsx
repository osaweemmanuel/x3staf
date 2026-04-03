import { AdminDashboard } from "./AdminDashboard";
import { UserDashboard } from "./UserDashboard";
import useAuth from "../hooks/useAuth";

export const Dashboard = () => {
  const { roles } = useAuth();
  return roles.includes("Admin") ? <AdminDashboard /> : <UserDashboard />;
};
