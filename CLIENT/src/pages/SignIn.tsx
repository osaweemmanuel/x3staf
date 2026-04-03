import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faEye, faEyeSlash, faShieldHalved, faEnvelope, faRotate
} from "@fortawesome/free-solid-svg-icons";
import SignUpBg from "../assets/BGengineer.png";
import GoogleIcon from "../assets/GoogleOriginal.png";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { REACT_APP_API_URL } from "../../constants";
import { setCredentials } from "../auth/authSlice";
import { useLoginMutation, useCreateNewLinkMutation } from "../auth/authApiSlice";
import useTitle from "../hooks/useTitle";
import useAuth from "../hooks/useAuth";

export const SignIn = () => {
  useTitle("X3 Staffing Auth | SignIn");
  const { roles: authRoles, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const [createnewlink, { isLoading: linkLoading }] = useCreateNewLinkMutation();

  useEffect(() => {
    if (isLoggedIn && authRoles.length > 0) {
      if (authRoles.includes("Admin")) navigate("/admindashboard", { replace: true });
      else navigate("/userdashboard", { replace: true });
    }
  }, [isLoggedIn, authRoles, navigate]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0 && isResendDisabled) {
      timer = setInterval(() => setCountdown(p => p - 1), 1000);
    } else {
      clearInterval(timer);
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown, isResendDisabled]);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      const decoded: any = jwtDecode(accessToken);
      const roles = decoded.UserInfo.roles;
      toast.success("Identity Verified. Syncing...");
      if (roles.includes("Admin")) navigate("/admindashboard", { replace: true });
      else navigate("/userdashboard", { replace: true });
    } catch (err: any) {
      if (err.status === 401) toast.error("Invalid credentials.");
      else if (err.status === 402) { toast.error("Verification Required."); setStep(3); }
      else toast.error("Sync handshake failed.");
    }
  };

  const RequestVerificationLink = async () => {
    try {
      await createnewlink({ email }).unwrap();
      toast.success("Verification packet transmitted.");
      setCountdown(30);
      setIsResendDisabled(true);
    } catch (e) { toast.error("Transmission error."); }
  };

  const GoogleAuth = () => { window.location.href = `${REACT_APP_API_URL}/auth/google`; };

  return (
    <div className="min-h-screen bg-white flex font-Outfit overflow-hidden relative selection:bg-[#048372]/10">
      {/* 🏛️ PERSISTENT NAVIGATION HEADER */}
      <div className="fixed top-0 left-0 right-0 h-20 px-4 lg:px-8 flex items-center justify-between z-[100] pointer-events-none">
         <Link to="/" className="pointer-events-auto h-9 lg:h-10 px-4 lg:px-6 bg-slate-900 text-white rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 lg:gap-3 shadow-2xl hover:bg-[#048372] transition-all">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to Hub Home
         </Link>
         <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/5 rounded-full lg:hidden">
            <div className="w-2 h-2 bg-[#048372] rounded-full animate-pulse" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Secure Link Active</span>
         </div>
      </div>

      {/* 🏙️ VISUAL AUTH BARRIER (LEFT PROTOCOL) */}
      <section className="hidden lg:flex w-1/2 bg-[#0F172A] relative items-center justify-center p-20 overflow-hidden border-r border-[#048372]/10">
         <div className="absolute inset-0 opacity-20">
            <img src={SignUpBg} className="w-full h-full object-cover scale-110" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-br from-[#048372]/30 via-transparent to-[#0F172A]"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#048372]/10 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
         
         <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 space-y-10 max-w-lg">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl ring-1 ring-white/10">
                  <FontAwesomeIcon icon={faShieldHalved} size="lg" />
               </div>
               <span className="text-[9px] font-black uppercase text-white/40 tracking-widest italic">X3 Staffing Intelligence System</span>
            </div>
            <h1 className="text-6xl font-black text-white italic tracking-tighter leading-none">Access the <br/><span className="text-[#048372]">Command Hub</span>.</h1>
            <p className="text-lg text-slate-400 font-bold leading-relaxed italic border-l-4 border-[#048372]/40 pl-8">"Secure personnel management, live marketplace telemetry, and automated compliance auditing for the modern construction enterprise."</p>
         </motion.div>
      </section>

      {/* 🧬 AUTH FORM INTERFACE (RIGHT PROTOCOL) */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8FAFC] relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23048372' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
         
         <div className="max-w-md w-full space-y-12 relative z-10">
            <header className="space-y-4">
               <h2 className="text-4xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">Authentication Portal</h2>
               <div className="flex items-center gap-4">
                  <div className="h-[2px] w-8 bg-[#048372]" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">Personnel Handshake Required</p>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-10">
                     <button onClick={GoogleAuth} className="w-full py-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:border-[#048372] transition-all font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-slate-200/50 group">
                        <img src={GoogleIcon} className="w-5 grayscale group-hover:grayscale-0 transition-all" alt="G" /> Sign in with X3 Staffing ID
                     </button>
                     <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200/50"></div></div><div className="relative flex justify-center"><span className="bg-[#F8FAFC] px-4 text-[9px] font-black text-slate-300 uppercase italic">Or Log In Via Registry Email</span></div></div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Registry</label>
                           <input type="email" placeholder="user@x3staffing.com" className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-xs font-bold outline-none focus:ring-4 ring-[#048372]/10 focus:border-[#048372]/20 transition-all italic shadow-inner" value={email} onChange={e=>setEmail(e.target.value)} />
                        </div>
                        <button disabled={!email.includes('@')} onClick={()=>setStep(2)} className="w-full py-6 bg-[#048372] text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-[#048372]/30 hover:brightness-110 active:scale-[0.98] transition-all italic underline decoration-white/30">Initiate Handshake</button>
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.form key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSignIn} className="space-y-8">
                     <button type="button" onClick={()=>setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 hover:text-[#048372] transition-all italic underline underline-offset-4 decoration-slate-200"><FontAwesomeIcon icon={faArrowLeft} /> Previous Phase</button>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                           <div className="relative">
                              <input type={passwordVisible ? "text" : "password"} placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-2xl p-5 text-xs font-bold outline-none focus:ring-4 ring-[#048372]/10 focus:border-[#048372]/20 transition-all italic shadow-inner" value={password} onChange={e=>setPassword(e.target.value)} />
                              <button type="button" onClick={()=>setPasswordVisible(!passwordVisible)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#048372] transition-all"><FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} /></button>
                           </div>
                        </div>
                        <div className="text-right"><Link to="/forgotpassword" data-turbo="false" className="text-[10px] font-black text-[#048372] uppercase tracking-widest italic decoration-[#048372]/20 underline underline-offset-4">Reset Credentials?</Link></div>
                        <button type="submit" className="w-full py-6 bg-[#048372] text-white rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-[#048372]/30 hover:brightness-110 active:scale-[0.98] transition-all italic underline decoration-white/30">
                           {isLoading ? <PulseLoader size={6} color="white" /> : 'Authorize Identity'}
                        </button>
                     </div>
                  </motion.form>
               )}

               {step === 3 && (
                  <motion.div key="3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10">
                     <div className="w-24 h-24 bg-[#048372]/5 rounded-3xl flex items-center justify-center text-[#048372] mx-auto border border-[#048372]/20 shadow-2xl rotate-12">
                        <FontAwesomeIcon icon={faEnvelope} size="2xl" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black italic uppercase text-slate-900 leading-none">Verify Pulse</h3>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed italic">"An encrypted verification link has been transmitted to your email. Authorize the link to proceed to the command hub."</p>
                     </div>
                     {countdown > 0 ? (
                        <div className="w-full py-5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center justify-center gap-3">
                           <FontAwesomeIcon icon={faRotate} className="animate-spin text-[#048372]/30" /> Retry Sequence in {countdown}s
                        </div>
                     ) : (
                        <button onClick={RequestVerificationLink} className="w-full py-6 bg-[#048372] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-[#048372]/20 hover:brightness-110 transition-all italic underline decoration-white/20">
                           {linkLoading ? <PulseLoader size={6} color="white" /> : 'Resend Verification packet'}
                        </button>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>

            <footer className="pt-12 border-t border-slate-200/50 text-center space-y-8">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">No Registry Entry?</p>
                  <Link to="/register" className="inline-block px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#048372] transition-all italic shadow-2xl">Create Account Hub</Link>
               </div>
               <div className="pt-6">
                  <Link to="/admin/signin" className="text-[11px] font-black text-[#AECF5A] hover:text-[#048372] uppercase tracking-[0.2em] italic border border-[#AECF5A]/20 bg-[#AECF5A]/5 px-6 py-2 rounded-lg transition-all">
                     Switch to Administrative Gateway
                  </Link>
               </div>
            </footer>
         </div>
      </section>
    </div>
  );
};
