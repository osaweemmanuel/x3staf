import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../assets/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie, faLock, faEye, faEyeSlash, faRotate, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useAdminLoginMutation } from "../auth/authApiSlice";
import { setCredentials } from "../auth/authSlice";

export const AdminSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await adminLogin({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      toast.success("Administrator session initialized.");
      navigate("/admindashboard");
    } catch (error: any) {
      if (error.status === 403) toast.error("Unauthorized: Executive access only.");
      else if (error.status === 401) toast.error("Invalid credentials.");
      else toast.error("Login protocol failed.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-Outfit overflow-hidden relative">
      <Link to="/" className="absolute top-4 right-4 lg:top-8 lg:right-8 z-[110] px-4 lg:px-5 py-2 lg:py-2.5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl text-[9px] lg:text-[10px] font-black text-slate-800 hover:bg-white hover:shadow-lg transition-all uppercase tracking-widest italic flex items-center gap-2">
        <FontAwesomeIcon icon={faRotate} className="text-[#048372]" /> Back to Home
      </Link>

      {/* 🏙️ LEFT COLUMN: ELITE BRANDING & IMAGE */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#048372]/60 to-[#0F172A]/90 z-10" />
        <img 
          src="/admin_login_bg.png" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[10s] ease-out" 
          alt="X3 Executive Hub" 
        />
        
        <div className="relative z-20 flex flex-col justify-between p-20 w-full text-white italic">
           <div className="flex items-center gap-4">
              <img src={logo} className="w-12 h-12 object-contain rounded-xl shadow-2xl bg-white p-1" alt="X3 Hub" />
              <span className="text-2xl font-black tracking-tighter uppercase italic">X3 Staffing Network</span>
           </div>

           <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-[#AECF5A]">Executive Dashboard Protocol</span>
              <h1 className="text-6xl font-black italic leading-[1.1] mb-8 tracking-tighter">
                Precision Management. <br />
                <span className="text-white/50 underline decoration-[#AECF5A]/40 decoration-4 underline-offset-8">Global Scale.</span>
              </h1>
              <p className="text-lg font-medium text-white/70 leading-relaxed font-sans mb-12">
                "The industry-leading platform for construction and warehouse personnel management. Scalable logistics, verified identity hubs, and real-time operational telemetry."
              </p>

              <div className="flex gap-10">
                 <div className="space-y-1">
                    <p className="text-2xl font-black italic">99.8%</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#AECF5A]">Uptime Index</p>
                 </div>
                 <div className="space-y-1 border-l border-white/10 pl-10">
                    <p className="text-2xl font-black italic">Sync_Active</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#AECF5A]">Global Registry</p>
                 </div>
              </div>
           </div>

           <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">© 2024 X3 Staffing Inc. Executive Registry Hub.</p>
        </div>
      </div>

      {/* 🔐 RIGHT COLUMN: SECURE LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white lg:bg-[#F8FAFC]">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
             <img src={logo} className="w-20 h-20 object-contain mb-10 rounded-2xl shadow-xl border border-slate-100 p-2" alt="X3 Logo" />
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-3 uppercase">Admin Gateway</h2>
             <p className="text-slate-400 text-sm font-medium italic">Please input your administrative credentials to sync with the Hub.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Administrative ID</label>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-[#048372] transition-all font-sans italic"
                  placeholder="admin@x3staffing.ca"
                  required
                />
                <FontAwesomeIcon icon={faUserTie} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#048372] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Security Access Key</label>
              <div className="relative group">
                <input 
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-[#048372] transition-all font-sans italic"
                  placeholder="••••••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#048372]"
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-10 uppercase text-[11px] tracking-[0.3em] font-sans italic"
            >
              {isLoading ? <PulseLoader size={8} color="white" /> : (
                <>
                  <FontAwesomeIcon icon={faLock} size="sm" />
                  Initialize Remote Session
                </>
              )}
            </button>

            <div className="pt-10 border-t border-slate-100">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <Link to="/customer/signin" className="text-[10px] font-black text-[#048372] uppercase tracking-widest hover:underline italic flex items-center gap-2">
                        <FontAwesomeIcon icon={faGlobe} /> Return to Public Portal
                     </Link>
                     <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Encryption_Active</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-4 group hover:border-[#048372]/20 transition-all cursor-default">
                     <p className="text-[9px] font-medium text-slate-400 leading-tight italic">
                        Access is restricted to verified high-fidelity assets only. Your IP and session metadata are being logged for security auditing.
                     </p>
                  </div>
               </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
