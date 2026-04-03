import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  faEnvelope, faEnvelopeOpen, faCheck, faTrash, 
  faChartLine, faWallet, faUsers, faBriefcase, faFileLines, faUserTie, 
  faArrowRightFromBracket, faChevronRight, faInbox, faBellSlash, faRotate
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { LanguageToggle } from "../components/LanguageToggle";

interface Notification {
  id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const X3Messages = () => {
  const { userId, username } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/notifications/${userId}`);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("X3 Messages Sync Error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`${REACT_APP_API_URL}/notifications/read/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      toast.success("Registry Synced.");
    } catch (err) {
      toast.error("Transmission failed.");
    }
  };

  const filtered = notifications.filter(n => filter === "all" || !n.isRead);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-Outfit selection:bg-[#048372]/20 text-slate-900">
      {/* 🧭 NAVIGATION SIDEBAR */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
      <aside className={`w-64 bg-[#1E293B] flex flex-col fixed h-full z-[101] transition-all duration-350 shadow-2xl border-r border-[#048372]/10 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 justify-between border-b border-white/5 bg-[#0F172A]/30">
           <span className="font-bold tracking-tight text-lg text-white uppercase italic">X3 Staffing</span>
           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white/40 hover:text-[#AECF5A]">
              <FontAwesomeIcon icon={faRotate} className="text-xs" />
           </button>
        </div>

        <div className="px-3 py-6 flex-grow space-y-8 overflow-y-auto">
           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50">Main Menu</p>
              <nav className="space-y-1">
                 <NavI icon={faChartLine} label="Dashboard" onClick={() => { navigate('/userdashboard'); setMobileMenuOpen(false); }} />
                 <NavI icon={faWallet} label="Payments" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUsers} label="Opportunities" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faEnvelope} label="Messages" active />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50">Personnel Tools</p>
              <nav className="space-y-1">
                 <NavI icon={faBriefcase} label="Applications" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faFileLines} label="Work Logs" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUserTie} label="Identity Hub" onClick={() => { navigate('/userdetails'); setMobileMenuOpen(false); }} />
              </nav>
           </div>
        </div>

        <div className="p-4 bg-[#0F172A]/40 m-4 rounded-xl space-y-4 font-sans">
           <div className="px-2"><LanguageToggle /></div>
           <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest italic">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out X3
           </button>
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE */}
      <main className="flex-grow lg:ml-64 flex flex-col h-screen overflow-hidden">
         {/* TOP HEADER */}
         <header className="h-16 bg-white sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 shrink-0 border-b border-slate-200">
            <div className="flex items-center gap-4">
               <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg">
                  <div className="w-5 h-4 flex flex-col justify-between">
                     <div className="h-[2px] w-full bg-[#048372]"></div>
                     <div className="h-[2px] w-4/5 bg-[#048372]"></div>
                     <div className="h-[2px] w-full bg-[#048372]"></div>
                  </div>
               </button>
               <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-sans hidden sm:block">Communications Registry</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-[#048372] flex items-center justify-center text-[10px] font-bold uppercase text-white shadow-lg">
                  {username?.charAt(0)}
               </div>
            </div>
         </header>

         {/* DASH UI CORE VIEW */}
         <div className="flex-grow overflow-y-auto">
            {/* 🟦 VIBRANT HERO BAR (COMPANY TEAL) */}
            <div className="bg-[#048372] px-6 lg:px-10 pt-8 lg:pt-10 pb-24 lg:pb-32 relative overflow-hidden">
               <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">X3 Messages</h1>
                    <p className="text-emerald-50/60 text-xs font-medium italic">Synced Personnel Communications & System Alerts</p>
                  </div>
                  <div className="flex bg-white/10 p-1 rounded-lg backdrop-blur-md">
                    <button onClick={() => setFilter("all")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${filter === "all" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>All Transmissions</button>
                    <button onClick={() => setFilter("unread")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${filter === "unread" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>Unread Syncs</button>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-12 lg:-mt-20 space-y-8 pb-10">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                     <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2 font-sans">
                        <FontAwesomeIcon icon={faInbox} className="text-[#048372]" /> Inbox Registry
                     </h2>
                     <button onClick={fetchNotifications} className="text-xs font-bold text-slate-400 hover:text-[#048372] transition-colors font-sans uppercase tracking-tight">Refresh Sync</button>
                  </div>

                  <div className="divide-y divide-slate-100">
                     {isFetching ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4 text-slate-400">
                           <PulseLoader color="#048372" size={8} />
                           <p className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Tracing Transmissions...</p>
                        </div>
                     ) : filtered.length > 0 ? (
                        filtered.map((notif, idx) => (
                           <motion.div 
                             key={notif.id} 
                             initial={{ opacity: 0, x: -10 }} 
                             animate={{ opacity: 1, x: 0 }} 
                             transition={{ delay: idx * 0.05 }}
                             className={`p-6 flex items-center justify-between group transition-all hover:bg-slate-50/80 ${!notif.isRead ? "bg-emerald-50/20 border-l-4 border-l-[#048372]" : "border-l-4 border-l-transparent"}`}
                           >
                              <div className="flex items-start gap-5">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm border ${!notif.isRead ? "bg-emerald-50 text-[#048372] border-emerald-100 shadow-inner" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                    <FontAwesomeIcon icon={!notif.isRead ? faEnvelope : faEnvelopeOpen} />
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                       <span className="text-[10px] font-bold text-[#048372] uppercase tracking-widest mb-1 italic opacity-70">{notif.type || "SYSTEM"}</span>
                                       <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                       <span className="text-[10px] text-slate-400 font-medium font-sans">{new Date(notif.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className={`text-sm leading-relaxed font-sans ${!notif.isRead ? "font-bold text-slate-800" : "font-medium text-slate-500 italic"}`}>
                                       {notif.message}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3">
                                 {!notif.isRead && (
                                    <button 
                                      onClick={() => markAsRead(notif.id)}
                                      className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-[#048372] hover:border-[#048372]/20 rounded-lg transition-all shadow-sm flex items-center gap-2 group/btn font-sans"
                                    >
                                       <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                       <span className="text-[9px] font-bold uppercase tracking-tight hidden group-hover/btn:block">Mark Read</span>
                                    </button>
                                 )}
                                 <button className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-lg transition-all shadow-sm">
                                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                 </button>
                                 <FontAwesomeIcon icon={faChevronRight} className="text-slate-100 text-xs ml-4" />
                              </div>
                           </motion.div>
                        ))
                     ) : (
                        <div className="py-40 flex flex-col items-center justify-center gap-6 opacity-30 select-none grayscale">
                           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                              <FontAwesomeIcon icon={faBellSlash} size="2xl" />
                           </div>
                           <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 italic">Registry_Clear</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

const NavI = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group relative ${active ? 'bg-[#048372] text-white font-bold shadow-lg text-[13px]' : 'text-slate-400 hover:text-white hover:bg-white/5 text-[13px]'}`}>
    <FontAwesomeIcon icon={icon} className={`text-sm w-5 transition-all ${active ? 'scale-110' : 'opacity-40 group-hover:opacity-100'}`} />
    <span className="text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] font-sans">{label}</span>
  </button>
);
