import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserShield, faRotate } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useCustomerLoginMutation } from "../auth/authApiSlice";
import { setCredentials } from "../auth/authSlice";
import GlassCard from "../components/GlassCard";

export const CustomerSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [customerLogin, { isLoading }] = useCustomerLoginMutation();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await customerLogin({ email, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      toast.success("Welcome back!");
      navigate("/userdashboard");
    } catch (error: any) {
      if (error.status === 403) toast.error("Unauthorized: Customer access only");
      else if (error.status === 401) toast.error("Invalid credentials");
      else toast.error("Login failed, please try again");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 font-Outfit relative overflow-hidden">
      <Link to="/" className="absolute top-8 right-8 z-[110] px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest italic flex items-center gap-2">
        <FontAwesomeIcon icon={faRotate} className="text-[10px]" /> Back to Home
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <GlassCard className="text-white relative overflow-hidden">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-indigo-500/30">
               <FontAwesomeIcon icon={faUserShield} className="text-indigo-400 text-3xl animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Customer Gateway</h1>
            <p className="text-indigo-200/60 font-medium text-sm text-center">Personnel Command Hub Authentication</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 pl-1">Password</label>
              <div className="relative">
                <input 
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                  placeholder="********"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <Link to="/forgotpassword" title="Coming Soon" className="text-white/60 hover:text-white transition-colors">Forgot Password?</Link>
              <Link to="/admin/signin" className="text-secondary hover:text-secondary/80 font-semibold transition-colors flex items-center gap-1">
                <FontAwesomeIcon icon={faUserShield} size="xs" />
                Admin Portal
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transform hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? <PulseLoader size={8} color="white" /> : "Authorize Handshake"}
            </button>

            <div className="text-center text-sm text-white/60">
              New here? <Link to="/register" className="text-indigo-400 font-semibold hover:underline decoration-indigo-400 decoration-2 underline-offset-4">Create account hub</Link>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};
