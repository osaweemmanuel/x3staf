import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  faSearch, faBriefcase, faLocationArrow, faMoneyBillWave, 
  faRotate, faShieldHalved, faUsers, faTruckMoving, faBolt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { REACT_APP_API_URL } from "../../constants";
import useAuth from "../hooks/useAuth";

export const JobSeekers = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 🛡️ Icon Mapping Registry for Professional Persona
  const getJobIcon = (dept: string, title: string) => {
    const d = (dept || "").toLowerCase();
    const t = (title || "").toLowerCase();
    if (d.includes('skilled') || t.includes('electrician') || t.includes('plumber')) return faBolt;
    if (d.includes('management') || t.includes('coordinator')) return faUsers;
    if (d.includes('heavy') || t.includes('operator')) return faTruckMoving;
    return faBriefcase;
  };

  const sanitizeText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/###/g, '')
      .replace(/\?\?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\?/g, '')
      .trim();
  };

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/jobs`);
        const fetchedJobs = Array.isArray(res.data) ? res.data : (res.data?.jobs || []);
        console.log(`DEBUG: Jobs Received: ${fetchedJobs.length}`, fetchedJobs);
        setJobs(fetchedJobs);
      } catch (e) {
        console.error("Marketplace Sync Failed:", e);
      } finally { setIsSyncing(false); }
    };
    fetchMarketplace();
  }, []);

  const filtered = (jobs || []).filter(j => 
    (j.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (j.address || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-Outfit selection:bg-[#048372]/10">
      {/* 🏙️ MARKETPLACE HERO */}
      {/* 🏙️ MARKETPLACE HERO */}
      <section className="bg-slate-900 pt-48 pb-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-[#048372]/20 to-transparent opacity-50"></div>
         <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#AECF5A]/10 border border-[#AECF5A]/20 rounded-full"
            >
               <div className="w-2 h-2 bg-[#AECF5A] rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-[#AECF5A] uppercase tracking-[0.2em] italic">X3 Registry Live</span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight italic uppercase">
               Find Your Next <br/><span className="text-[#048372]">Career Sequence</span>
            </h1>
            <div className="max-w-2xl mx-auto relative mt-12">
               <input 
                 type="text" 
                 placeholder="Search by role, location, or department..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-medium outline-none focus:ring-4 ring-[#048372]/20 transition-all font-sans italic"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <FontAwesomeIcon icon={faSearch} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#048372]/60" />
            </div>
         </div>
      </section>

      {/* 📊 OPPORTUNITY GRID */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 pb-32 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isSyncing ? (
               [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm" />)
            ) : filtered.length > 0 ? filtered.map((job) => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 key={job.id} 
                 className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#048372] transition-all hover:shadow-xl hover:shadow-[#048372]/5 group relative overflow-hidden italic"
               >
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-[9px] font-black text-[#048372] uppercase tracking-widest bg-[#048372]/5 px-2.5 py-1 rounded-md mb-2 inline-block italic border border-[#048372]/10">
                           {job.employmentType}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#048372] transition-colors leading-tight italic font-sans italic">{job.title}</h3>
                     </div>
                     <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#048372] text-lg font-bold shadow-sm group-hover:bg-[#048372] group-hover:text-white transition-all transform group-hover:rotate-6">
                        <FontAwesomeIcon icon={getJobIcon(job.department, job.title)} />
                     </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 italic">
                        <FontAwesomeIcon icon={faLocationArrow} className="text-[#048372]/40" />
                        <span>{job.address}</span>
                     </div>
                     <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 italic">
                        <FontAwesomeIcon icon={faBriefcase} className="text-[#AECF5A]/40" />
                        <span>{job.department}</span>
                     </div>
                  </div>

                  <div className="space-y-4 mb-6 flex-grow">
                     <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 italic">
                        <div className="flex items-center gap-2">
                           <FontAwesomeIcon icon={faLocationArrow} className="text-[#048372]/60 w-3" />
                           <span>{job.address}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                           <FontAwesomeIcon icon={faBriefcase} className="text-[#AECF5A]/60 w-3" />
                           <span>{job.department}</span>
                        </div>
                     </div>

                     <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-4">
                        <div>
                           <p className="text-[10px] font-black text-[#048372] uppercase tracking-[0.2em] mb-2 italic flex items-center gap-2">
                              <span className="w-4 h-[1px] bg-[#048372]/20"></span> Core Assignment Mission
                           </p>
                           <p className="text-[11px] text-slate-600 leading-relaxed italic font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                              {sanitizeText(job.description || "")}
                           </p>
                        </div>
                        
                        {job.requirements && (
                           <div className="pt-4 border-t border-slate-200/40">
                              <p className="text-[10px] font-black text-[#AECF5A] uppercase tracking-[0.2em] mb-3 italic flex items-center gap-2">
                                 <span className="w-4 h-[1px] bg-[#AECF5A]/40"></span> Professional Requirements
                              </p>
                              <div className="space-y-1.5 font-sans">
                                 {sanitizeText(job.requirements).split('\n').slice(0, 4).map((req: string, idx: number) => (
                                    req.trim() && (
                                       <div key={idx} className="flex items-start gap-2 text-[10.5px] text-slate-500 font-medium italic">
                                          <div className="w-1 h-1 rounded-full bg-[#AECF5A] mt-1.5 shrink-0" />
                                          <span>{req.trim()}</span>
                                       </div>
                                    )
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight italic pt-1">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm text-[#048372]">
                           {job.minimumExperience}y+ EXP REQUIRED
                        </span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                     <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60 italic font-sans">Compensation Registry</p>
                        <p className="text-sm font-black text-slate-900 flex items-center gap-2 italic">
                           <FontAwesomeIcon icon={faMoneyBillWave} className="text-[#048372] text-xs" />
                           <span className="px-2 py-0.5 bg-[#048372]/5 text-[#048372] rounded text-xs border border-[#048372]/10 uppercase font-black">
                              {job.compensation}
                           </span>
                        </p>
                     </div>
                     <button 
                        onClick={() => navigate(isLoggedIn ? '/jobopenings' : '/signin')} 
                        className="px-8 py-3.5 bg-[#048372] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#048372]/20 hover:shadow-[#048372]/40 hover:brightness-110 active:scale-95 transition-all italic font-sans"
                     >
                        {isLoggedIn ? "Dispatch Apply" : "Sign In & Apply"}
                     </button>
                  </div>
               </motion.div>
            )) : (
               <div className="col-span-full py-32 text-center opacity-30 select-none">
                  <FontAwesomeIcon icon={faRotate} className="text-4xl animate-spin-slow mb-4 text-slate-300" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">No sequences found.</p>
               </div>
            )}
         </div>
      </section>

      {/* 📬 CONVERSION BAR */}
      <section className="bg-[#048372] py-24 px-6 text-center text-white relative overflow-hidden">
         <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">Ready for the <span className="text-black font-black">X3 Standard?</span></h2>
            <p className="text-emerald-50/70 font-bold max-w-xl mx-auto leading-relaxed italic">"Join the nation's most elite personnel registry. Secure roles, verify hours, and get paid with industry-leading protocol."</p>
            <div className="flex flex-wrap justify-center gap-6">
               <button onClick={() => navigate('/register')} className="px-10 py-5 bg-white text-[#048372] rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all italic underline decoration-[#048372]/20">Create Hub Account</button>
               <button onClick={() => navigate('/contact')} className="px-10 py-5 bg-black/20 border border-white/20 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black/30 transition-all italic">Speak to Dispatch</button>
            </div>
         </div>
         <FontAwesomeIcon icon={faShieldHalved} className="absolute bottom-[-100px] right-[-50px] text-[300px] text-white/5 rotate-12" />
      </section>
    </div>
  );
};
