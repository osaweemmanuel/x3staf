import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft, faShieldHalved, faRotate } from "@fortawesome/free-solid-svg-icons";
import { PulseLoader } from "react-spinners";
import SignUpBg from "../assets/BGengineer.png";
import GoogleIcon from "../assets/GoogleOriginal.png";
import { useRegisterMutation } from "../auth/authApiSlice";
import useTitle from "../hooks/useTitle";
import { REACT_APP_API_URL } from "../../constants";

export const Register = () => {
  useTitle("X3 Staffing Auth | Registration");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [isPasswordValid, setIsPasswordValid] = useState({
    length: false, number: false, specialChar: false, upperCase: false, lowerCase: false,
  });

  const [register, { isLoading }] = useRegisterMutation();

  const handlePasswordChange = (value: string) => {
    setIsPasswordValid({
      length: value.length >= 8,
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
    });
    setPassword(value);
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Credential mismatch.");
    try {
      await register({ name: `${firstName} ${lastName}`, email, password }).unwrap();
      toast.success("Identity Created Successfully.");
      setStep(3);
    } catch (err) { toast.error("Registration packet failed to sync."); }
  };

  const GoogleAuth = () => { window.location.href = `${REACT_APP_API_URL}/auth/google`; };

  return (
    <div className="min-h-screen bg-white flex font-Outfit overflow-hidden relative selection:bg-[#048372]/20">
      <Link to="/" className="absolute top-8 right-8 z-[110] px-6 py-2.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black text-white hover:bg-black/70 transition-all uppercase tracking-widest italic flex items-center gap-2">
        <FontAwesomeIcon icon={faRotate} className="text-[10px]" /> Back to Home
      </Link>
      
      {/* 🏙️ VISUAL AUTH BARRIER (TEAL PROTOCOL) */}
      <section className="hidden lg:flex w-1/2 bg-[#1E293B] relative items-center justify-center p-20 overflow-hidden">
         <div className="absolute inset-0 opacity-40">
            <img src={SignUpBg} className="w-full h-full object-cover grayscale brightness-50" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-tr from-[#048372]/40 via-transparent to-slate-900/90"></div>
         
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 space-y-10 max-w-lg">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl">
                  <FontAwesomeIcon icon={faShieldHalved} size="lg" className="text-[#AECF5A]" />
               </div>
               <span className="text-2xl font-bold text-white italic tracking-tight uppercase">X3 Staffing Network</span>
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter leading-none mb-10">
                     Join the <span className="text-[#048372]">X3 Staffing</span> <br/>Personnel Corps.
                  </h1>
            <p className="text-lg text-slate-400 font-bold leading-relaxed italic">"Join 5,000+ personnel scaling their careers through our automated personnel logistics and high-fidelity marketplace."</p>
         </motion.div>
      </section>

      {/* 🧬 REGISTRATION INTERFACE */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
         <div className="max-w-md w-full py-12 space-y-10 relative">
            <Link to="/" className="lg:hidden absolute top-0 left-0 text-[10px] font-black text-[#048372] uppercase tracking-widest flex items-center gap-2 italic">
               <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
            </Link>
            <header className="space-y-4 text-center lg:text-left">
               <h2 className="text-4xl font-black text-slate-800 italic uppercase leading-none tracking-tighter">Personnel Registry</h2>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-8">Account Initialization Protocol</p>
            </header>

            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                     <button onClick={GoogleAuth} className="w-full py-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all font-black uppercase text-[10px] tracking-widest shadow-sm shadow-slate-100 italic">
                        <img src={GoogleIcon} className="w-5" alt="G" /> Sign up with X3 Staffing ID
                     </button>
                     <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div><div className="relative flex justify-center"><span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase italic">Or Manual Meta Registry</span></div></div>
                     <div className="space-y-6 text-left font-sans">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-Outfit">Account Email Registry</label>
                           <input type="email" placeholder="user@x3staffing.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic" value={email} onChange={e=>setEmail(e.target.value)} />
                        </div>
                        <button disabled={!email.includes('@')} onClick={()=>setStep(2)} className="w-full py-5 bg-[#048372] text-white rounded-2xl font-bold uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-[0.98] transition-all italic underline decoration-white/30">Proceed to Identity Sync</button>
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.form key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleRegister} className="space-y-8 font-sans">
                     <button onClick={()=>setStep(1)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 hover:text-[#048372] transition-all italic"><FontAwesomeIcon icon={faArrowLeft} /> Previous Epoch</button>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 text-left">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-Outfit">First Name</label>
                           <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2 text-left">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-Outfit">Last Name</label>
                           <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic" value={lastName} onChange={e=>setLastName(e.target.value)} />
                        </div>
                     </div>

                     <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-Outfit">Secure Auth Key</label>
                        <div className="relative">
                           <input type={passwordVisible ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic" value={password} onChange={e=>handlePasswordChange(e.target.value)} />
                           <button type="button" onClick={()=>setPasswordVisible(!passwordVisible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-all font-sans"><FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} /></button>
                        </div>
                     </div>

                     {password && (
                        <div className="flex flex-wrap gap-2 px-1">
                           <ValidationChip active={isPasswordValid.length} label="8+ Chars" />
                           <ValidationChip active={isPasswordValid.number} label="1 Num" />
                           <ValidationChip active={isPasswordValid.upperCase} label="1 Upper" />
                           <ValidationChip active={isPasswordValid.specialChar} label="1 Spec" />
                        </div>
                     )}

                     <div className="space-y-2 text-left">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic font-Outfit">Confirm Identity Key</label>
                        <div className="relative">
                           <input type={confirmPasswordVisible ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
                           <button type="button" onClick={()=>setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-all font-sans"><FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} /></button>
                        </div>
                     </div>

                     <button type="submit" className="w-full py-5 bg-[#048372] text-white rounded-2xl font-bold uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-[0.98] transition-all italic underline decoration-white/30">
                        {isLoading ? <PulseLoader size={6} color="white" /> : 'Authorize Sync'}
                     </button>
                  </motion.form>
               )}

               {step === 3 && (
                  <motion.div key="3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-10 font-sans">
                     <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-[#048372] mx-auto border-8 border-emerald-50 shadow-lg italic font-black text-2xl">AC</div>
                     <div className="space-y-4">
                        <h3 className="text-2xl font-bold italic uppercase text-slate-800 leading-none tracking-tight">Awaiting Pulse</h3>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed italic px-10">Verification packet transmitted to <span className="text-[#048372] underline decoration-[#048372]/20">{email}</span>. Authorize the registry to activate your Command Hub.</p>
                     </div>
                     <Link to="/signin" className="inline-block px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:brightness-110 active:scale-95 transition-all italic underline decoration-slate-400">Proceed to Login Hub</Link>
                  </motion.div>
               )}
            </AnimatePresence>

            <footer className="pt-10 border-t border-slate-50 text-center space-y-6 font-sans">
               <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed italic">By initializing, you accept the <br/><span className="text-[#048372]">X3 Staffing Standard Protocol</span> & <span className="text-[#048372]">Privacy Meta</span>.</div>
               <Link to="/signin" className="inline-block px-10 py-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-900 uppercase tracking-widest hover:bg-slate-100 transition-all italic shadow-sm">Existing Handshake?</Link>
            </footer>
         </div>
      </section>
    </div>
  );
};

const ValidationChip = ({ active, label }: any) => (
  <span className={`px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all italic font-sans ${active ? 'bg-[#048372] text-white shadow-lg shadow-[#048372]/20' : 'bg-slate-50 text-slate-300'}`}>
     {label}
  </span>
);
