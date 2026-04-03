import { Suspense, lazy } from "react";
import { RouteObject, useRoutes } from "react-router";
import PersistLogin from "../auth/PersistLogin";
import RequireAuth from "../auth/RequireAuth";
import { ROLES } from "./roles";
import { SharedLayout } from "../components/layout/SharedLayout";
import ScrollToTop from "../components/ScrollToTop";
import { withErrorBoundary } from "../hocs/withErrorBoundary";

// 🧬 PERFORMANCE OPTIMIZATION: CODE SPLITTING (LAZY LOADING)
const Home = lazy(() => import("../pages").then(m => ({ default: m.Home })));
const About = lazy(() => import("../pages").then(m => ({ default: m.About })));
const Careers = lazy(() => import("../pages").then(m => ({ default: m.Careers })));
const Contact = lazy(() => import("../pages").then(m => ({ default: m.Contact })));
const Employers = lazy(() => import("../pages").then(m => ({ default: m.Employers })));
const Services = lazy(() => import("../pages").then(m => ({ default: m.Services })));
const JobSeekers = lazy(() => import("../pages").then(m => ({ default: m.JobSeekers })));
const UserDashboard = lazy(() => import("../pages").then(m => ({ default: m.UserDashboard })));
const AdminDashboard = lazy(() => import("../pages").then(m => ({ default: m.AdminDashboard })));
const Missing = lazy(() => import("../pages").then(m => ({ default: m.Missing })));
const Register = lazy(() => import("../pages").then(m => ({ default: m.Register })));
const SignIn = lazy(() => import("../pages").then(m => ({ default: m.SignIn })));
const CustomerSignIn = lazy(() => import("../pages").then(m => ({ default: m.CustomerSignIn })));
const AdminSignIn = lazy(() => import("../pages").then(m => ({ default: m.AdminSignIn })));
const ForgotPassword = lazy(() => import("../pages").then(m => ({ default: m.ForgotPassword })));
const JobOpening = lazy(() => import("../pages").then(m => ({ default: m.JobOpening })));
const Profile = lazy(() => import("../pages").then(m => ({ default: m.Profile })));
const UserDetails = lazy(() => import("../pages").then(m => ({ default: m.UserDetails })));
const Timesheet = lazy(() => import("../pages").then(m => ({ default: m.Timesheet })));
const KYCDashboard = lazy(() => import("../pages").then(m => ({ default: m.KYCDashboard })));
const X3Messages = lazy(() => import("../pages").then(m => ({ default: m.X3Messages })));

// 📡 Isolated Protected Modules
const IsolatedAdminDashboard = withErrorBoundary(AdminDashboard);
const IsolatedUserDashboard = withErrorBoundary(UserDashboard);
const IsolatedJobOpening = withErrorBoundary(JobOpening);
const IsolatedKYC = withErrorBoundary(KYCDashboard);
const IsolatedMessages = withErrorBoundary(X3Messages);
const IsolatedTimesheet = withErrorBoundary(Timesheet);

import { X3Logo } from "../components/X3Logo";

const PageLoader = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 gap-8 font-Outfit text-white">
     <X3Logo light className="h-10" />
     <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#0BD1B0] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30 italic">Handshaking Operating System...</p>
     </div>
  </div>
);

export function Routes() {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: (
        <Suspense fallback={<PageLoader />}>
          <SharedLayout />
          <ScrollToTop />
        </Suspense>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/jobseekers", element: <JobSeekers /> },
        { path: "/contact", element: <Contact /> },
        { path: "/careers", element: <Careers /> },
        { path: "/services", element: <Services /> },
        { path: "/employers", element: <Employers /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/customer/signin", element: <CustomerSignIn /> },
        { path: "/admin/signin", element: <AdminSignIn /> },
        { path: "/register", element: <Register /> },
        { path: "/forgotpassword", element: <ForgotPassword /> },
        {
          element: <PersistLogin />,
          children: [
            {
              element: <RequireAuth allowedRoles={[ROLES.User]} />,
              children: [
                { path: "/userdashboard", element: <IsolatedUserDashboard /> },
              ],
            },
            {
              element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
              children: [
                { path: "/admindashboard", element: <IsolatedAdminDashboard /> },
              ],
            },
            {
              element: <RequireAuth allowedRoles={[...Object.values(ROLES)]} />,
              children: [
                { path: "/jobopenings", element: <IsolatedJobOpening /> },
                { path: "/profile", element: <Profile /> },
                { path: "/userdetails", element: <UserDetails /> },
                { path: "/timesheet", element: <IsolatedTimesheet /> },
                { path: "/kyc", element: <IsolatedKYC /> },
                { path: "/messages", element: <IsolatedMessages /> },
              ],
            },
          ],
        },
        { path: "*", element: <Missing /> },
      ],
    },
  ];
  return useRoutes(routes);
}
