import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  faShieldHalved, faChartLine, faUsers, faEnvelope, faBriefcase,
  faFileLines, faUserTie, faArrowRightFromBracket, faSearch, faChevronRight,
  faRotate, faBell, faWallet, faCloudArrowUp, faIdCard, faFileSignature
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useSelector } from "react-redux";
import { X3Logo } from "../components/X3Logo";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { selectLanguage } from "../auth/languageSlice";
import { LanguageToggle } from "../components/LanguageToggle";
import { WorkReceipt } from "../components/WorkReceipt";

interface TimesheetData {
  id: string; userId: string; jobId: string; weekEnding: string;
  screenshot: string; status: string; createdAt: string;
}

interface JobApp {
  id: string; jobId: string; status: string; createdAt: string;
  Job: { title: string; };
}

interface Job {
  id: string; title: string; address: string; province?: string;
  compensation: string; department: string; employmentType: string;
  closingDate?: string;
}

interface KYCDoc {
  id: string; documentType: string; status: string; createdAt: string;
}

export const UserDashboard = () => {
  const { userId, username } = useAuth();
  const navigate = useNavigate();
  useSelector(selectLanguage);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [applications, setApplications] = useState<JobApp[]>([]);
  const [showReceipt, setShowReceipt] = useState<TimesheetData | null>(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<KYCDoc[]>([]);
  const [timesheets, setTimesheets] = useState<TimesheetData[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Registry Handshake

  useEffect(() => {
    const fetchCoreData = async () => {
      try {
        const [jobsRes, profileRes, notifRes, appRes, kycRes, tsRes] = await Promise.all([
          axios.get(`${REACT_APP_API_URL}/jobs`),
          axios.get(`${REACT_APP_API_URL}/userProfiles/${userId}`),
          axios.get(`${REACT_APP_API_URL}/notifications/${userId}`),
          axios.get(`${REACT_APP_API_URL}/jobApp/user/${userId}`),
          axios.get(`${REACT_APP_API_URL}/kyc/user/${userId}`),
          axios.get(`${REACT_APP_API_URL}/timesheet/user/${userId}`)
        ]);
        setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.jobs || []));
        setUserProfile(profileRes.data);
        setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
        setApplications(Array.isArray(appRes.data) ? appRes.data : []);
        setKycDocs(Array.isArray(kycRes.data) ? kycRes.data : []);
        setTimesheets(Array.isArray(tsRes.data) ? tsRes.data : []);
      } catch (e) {
        console.error("X3 Sync Error:", e);
      } finally { }
    };
    fetchCoreData();
  }, [userId]);

  useEffect(() => {
    if (userProfile) {
      const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'city', 'role'];
      const filled = fields.filter(f => userProfile[f]).length;
      setProfileCompleteness((filled / fields.length) * 100);
    }
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-Outfit selection:bg-[#048372]/20 text-slate-900">
      {/* 🧭 NAVIGATION SIDEBAR */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
      <aside className={`w-64 bg-[#1E293B] flex flex-col fixed h-full z-[101] transition-all duration-350 shadow-2xl border-r border-[#048372]/10 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 justify-between border-b border-white/5 bg-[#0F172A]/30">
           <X3Logo light className="h-6" />
           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white/40 hover:text-[#AECF5A]">
              <FontAwesomeIcon icon={faRotate} className="text-xs" />
           </button>
        </div>

        <div className="px-3 py-6 flex-grow space-y-8 overflow-y-auto italic">
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">Main Registry</p>
              <nav className="space-y-1">
                 <NavI icon={faChartLine} label="Dashboard" active />
                 <NavI icon={faWallet} label="Payments" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUsers} label="Opportunities" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faEnvelope} label="Messages" onClick={() => { navigate('/messages'); setMobileMenuOpen(false); }} badge={notifications.filter(n => !n.isRead).length} />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">Personnel Assets</p>
              <nav className="space-y-1">
                 <NavI icon={faBriefcase} label="Applications" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faFileLines} label="Work Logs" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUserTie} label="Identity Vault" onClick={() => { navigate('/userdetails'); setMobileMenuOpen(false); }} />
              </nav>
           </div>
        </div>

        <div className="p-4 bg-[#0F172A]/40 m-4 rounded-xl space-y-4">
           <div className="px-2"><LanguageToggle /></div>
           <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest italic font-sans italic">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out X3
           </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-grow lg:ml-64 flex flex-col h-screen overflow-hidden">
         {/* WHITE TOP HEADER */}
         <header className="h-16 bg-white sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 shrink-0 border-b border-slate-200">
            <div className="flex items-center gap-4">
               <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg">
                  <div className="w-5 h-4 flex flex-col justify-between">
                     <div className="h-[2px] w-full bg-[#048372]"></div>
                     <div className="h-[2px] w-4/5 bg-[#048372]"></div>
                     <div className="h-[2px] w-full bg-[#048372]"></div>
                  </div>
               </button>
               <div className="relative w-48 sm:w-96 group">
                  <input 
                    type="text" 
                    placeholder="Search assignments..." 
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[11px] font-bold outline-none focus:ring-2 ring-[#048372]/10 transition-all font-sans italic"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-slate-400 hover:bg-slate-50 relative border border-slate-100">
                  <FontAwesomeIcon icon={faBell} />
                  {notifications.some(n => !n.isRead) && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />}
               </button>
               <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white bg-[#048372] flex items-center justify-center text-[10px] font-bold uppercase text-white shadow-xl italic shadow-[#048372]/20">
                  {username?.charAt(0)}
               </div>
            </div>
         </header>

         {/* DASH UI CORE VIEW */}
         <div className="flex-grow overflow-y-auto">
            {/* 🟦 VIBRANT HERO BAR (COMPANY TEAL) */}
            <div className="bg-[#048372] px-6 lg:px-10 pt-8 lg:pt-10 pb-24 lg:pb-32 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">X3 Personnel</h1>
                    <p className="text-emerald-50/60 text-xs font-medium">System Registry Monitoring & Compliance Control</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => navigate('/timesheet')} className="px-5 py-2.5 bg-white text-[#048372] rounded-lg text-xs font-bold shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                       <FontAwesomeIcon icon={faFileSignature} /> Upload Timesheet
                    </button>
                    <button onClick={() => navigate('/kyc')} className="px-5 py-2.5 bg-black/20 text-white rounded-lg text-xs font-bold shadow-xl hover:bg-black/30 backdrop-blur-md transition-all flex items-center gap-2 border border-white/10">
                       <FontAwesomeIcon icon={faCloudArrowUp} /> Identity Sync
                    </button>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-12 lg:-mt-20 space-y-8 pb-10">
               {/* 📊 STATS GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <X3Stat label="Projects" val={applications.length} sub="Active Assignments" icon={faBriefcase} color="text-[#048372] bg-[#048372]/10" />
                  <X3Stat label="Verified Assets" val={kycDocs.filter(d => d.status === 'Verified').length} sub="Identity Integrity" icon={faShieldHalved} color="text-emerald-600 bg-emerald-50" />
                  <X3Stat label="System Status" val="Active" sub="Sync OK" icon={faChartLine} color="text-[#048372] bg-[#048372]/10" />
                  <X3Stat label="Profile Score" val={`${Math.round(profileCompleteness)}%`} sub="System Maturity" icon={faUserTie} color="text-amber-600 bg-amber-50" />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                   {/* 📂 ACTIVE PROJECTS TABLE */}
                   <div className="xl:col-span-8 space-y-8">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic font-sans">Payment & Work Ledger</h2>
                           <span className="text-[10px] font-bold text-[#048372] bg-[#048372]/10 px-3 py-1 rounded-md uppercase italic font-sans">{timesheets.length} Verified Records</span>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left font-sans">
                              <thead>
                                 <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4">Registry Period</th>
                                    <th className="px-6 py-4">Financial Status</th>
                                    <th className="px-6 py-4 text-right">Action Hub</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {timesheets.length > 0 ? timesheets.map((ts) => (
                                    <tr key={ts.id} className="hover:bg-slate-50/60 transition-colors group">
                                       <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                             <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs bg-slate-800 shadow-lg italic`}>
                                                TS
                                             </div>
                                             <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-[#048372] transition-colors font-sans uppercase italic">Week Ending {ts.weekEnding}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Digital Receipt ID: #{ts.id.slice(-8).toUpperCase()}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-tight border ${
                                             ts.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                                          }`}>
                                             {ts.status === 'Approved' ? 'Verified / Disbursed' : ts.status}
                                          </span>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          {ts.status === 'Approved' ? (
                                             <button onClick={() => setShowReceipt(ts)} className="px-4 py-2 bg-[#048372] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg italic hover:brightness-110 active:scale-95 transition-all">Download Receipt</button>
                                          ) : (
                                             <span className="text-[9px] text-slate-300 font-bold uppercase italic">Awaiting Audit</span>
                                          )}
                                       </td>
                                    </tr>
                                 )) : (
                                    <tr>
                                       <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic text-[10px] uppercase tracking-widest">No verified work records found in registry.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                      </div>

                      {/* 📡 LIVE MISSION PULSE */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                         <div className="p-6 border-b border-slate-100 bg-[#1E293B] text-white flex items-center justify-between">
                            <div>
                               <h3 className="text-[10px] font-black text-[#AECF5A] uppercase tracking-[0.4em] italic mb-1">Live Mission Pulse</h3>
                               <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest italic">Global Marketplace Flux</p>
                            </div>
                            <FontAwesomeIcon icon={faRotate} className="animate-spin text-[#AECF5A] opacity-20" />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-100">
                            {jobs.filter(j => !j.closingDate || new Date(j.closingDate) >= new Date()).slice(0, 3).map((job)=>(
                               <div key={job.id} className="p-6 hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => navigate('/jobopenings')}>
                                  <div className="w-8 h-8 bg-[#048372]/10 text-[#048372] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#048372] group-hover:text-white transition-all shadow-inner border border-[#048372]/10">
                                     <FontAwesomeIcon icon={faBriefcase} className="text-xs" />
                                  </div>
                                  <h4 className="text-xs font-black text-slate-800 uppercase italic mb-2 tracking-tight group-hover:text-[#048372] line-clamp-1">{job.title}</h4>
                                  <div className="flex items-center gap-2 mb-4">
                                     <FontAwesomeIcon icon={faRotate} className="text-[8px] text-[#AECF5A]" />
                                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">New Sync</span>
                                  </div>
                                  <p className="text-[10px] font-bold text-[#048372] italic uppercase underline decoration-[#048372]/20">Apply Protocol_</p>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* 📂 IDENTITY VAULT WIDGET */}
                   <div className="xl:col-span-4 space-y-8">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                         <h3 className="text-[10px] font-black text-slate-800 mb-8 flex items-center justify-between uppercase tracking-widest italic">
                            Identity Hub Registry
                            <span className="text-[8px] font-black text-[#048372] bg-[#048372]/5 px-2.5 py-1 rounded-md border border-[#048372]/10">SECURED</span>
                         </h3>
                         <div className="space-y-4 font-sans">
                            {kycDocs.length > 0 ? kycDocs.map(doc => (
                               <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-all border border-slate-100 hover:border-[#048372]/20 italic">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} shadow-inner border border-white`}>
                                        <FontAwesomeIcon icon={faIdCard} />
                                     </div>
                                     <div>
                                        <p className="text-[11px] font-black text-slate-800 tracking-tight uppercase italic">{doc.documentType}</p>
                                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em]">{doc.status}</p>
                                     </div>
                                  </div>
                                  <FontAwesomeIcon icon={faChevronRight} className="text-slate-200 text-xs group-hover:text-[#048372] transition-colors" />
                               </div>
                            )) : (
                               <div className="py-14 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-200">
                                     <FontAwesomeIcon icon={faCloudArrowUp} className="text-slate-200" />
                                  </div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Registry_Void</p>
                               </div>
                            )}
                            <button onClick={() => navigate('/kyc')} className="w-full py-4 bg-[#048372] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-95 transition-all mt-4 italic font-sans">Sync Identity Registry</button>
                         </div>
                      </div>

                      <div className="bg-[#1E293B] rounded-xl p-8 text-white relative shadow-2xl overflow-hidden group border border-white/5">
                         <FontAwesomeIcon icon={faShieldHalved} className="absolute bottom-[-20px] right-[-20px] text-8xl text-emerald-500/5 transition-transform duration-700 group-hover:rotate-12" />
                         <h3 className="text-[10px] font-black text-[#AECF5A] uppercase tracking-[0.4em] mb-4 italic">Personnel Integrity Pulse</h3>
                         <p className="text-xs font-bold text-slate-300 leading-relaxed italic mb-8 opacity-80 group-hover:opacity-100 transition-opacity">"All digital work logs and identity registries are encrypted via X3 Shield Protocols."</p>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${profileCompleteness}%` }} transition={{ duration: 2 }} className="h-full bg-[#AECF5A] shadow-[0_0_15px_rgba(174,207,90,0.6)]"></motion.div>
                         </div>
                         <div className="mt-4 flex justify-between text-[8px] font-black uppercase tracking-widest text-[#AECF5A]/50 italic">
                            <span>Maturity Index</span>
                            <span>{Math.round(profileCompleteness)}% Pulse</span>
                         </div>
                      </div>
                   </div>
                </div>
            </div>
         </div>
      </main>

      <AnimatePresence>
        {showReceipt && (
           <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-sm">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-xl w-full">
                 <WorkReceipt data={showReceipt} onClose={() => setShowReceipt(null)} />
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavI = ({ icon, label, active, onClick, badge, badgeColor }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group relative ${active ? 'bg-[#048372] text-white font-bold shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    <FontAwesomeIcon icon={icon} className={`text-sm w-5 transition-all ${active ? 'scale-110' : 'opacity-40 group-hover:opacity-100'}`} />
    <span className="text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] font-sans">{label}</span>
    {badge && <span className={`absolute right-4 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${badgeColor || 'bg-rose-500 text-white shadow-sm font-sans'}`}>{badge}</span>}
  </button>
);

const X3Stat = ({ label, val, sub, icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 group hover:shadow-md transition-all cursor-default relative overflow-hidden">
     <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 opacity-60">{label}</p>
           <h3 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">{val}</h3>
        </div>
        <div className={`w-10 h-10 ${color || 'bg-emerald-50 text-[#048372]'} rounded-lg flex items-center justify-center text-lg shadow-sm border border-black/5`}>
           <FontAwesomeIcon icon={icon} />
        </div>
     </div>
     <p className="text-[10px] font-medium text-slate-400 tracking-tight italic relative z-10">{sub}</p>
  </div>
);
