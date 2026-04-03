import Header from "../Header";
import AppNavbar from "../AppNavbar";
import Footer from "../Footer";
import { Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export const SharedLayout = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/register" || 
    location.pathname === "/signin" ||
    location.pathname === "/customer/signin" ||
    location.pathname === "/admin/signin";

  const isDashboardRoute = 
    location.pathname.toLowerCase().includes("dashboard") ||
    location.pathname.toLowerCase().includes("jobopenings") ||
    location.pathname.toLowerCase().includes("userdetails") ||
    location.pathname.toLowerCase().includes("timesheet") ||
    location.pathname.toLowerCase().includes("kyc");

  return (
    <>
      <div className="font-sans antialiased text-slate-900">
        {!isAuthRoute && !isDashboardRoute && (isLoggedIn ? <AppNavbar /> : <Header />)}
        <Outlet />
        {!isAuthRoute && !isLoggedIn && !isDashboardRoute && <Footer />}
      </div>
    </>
  );
};
