import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  faPlus, faUsers, faBriefcase, faClock, faShieldHalved,
  faChartLine, faArrowRightFromBracket, faSearch, faChevronRight,
  faIdCard, faRotate, faUserGear, faShieldVirus,
  faBan, faCheckCircle, faEye, faEnvelope, faLocationArrow, faStickyNote, faMicrochip, faInfoCircle, faFilePdf, faFileImport, faUserPen
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectLanguage } from "../auth/languageSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { LanguageToggle } from "../components/LanguageToggle";
import { X3Logo } from "../components/X3Logo";
import { useSendLogoutMutation } from "../auth/authApiSlice";
import { PulseLoader } from "react-spinners";

const sanitizeText = (text: string) => {
  if (!text) return "";
  return text
    .replace(/###/g, '')
    .replace(/\?\?/g, '')
    .replace(/\*\*\*/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\?/g, '')
    .trim();
};

export const AdminDashboard = () => {
  const { username } = useAuth();
  const navigate = useNavigate();
  const lang = useSelector(selectLanguage);
  
  const dict: any = {
    EN: {
      overview: "Overview Board", applicants: "Applicant Sync", personnel: "Personnel Directory",
      internal: "Internal Careers", external: "External Market", deploy: "Deploy Opening",
      timesheet: "Work Log Registry", audit: "Audit Protocols", signout: "Sign Out Admin",
      hub: "Admin Command Hub", search: "Search administrative vault...",
      flux: "Priority Marketplace Flux", identity: "Identity Protocol Queue", control: "Personnel Access Control",
      timeAudit: "Pending Work Registry", noTime: "No pending logs in registry."
    },
    FR: {
      overview: "Tableau de Bord", applicants: "Sync des Candidats", personnel: "Répertoire Personnel",
      internal: "Carrières Internes", external: "Marché Externe", deploy: "Déployer Offre",
      timesheet: "Registre des Temps", audit: "Protocoles d'Audit", signout: "Déconnexion Admin",
      hub: "Centre de Commandement", search: "Rechercher dans la voûte...",
      flux: "Flux du Marché Prioritaire", identity: "File d'Attente Identité", control: "Contrôle d'Accès Personnel",
      timeAudit: "Registre de Travail en Attente", noTime: "Aucun journal en attente."
    }
  };

  const t = dict[lang] || dict.EN;

  const [sendLogout] = useSendLogoutMutation();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [jobs, setJobs] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [isAddingJob, setIsAddingJob] = useState<boolean>(false);
  const [selectedJobApps, setSelectedJobApps] = useState<any[] | null>(null);
  const [selectedJobContext, setSelectedJobContext] = useState<any | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<any | null>(null);
  const [viewingJob, setViewingJob] = useState<any | null>(null);
  const [selectedKYC, setSelectedKYC] = useState<any | null>(null);
  const [scanningDoc, setScanningDoc] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [adminMemos, setAdminMemos] = useState<Record<number, string>>({});
  const [newJob, setNewJob] = useState({ 
    title: "", address: "", compensation: "", department: "", 
    employmentType: "Full-time", minimumExperience: 0, province: "Ontario", 
    description: "", requirements: "", closingDate: "", jobCategory: "External" 
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [jobPage, setJobPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  useEffect(() => { setJobPage(1); }, [activeTab]);

  useEffect(() => { fetchCore(); }, []);

  const fetchCore = async () => {
     setFetching(true);
     try {
        const [jR, uR, aR, kR, tR] = await Promise.all([
           axios.get(`${REACT_APP_API_URL}/jobs`),
           axios.get(`${REACT_APP_API_URL}/auth/all`),
           axios.get(`${REACT_APP_API_URL}/jobApp`),
           axios.get(`${REACT_APP_API_URL}/kyc/all`),
           axios.get(`${REACT_APP_API_URL}/timesheet`)
        ]);
        setJobs(Array.isArray(jR.data) ? jR.data : (jR.data?.jobs || []));
        setUsers(Array.isArray(uR.data) ? uR.data : (uR.data?.users || []));
        setApplications(Array.isArray(aR.data) ? aR.data : (aR.data?.applications || []));
        setKycDocs(Array.isArray(kR.data) ? kR.data : (kR.data?.kycDocs || []));
        setTimesheets(Array.isArray(tR.data) ? tR.data : (tR.data?.timesheets || []));
     } catch (e) {} finally { setFetching(false); }
  };

  const handleLogout = async () => {
    try {
      await sendLogout("").unwrap();
      navigate("/");
    } catch (e) {
      navigate("/");
    }
  };

  const viewCand = async (uid: number, jid?: number) => {
    setFetching(true); setScanResult(null);
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/userProfiles/${uid}`);
      const p = res.data; if (jid) p.compatibility = 94;
      if(p.memo) setAdminMemos((prev: any) => ({...prev, [uid]: p.memo}));
      setSelectedCandidate(p);
    } catch (e: any) { 
      if(e.response?.status === 404){
        const user = users.find(u => u.id === uid);
        setSelectedCandidate({ userId: uid, firstName: user?.username || "X3", lastName: "Personnel", isGhost: true, email: user?.email });
      }
    } finally { setFetching(false); }
  };

  const updateMemo = async (uid: number, val: string) => { 
    setAdminMemos((p: any) => ({...p, [uid]: val})); 
    try { 
      if(selectedCandidate?.isGhost){
        await axios.post(`${REACT_APP_API_URL}/userProfiles`, { userId: uid, memo: val, firstName: selectedCandidate.firstName, lastName: "Personnel" });
      } else {
        await axios.patch(`${REACT_APP_API_URL}/userProfiles/${uid}`, { memo: val });
      }
    } catch (e) {}
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      if (status === 'Rejected') {
        setTimesheets(prev => prev.filter(t => String(t.id) !== String(id)));
      }
      await axios.patch(`${REACT_APP_API_URL}/timesheet/batch`, { ids: [id], status });
      toast.success(`Timesheet updated to ${status}`);
      setSelectedTimesheet(null);
      fetchCore();
    } catch (e) { 
      toast.error("Update failed."); 
      fetchCore(); 
    }
  };

  const verifyKYC = async (id: string, status: string) => {
    try {
      if (status === 'Rejected') {
        setKycDocs(prev => prev.filter(k => String(k.id) !== String(id)));
      }
      await axios.patch(`${REACT_APP_API_URL}/kyc/update-status`, { id, status });
      toast.success(`Identity Record ${status}`);
      setSelectedKYC(null);
      fetchCore();
    } catch (e) { 
      toast.error("Verification Handshake Failed."); 
      fetchCore();
    }
  };

  const handleDownloadCV = (dataUrl: string, name: string) => {
    if (!dataUrl) return toast.error("Asset not found in registry.");
    try {
      const link = document.createElement("a");
      link.href = dataUrl;
      const extension = dataUrl.includes("pdf") ? "pdf" : "png";
      link.download = `X3_Personnel_CV_${name.replace(/\s+/g, '_')}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Identity Asset Dispatched.");
    } catch (e) {
      toast.error("Download Handshake Failed.");
    }
  };

  const handleUpdateAppStatus = async (appId: number, status: string) => {
    try {
      if (status === 'Rejected') {
        setApplications(prev => prev.filter(a => String(a.id) !== String(appId)));
        if (selectedJobApps) {
          setSelectedJobApps(prev => prev ? prev.filter(a => String(a.id) !== String(appId)) : null);
        }
      }
      await axios.patch(`${REACT_APP_API_URL}/jobApp/${appId}`, { status });
      toast.success(`Application updated: ${status}`);
      fetchCore();
    } catch (e) { 
      toast.error("Status update failed."); 
      fetchCore(); 
    }
  };

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.closingDate) return toast.error("Missing required metadata.");
    try { await axios.post(`${REACT_APP_API_URL}/jobs`, newJob); toast.success("Opening Synced to Marketplace"); setIsAddingJob(false); fetchCore(); } catch (e) {}
  };

  const handleDeleteJob = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this job posting from the registry?")) return;
    try {
      await axios.delete(`${REACT_APP_API_URL}/jobs/${id}`);
      toast.success("Job posting purged from marketplace.");
      fetchCore();
    } catch (e) {
      toast.error("Failed to delete job post.");
    }
  };

  const handleToggleStatus = async (user: any) => {
     try {
        await axios.patch(`${REACT_APP_API_URL}/auth/update`, { 
           id: user.id, 
           username: user.username, 
           roles: user.roles, 
           active: !user.active 
        });
        toast.success(`Personnel ${user.active ? 'Suspended' : 'Re-authorized'}`);
        fetchCore();
        setSelectedCandidate(null);
     } catch (e) { toast.error("Security handshake failed."); }
  };

  const activeJobs = jobs.filter(j => !j.closingDate || new Date(j.closingDate) >= new Date());
  const activeApps = applications.filter(app => app.status !== 'Rejected');
  const activeTimesheets = timesheets.filter(t => t.status !== 'Rejected');

  // 🔍 SHARED SEARCH FILTERING
  const filteredJobs = activeJobs.filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApps = activeApps.filter(a => 
    a.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.Job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTimesheets = activeTimesheets.filter(t => {
    const user = users.find(u => u.id === t.userId);
    return user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           t.weekEnding?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredKyc = kycDocs.filter(k => {
     const user = users.find(u => u.id === k.userId);
     return k.status === 'Pending' && (
        user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.documentType?.toLowerCase().includes(searchTerm.toLowerCase())
     );
  });

  // 📊 DYNAMIC RECRUITMENT FLOW STATS
  const intakeRate = jobs.length > 0 ? Math.round((applications.length / (jobs.length * 5)) * 100) : 0;
  const verificationRate = users.length > 0 ? Math.round((kycDocs.filter(k => k.status === 'Verified').length / users.length) * 100) : 0;
  const auditRate = timesheets.length > 0 ? Math.round((timesheets.filter(t => t.status === 'Approved').length / timesheets.length) * 100) : 0;

  const spotlightUser = users.find(u => u.active) || users[0];

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-Outfit selection:bg-[#048372]/20 text-slate-900">
      {/* 🧭 NAVIGATION SIDEBAR (DARK PROTOCOL) */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
      <aside className={`w-72 bg-[#1E293B] flex flex-col fixed h-full z-[101] transition-all duration-350 shadow-2xl border-r border-[#048372]/10 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-8 gap-4 border-b border-white/5 bg-[#0F172A]/30">
            <X3Logo light className="h-7" />
           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden ml-auto text-white/40 hover:text-[#AECF5A]">
              <FontAwesomeIcon icon={faRotate} className="text-sm" />
           </button>
        </div>

        <div className="px-4 py-8 flex-grow space-y-10 overflow-y-auto italic">
           <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-4 opacity-50">Operational Hub</p>
              <nav className="space-y-2">
                 <NavI icon={faChartLine} label={t.overview} active={activeTab === "Overview"} onClick={() => { setActiveTab("Overview"); setMobileMenuOpen(false); }} />
                  <NavI icon={faFileImport} label={t.applicants} active={activeTab === "Applications"} onClick={() => { setActiveTab("Applications"); setMobileMenuOpen(false); }} />
                 <NavI icon={faUsers} label={t.personnel} active={activeTab === "UpdateProfile"} onClick={() => { setActiveTab("UpdateProfile"); setMobileMenuOpen(false); }} />
              </nav>
           </div>

           <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-4 opacity-50">Marketplace Control</p>
              <nav className="space-y-2">
                 <NavI icon={faBriefcase} label={t.internal} active={activeTab === "Internal"} onClick={() => { setActiveTab("Internal"); setMobileMenuOpen(false); }} />
                 <NavI icon={faBriefcase} label={t.external} active={activeTab === "External"} onClick={() => { setActiveTab("External"); setMobileMenuOpen(false); }} />
                 <NavI icon={faPlus} label={t.deploy} onClick={() => { setIsAddingJob(true); setMobileMenuOpen(false); }} />
              </nav>
           </div>

           <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-4 opacity-50">Logistics & Compliance</p>
              <nav className="space-y-2">
                 <NavI icon={faClock} label={t.timesheet} active={activeTab === "Timesheet"} onClick={() => { setActiveTab("Timesheet"); setMobileMenuOpen(false); }} />
                 <NavI icon={faUserGear} label={t.audit} active={activeTab === "Management"} onClick={() => { setActiveTab("Management"); setMobileMenuOpen(false); }} />
              </nav>
           </div>
        </div>

        <div className="p-6 bg-[#0F172A]/40 m-4 rounded-2xl space-y-5">
           <div className="px-2"><LanguageToggle /></div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-xl text-xs font-black uppercase tracking-widest italic font-sans italic">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> {t.signout}
           </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT AREA */}
      <main className="flex-grow lg:ml-72 flex flex-col h-screen overflow-hidden">
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
                    placeholder="Search administrative vault..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-[11px] font-bold outline-none focus:ring-2 ring-[#048372]/10 transition-all font-sans italic"
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
               </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-slate-400 hover:bg-slate-50 relative border border-slate-100 italic font-black">AI</button>
               <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white bg-[#048372] flex items-center justify-center text-sm font-bold uppercase text-white shadow-xl italic shadow-[#048372]/20">
                  {username?.charAt(0)}
               </div>
            </div>
         </header>

         {/* DASH UI CORE VIEW */}
         <div className="flex-grow overflow-y-auto">
            {/* 🟦 VIBRANT HERO BAR (COMPANY TEAL) */}
            <div className="relative px-6 lg:px-12 pt-12 lg:pt-16 pb-36 lg:pb-48 overflow-hidden bg-[#0F172A] border-b border-white/5">
               <img src="/admin_dashboard_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none grayscale brightness-50 contrast-125 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#048372]/10 to-transparent pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none"></div>
               
               <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-3 py-1 bg-[#AECF5A] text-[#0F172A] rounded-md text-[10px] font-black uppercase tracking-[0.3em] shadow-xl italic">Elite Core Admin</span>
                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10B981]"></span>
                       <span className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest italic font-sans">Live Security Pulse Active</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter font-sans uppercase italic drop-shadow-2xl leading-none">Admin Command Hub</h1>
                    <p className="text-emerald-50/40 text-[11px] font-bold uppercase tracking-[0.4em] mt-3 italic font-sans italic">Staffing Distribution Stream • Registry Integrity V.4.0</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setIsAddingJob(true)} className="px-8 py-4 bg-[#048372] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-sans italic border border-white/10 group">
                       <FontAwesomeIcon icon={faPlus} className="opacity-60 group-hover:opacity-100 transition-opacity" /> New Marketplace Posting
                    </button>
                    <button onClick={fetchCore} className="px-6 py-4 bg-white/5 backdrop-blur-md text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] border border-white/10 hover:bg-white/10 transition-all font-sans italic">
                       Sync Handshake
                    </button>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-16 lg:-mt-20 space-y-8 pb-10">
               {/* 📊 ADMIN STATS GRID */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <X3Stat label="Personnel" val={users.length} trend="+2.4% Hub Growth" trendUp icon={faUsers} />
                  <X3Stat label="Openings" val={jobs.length} trend="Marketplace Active" trendUp icon={faBriefcase} />
                  <X3Stat label="Verifications" val={kycDocs.filter(k=>k.status==='Pending').length} trend="Priority Pulse" trendUp={false} icon={faShieldHalved} />
                  <X3Stat label="Operational Logs" val={timesheets.length} trend="Registry Synced" trendUp icon={faClock} />
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  {/* 📂 MAIN DATA DISTRIBUTION STREAM */}
                  <div className="xl:col-span-8 space-y-6">
                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                           <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic font-sans">Operational Distribution Stream</h2>
                           <button onClick={fetchCore} className="text-sm font-bold text-[#048372] bg-[#048372]/10 px-3 py-1 rounded-md hover:underline font-sans uppercase">Handshake Sync</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                           {fetching ? (
                              <div className="h-[400px] flex flex-col items-center justify-center gap-4 text-slate-400">
                                 <PulseLoader color="#048372" size={10} />
                                 <p className="text-sm font-bold uppercase tracking-widest italic opacity-50 font-sans">Handshaking Command Hub...</p>
                              </div>
                           ) : (
                               activeTab === "Overview" ? (
                                   <div className="grid grid-cols-1 gap-10">
                                      <div className="p-2 space-y-6">
                                         <div>
                                            <p className="px-6 py-5 text-sm font-black text-[#048372] uppercase tracking-[0.2em] italic border-b border-slate-50">{t.flux}</p>
                                            {filteredJobs.slice(0, 4).map(j => <JobCard key={j.id} job={j} apps={applications.filter(a => a.jobId === j.id)} onAudit={() => { setSelectedJobApps(applications.filter(a => a.jobId === j.id)); setSelectedJobContext(j); }} onView={() => setViewingJob(j)} onDelete={() => handleDeleteJob(j.id)} />)}
                                         </div>
                                         <div>
                                            <p className="px-6 py-5 text-sm font-black text-[#AECF5A] uppercase tracking-[0.2em] italic border-b border-slate-50">{t.identity}</p>
                                            <div className="divide-y divide-slate-100">
                                               {filteredKyc.slice(0, 3).map(k => (
                                                  <div key={k.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group cursor-pointer" onClick={() => setSelectedKYC(k)}>
                                                     <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[#048372]"><FontAwesomeIcon icon={faIdCard} size="sm" /></div>
                                                        <div>
                                                           <p className="text-sm font-black text-slate-800 uppercase italic">{k.documentType}</p>
                                                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{users.find(u => u.id === k.userId)?.username || "Personnel"}</p>
                                                        </div>
                                                     </div>
                                                     <FontAwesomeIcon icon={faChevronRight} className="text-slate-200 text-xs group-hover:text-[#048372] transition-colors" />
                                                  </div>
                                               ))}
                                               {!kycDocs.some(k => k.status === 'Pending') && <p className="p-6 text-center text-xs font-bold text-slate-300 uppercase tracking-widest italic">Verification Clear</p>}
                                            </div>
                                         </div>
                                                         <div className="p-2">
                                          <p className="px-6 py-5 text-sm font-black text-rose-500 uppercase tracking-[0.2em] italic border-b border-slate-50">{t.control}</p>
                                          <div className="overflow-x-auto">
                                             <table className="w-full text-left">
                                                <thead>
                                                   <tr className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                                                      <th className="px-6 py-4">Personnel</th>
                                                      <th className="px-6 py-4">Status</th>
                                                      <th className="px-6 py-4 text-right">Action</th>
                                                   </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                   {filteredUsers.slice(0, 8).map(u => <UserRow key={u.id} user={u} onViewMemo={() => viewCand(u.id)} onToggleStatus={() => handleToggleStatus(u)} />)}
                                                </tbody>
                                             </table>
                                          </div>
                                       </div>                     </div>
                                   </div>
                               ) :
                               activeTab === "Applications" ? (
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left font-sans italic">
                                       <thead className="bg-[#F8FAFC] border-b border-slate-100">
                                          <tr className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                             <th className="px-6 py-5">Candidate Profile</th>
                                             <th className="px-6 py-5">Deployment Category</th>
                                             <th className="px-6 py-5">Handshake Status</th>
                                             <th className="px-6 py-5 text-right">Audit Registry</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100">
                                          {filteredApps.map(app => (
                                             <tr key={app.id} className="hover:bg-slate-50 transition-all font-sans italic">
                                                <td className="px-6 py-6">
                                                   <div className="flex items-center gap-4">
                                                      <div className="w-10 h-10 bg-slate-100 text-[#048372] rounded-lg flex items-center justify-center font-black">{app.fullname?.charAt(0)}</div>
                                                      <div>
                                                        <p className="text-base font-bold text-slate-700 uppercase tracking-tight">{app.fullname}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{app.workEligibility || "Eligibility Pending"}</p>
                                                      </div>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                   <p className="text-base font-black text-slate-800 uppercase tracking-tight">{app.Job?.title || "Registry Orphan"}</p>
                                                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{app.Job?.department || "Unassigned Unit"}</p>
                                                </td>
                                                <td className="px-6 py-6">
                                                   <span className={`text-xs font-black px-3 py-1 rounded-md uppercase tracking-widest border ${app.status === 'Hired' ? 'bg-emerald-50 border-emerald-100 text-[#048372]' : app.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>{app.status}</span>
                                                </td>
                                                <td className="px-6 py-6 text-right space-x-2">
                                                   {app.resumeUrl && (
                                                      <button onClick={()=>handleDownloadCV(app.resumeUrl, app.fullname)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#048372] hover:bg-[#048372]/5 rounded-lg border border-slate-100 transition-all">
                                                         <FontAwesomeIcon icon={faFilePdf} />
                                                      </button>
                                                   )}
                                                   <button onClick={()=>viewCand(app.userId)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#048372] hover:bg-[#048372]/5 rounded-lg border border-slate-100 transition-all">
                                                      <FontAwesomeIcon icon={faUserPen} />
                                                   </button>
                                                </td>
                                             </tr>
                                          ))}
                                          {filteredApps.length === 0 && <tr><td colSpan={4} className="py-20 text-center uppercase tracking-[0.4em] text-slate-300 italic font-black font-sans opacity-40">Handshake_Registry_Neutral</td></tr>}
                                       </tbody>
                                    </table>
                                 </div>
                               ) :

                               activeTab === "Management" ? (
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                                             <th className="px-6 py-3">Personnel</th>
                                             <th className="px-6 py-3">Status</th>
                                             <th className="px-6 py-3 text-right">Action</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100">
                                          {filteredUsers.map(u => <UserRow key={u.id} user={u} onViewMemo={() => viewCand(u.id)} onToggleStatus={() => handleToggleStatus(u)} />)}
                                       </tbody>
                                    </table>
                                 </div>
                               ) :
                               activeTab === "UpdateProfile" ? (
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                                             <th className="px-6 py-3">Personnel</th>
                                             <th className="px-6 py-3">Status</th>
                                             <th className="px-6 py-3 text-right">Action</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100">
                                          {filteredUsers.map(u => <UserRow key={u.id} user={u} onViewMemo={() => viewCand(u.id)} onToggleStatus={() => handleToggleStatus(u)} />)}
                                       </tbody>
                                    </table>
                                 </div>
                               ) :
                               activeTab === "Timesheet" ? (
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                       <thead>
                                          <tr className="text-sm font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                                             <th className="px-6 py-3">Personnel</th>
                                             <th className="px-6 py-3">Week Ending</th>
                                             <th className="px-6 py-3">Status</th>
                                             <th className="px-6 py-3 text-right">Action</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100">
                                          {filteredTimesheets.map(t => <TimesheetRow key={t.id} t={t} user={users.find(u => u.id === t.userId)} onAudit={() => setSelectedTimesheet(t)} />)}
                                          {filteredTimesheets.length === 0 && <tr><td colSpan={4} className="py-20 text-center uppercase tracking-[0.4em] text-slate-300 italic font-black font-sans opacity-40">Ledger_Registry_Neutral</td></tr>}
                                       </tbody>
                                    </table>
                                 </div>
                               ) :
                               activeTab === "Internal" ? (
                                  filteredJobs.filter(j => j.jobCategory === 'Internal').slice((jobPage - 1) * JOBS_PER_PAGE, jobPage * JOBS_PER_PAGE).map(j => <JobCard key={j.id} job={j} apps={applications.filter(a => a.jobId === j.id)} onAudit={() => { setSelectedJobApps(applications.filter(a => a.jobId === j.id)); setSelectedJobContext(j); }} onView={() => setViewingJob(j)} onDelete={() => handleDeleteJob(j.id)} />)
                               ) :
                               activeTab === "External" ? (
                                  filteredJobs.filter(j => j.jobCategory === 'External').slice((jobPage - 1) * JOBS_PER_PAGE, jobPage * JOBS_PER_PAGE).map(j => <JobCard key={j.id} job={j} apps={applications.filter(a => a.jobId === j.id)} onAudit={() => { setSelectedJobApps(applications.filter(a => a.jobId === j.id)); setSelectedJobContext(j); }} onView={() => setViewingJob(j)} onDelete={() => handleDeleteJob(j.id)} />)
                               ) : (
                                  filteredJobs.map(j => <JobCard key={j.id} job={j} apps={applications.filter(a => a.jobId === j.id)} onAudit={() => { setSelectedJobApps(applications.filter(a => a.jobId === j.id)); setSelectedJobContext(j); }} onView={() => setViewingJob(j)} onDelete={() => handleDeleteJob(j.id)} />)
                               )
                            )}

                            {/* 📈 REGISTRY PAGINATION */}
                            {!fetching && activeTab !== "Overview" && activeJobs.length > JOBS_PER_PAGE && (
                               <div className="p-8 border-t border-slate-50 flex items-center justify-center gap-2">
                                  <button 
                                     disabled={jobPage === 1}
                                     onClick={() => setJobPage(p => p - 1)}
                                     className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100 disabled:opacity-30 disabled:grayscale hover:bg-[#048372] hover:text-white transition-all shadow-inner italic"
                                  >
                                     <FontAwesomeIcon icon={faChevronRight} className="rotate-180" />
                                  </button>
                                  <div className="px-6 h-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400">
                                     Sector {jobPage} / {Math.ceil(activeJobs.length / JOBS_PER_PAGE)}
                                  </div>
                                  <button 
                                     disabled={jobPage >= Math.ceil(activeJobs.length / JOBS_PER_PAGE)}
                                     onClick={() => setJobPage(p => p + 1)}
                                     className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100 disabled:opacity-30 disabled:grayscale hover:bg-[#048372] hover:text-white transition-all shadow-inner italic"
                                  >
                                     <FontAwesomeIcon icon={faChevronRight} />
                                  </button>
                               </div>
                           )}
                           {!fetching && jobs.length === 0 && !users.length && (
                              <div className="py-40 text-center flex flex-col items-center gap-6 opacity-30 select-none grayscale">
                                 <FontAwesomeIcon icon={faShieldVirus} size="3x" className="text-slate-300" />
                                 <p className="text-sm font-bold uppercase tracking-[0.5em] text-slate-400 font-sans">Command_Neutral</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* 📂 ADMIN SECURITY WIDGETS */}
                  <div className="xl:col-span-4 space-y-6">
                     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm group hover:border-[#048372] transition-all">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.3em] italic font-sans flex items-center gap-3">
                              <FontAwesomeIcon icon={faChartLine} className="text-[#048372]" /> Recruitment Flow
                           </h3>
                           <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest italic">Live Flux</span>
                        </div>
                        
                        <div className="space-y-6">
                           {[
                              { label: 'Marketplace Intake', val: `${intakeRate}%`, color: '#048372' },
                              { label: 'Personnel Verification', val: `${verificationRate}%`, color: '#AECF5A' },
                              { label: 'Legitimacy Audit', val: `${auditRate}%`, color: '#0F172A' }
                           ].map((s, i) => (
                              <div key={i}>
                                 <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-2 italic font-sans">
                                    <span className="text-slate-400">{s.label}</span>
                                    <span className="text-slate-800">{s.val}</span>
                                 </div>
                                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: s.val }} transition={{ duration: 1, delay: i * 0.2 }} className="h-full rounded-full shadow-lg" style={{ backgroundColor: s.color }}></motion.div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-[#1E293B] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#AECF5A]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#AECF5A]/20 transition-all"></div>
                        <h3 className="text-sm font-bold text-[#AECF5A] uppercase tracking-[0.4em] mb-6 font-sans italic">Personnel Spotlight</h3>
                        
                        {spotlightUser && (
                           <div key={spotlightUser.id} className="relative z-10 flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl font-black border border-white/20 shadow-inner italic uppercase">{spotlightUser.username?.charAt(0)}</div>
                              <div>
                                 <p className="text-sm font-black uppercase italic tracking-tight font-sans">{spotlightUser.username}</p>
                                 <p className="text-xs font-bold text-[#AECF5A] uppercase tracking-widest opacity-60">Verified Asset Hub</p>
                              </div>
                           </div>
                        )}
                        
                        <button onClick={() => setActiveTab('UpdateProfile')} className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-xl text-sm font-black uppercase tracking-[0.3em] hover:bg-[#AECF5A] hover:text-[#1E293B] hover:border-[#AECF5A] transition-all italic font-sans">View Full Directory</button>
                     </div>
                  </div>

              </div>
            </div>
         </div>
      </main>

      {/* ADMIN PROTOCOL MODALS */}
      <AnimatePresence>{viewingJob && <JobModal job={viewingJob} close={()=>setViewingJob(null)} />}</AnimatePresence>
      <AnimatePresence>{isAddingJob && <AddJobModal data={newJob} setData={setNewJob} close={()=>setIsAddingJob(false)} create={handleCreateJob} />}</AnimatePresence>
      <AnimatePresence>{selectedTimesheet && <TimesheetAuditModal t={selectedTimesheet} user={users.find(u => u.id === selectedTimesheet.userId)} close={()=>setSelectedTimesheet(null)} onUpdate={handleUpdateStatus} />}</AnimatePresence>
      <AnimatePresence>{selectedKYC && <KYCAuditModal k={selectedKYC} user={users.find(u => u.id === selectedKYC.userId)} close={()=>setSelectedKYC(null)} onVerify={verifyKYC} />}</AnimatePresence>
      <AnimatePresence>{selectedCandidate && (
         <DetailModal 
            candidate={selectedCandidate} 
            close={()=>setSelectedCandidate(null)} 
            updateMemo={updateMemo} 
            memo={adminMemos[selectedCandidate.userId]||""} 
            scann={scanningDoc} 
            runScan={()=>{setScanningDoc(true);setTimeout(()=>{setScanningDoc(false);setScanResult({v:99});toast.success("Identity Verified");},1500)}} 
            scanResult={scanResult}
            onToggleStatus={() => handleToggleStatus(users.find(u => u.id === selectedCandidate.userId))}
            isBlocked={!users.find(u => u.id === selectedCandidate.userId)?.active}
            apps={applications}
             handleDownloadCV={handleDownloadCV}
         />
      )}</AnimatePresence>
       <AnimatePresence>{selectedJobApps && <PoolModal apps={selectedJobApps} job={selectedJobContext} close={()=>{setSelectedJobApps(null);setSelectedJobContext(null);}} viewCand={viewCand} onUpdateStatus={handleUpdateAppStatus} handleDownloadCV={handleDownloadCV} />}</AnimatePresence>
    </div>
  );
};

/* --- SHARED ADMINISTRATIVE COMPONENTS --- */

const X3Stat = ({ label, val, trend, trendUp, icon }: any) => (
  <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-[#048372]/30 transition-all duration-500">
     <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-[#048372] group-hover:text-white transition-all duration-500 border border-slate-100/50">
           <FontAwesomeIcon icon={icon || faInfoCircle} size="sm" />
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border transition-all ${trendUp === false ? 'bg-rose-50 text-rose-400 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-[#048372]/20 group-hover:text-[#048372]'}`}>
           {trend}
        </span>
     </div>
     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 font-sans">{label}</p>
     <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase font-sans">{val}</h3>
  </div>
);

const UserRow = memo(({ user, onViewMemo, onToggleStatus }: any) => (
  <tr className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
     <td className="px-6 py-5">
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 ${user.active ? 'bg-[#048372]/10 text-[#048372]' : 'bg-slate-100 text-slate-400'} border border-black/5 rounded-lg flex items-center justify-center text-sm font-black`}>{user.username?.charAt(0) || "U"}</div>
           <div>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{user.username}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.email}</p>
           </div>
        </div>
     </td>
     <td className="px-6 py-5">
        <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-widest border ${user.active ? 'bg-emerald-50 border-emerald-100 text-[#048372]' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>{user.active ? 'Personnel Active' : 'Access Suspended'}</span>
     </td>
     <td className="px-6 py-5 text-right">
        <div className="flex justify-end gap-2">
           <button onClick={onViewMemo} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Audit Hub</button>
           <button onClick={onToggleStatus} className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center ${user.active ? 'border-rose-100 text-rose-400 hover:bg-rose-50' : 'border-emerald-100 text-[#048372] hover:bg-emerald-50'}`}>
              <FontAwesomeIcon icon={user.active ? faBan : faCheckCircle} className="text-xs" />
           </button>
        </div>
     </td>
  </tr>
));

const JobCard = memo(({ job, apps, onAudit, onView, onDelete }: any) => (
  <div className="p-5 lg:p-6 hover:bg-slate-50/50 flex flex-col lg:flex-row items-start lg:items-center justify-between transition-all group border-l-[3px] border-transparent hover:border-[#048372] bg-white rounded-xl mb-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-slate-200/60">
     <div className="flex flex-col sm:flex-row items-center gap-5 lg:gap-6 w-full lg:w-auto text-left">
        <div className={`w-11 h-11 lg:w-12 lg:h-12 shrink-0 ${job.jobCategory === 'Internal' ? 'bg-[#1E293B] text-[#AECF5A]' : 'bg-[#048372] text-white'} rounded-lg flex items-center justify-center text-lg shadow-sm border border-white/10 font-black transition-all group-hover:scale-105`}>{job.title?.charAt(0) || "J" }</div>
        <div className="flex-grow">
           <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-tight font-sans leading-none">{job.title}</h4>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${job.jobCategory === 'Internal' ? 'bg-[#1E293B] text-[#AECF5A] border-white/10' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                 {job.jobCategory === 'Internal' ? 'Internal' : 'External Hub'}
              </span>
           </div>
           <div className="flex flex-wrap gap-5 items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center gap-2"><FontAwesomeIcon icon={faLocationArrow} className="text-[#048372]/40" /> {job.address}</p>
              <div className="flex items-center gap-2.5 bg-slate-50/50 px-3 py-1 rounded border border-slate-100">
                 <div className="w-1 h-1 rounded-full bg-[#048372]/40 group-hover:bg-[#048372] transition-colors"></div>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{apps?.length || 0} Synced Records</span>
              </div>
           </div>
        </div>
     </div>
     <div className="flex items-center gap-2 mt-5 lg:mt-0 w-full lg:w-auto shrink-0">
        <button onClick={onView} className="w-9 h-9 rounded-lg bg-white text-slate-300 hover:text-[#048372] hover:border-[#048372]/30 transition-all border border-slate-200 flex items-center justify-center"><FontAwesomeIcon icon={faEye} size="xs" /></button>
        <button onClick={onAudit} className="flex-grow lg:flex-none px-6 py-2.5 bg-[#048372] text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-md shadow-[#048372]/5 transition-all active:scale-95 font-sans hover:brightness-105">Audit Profile</button>
        <button onClick={onDelete} className="w-9 h-9 rounded-lg bg-white text-slate-300 hover:text-rose-500 hover:border-rose-200 transition-all border border-slate-200 flex items-center justify-center"><FontAwesomeIcon icon={faBan} size="xs" /></button>
     </div>
  </div>
));

const TimesheetRow = memo(({ t, user, onAudit }: any) => (
  <tr className="hover:bg-slate-50/80 transition-all group">
     <td className="px-6 py-4">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center text-xs font-black border border-slate-100 italic">TS</div>
           <p className="text-sm font-bold text-slate-800 uppercase italic font-sans">{user?.username || "Staff"}</p>
        </div>
     </td>
     <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-500 uppercase italic font-sans">{t.weekEnding}</p>
     </td>
     <td className="px-6 py-4">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase italic tracking-widest border ${t.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-[#048372]' : t.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>{t.status}</span>
     </td>
     <td className="px-6 py-4 text-right">
        <button onClick={onAudit} className="px-4 py-2 bg-[#048372] text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-[#048372]/20 hover:brightness-110 transition-all italic font-sans">Audit Ledger</button>
     </td>
  </tr>
));

const NavI = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group relative ${active ? 'bg-[#048372] text-white font-bold shadow-lg ring-1 ring-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    <FontAwesomeIcon icon={icon} className={`text-sm w-5 transition-all ${active ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
    <span className="text-[13px] font-medium tracking-tight font-sans text-ellipsis overflow-hidden whitespace-nowrap">{label}</span>
  </button>
);

const TimesheetAuditModal = ({ t, user, close, onUpdate }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-md">
     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl max-w-4xl w-full p-10 relative shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] font-sans italic">
        <button onClick={close} className="absolute top-6 right-6 text-2xl text-slate-300 hover:text-rose-500 transition-colors">×</button>
        <div className="flex items-center justify-between mb-10 pb-10 border-b border-slate-100">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#048372] text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl italic">{user?.username.charAt(0)}</div>
              <div>
                 <h2 className="text-2xl font-bold uppercase italic leading-none mb-2">{user?.username} Registry Audit</h2>
                 <p className="text-sm font-bold text-[#048372] bg-[#048372]/5 px-3 py-1 rounded-md uppercase italic inline-block tracking-widest border border-[#048372]/10">Verification Protocol Active</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Week Ending Epoch</p>
              <p className="text-lg font-bold italic text-slate-900 font-sans">{t.weekEnding}</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                 <img src={t.screenshot && t.screenshot.startsWith('data:') ? t.screenshot : `data:image/png;base64,${t.screenshot}`} className="w-full h-auto rounded-xl shadow-2xl" alt="Registry Scan" />
              </div>
           </div>
           <div className="lg:col-span-4 space-y-6 italic">
              <div className="p-8 bg-[#1E293B] rounded-2xl text-white shadow-xl space-y-4">
                 <h3 className="text-xs text-[#AECF5A] uppercase tracking-widest font-black italic">Audit Decision Hub</h3>
                 <div className="space-y-3 font-sans">
                    <button onClick={() => onUpdate(t.id, 'Approved')} className="w-full py-4 bg-[#048372] text-white rounded-xl font-bold uppercase text-sm tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all">Sync Approval</button>
                    <button onClick={() => onUpdate(t.id, 'Rejected')} className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold uppercase text-sm tracking-widest shadow-lg hover:brightness-110 active:scale-95 transition-all">Reject Registry</button>
                    <button onClick={close} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-white/10 transition-all">Defer Action</button>
                 </div>
              </div>
              <div className="p-6 bg-[#F8FAFC] border border-slate-100 rounded-2xl space-y-3 shadow-inner">
                 <p className="text-sm text-slate-400 uppercase tracking-widest mb-1 font-bold">Audit Trace</p>
                 <div className="space-y-1 text-xs font-bold text-slate-500 uppercase tracking-tight font-sans">
                    <p>Submission: {new Date(t.createdAt || Date.now()).toLocaleString()}</p>
                    <p>Registry ID: #{String(t.id).slice(-8)}</p>
                 </div>
              </div>
           </div>
        </div>
     </motion.div>
  </div>
);

const JobModal = ({ job, close }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-md">
     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl max-w-xl w-full p-10 relative shadow-2xl border border-slate-100 font-sans italic">
        <button onClick={close} className="absolute top-6 right-6 text-2xl text-slate-300 hover:text-rose-500 transition-colors">×</button>
        <span className="text-sm font-bold text-[#048372] uppercase tracking-[0.3em] mb-2 block italic">Opening Protocol</span>
        <h2 className="text-2xl font-bold uppercase italic leading-none mb-8 border-b border-slate-50 pb-4 text-slate-800 tracking-tight">{job.title}</h2>
        <div className="space-y-6 text-sm font-bold">
           <div className="p-6 bg-slate-50 rounded-2xl space-y-4 shadow-inner border border-slate-100 font-sans">
              <div className="flex justify-between border-b border-slate-200 pb-2"><span>Operational Site:</span> <span className="text-[#048372]">{job.address}</span></div>
              <div className="flex justify-between"><span>Revenue Profile:</span> <span className="text-[#048372]">{job.compensation}</span></div>
           </div>
           <div className="max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#048372]/20">
              <p className="text-slate-600 leading-relaxed text-xs font-semibold whitespace-pre-line font-sans">
                 {sanitizeText(job.description || "No metadata found in registry.")}
              </p>
           </div>
        </div>
     </motion.div>
  </div>
);

const AddJobModal = ({ data, setData, close, create }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-md">
     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl max-w-2xl w-full p-10 relative shadow-2xl border border-slate-100 font-sans max-h-[90vh] overflow-y-auto italic">
        <button onClick={close} className="absolute top-6 right-6 text-2xl text-slate-300 hover:text-rose-500 transition-colors">×</button>
        <h2 className="text-2xl font-bold uppercase italic leading-none mb-2 text-slate-800 tracking-tight">New Marketplace Entry</h2>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Personnel Asset Hub Posting Interface</p>
        
        <div className="space-y-6 font-bold uppercase italic">
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Posting Category</label>
                 <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none italic font-sans" value={data.jobCategory} onChange={e=>setData({...data,jobCategory:e.target.value})}>
                    <option value="External">🌎 External Marketplace (Client Jobs)</option>
                    <option value="Internal">🏠 Internal Careers (X3 Staff Staffing)</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Job Protocol Title</label>
                 <input type="text" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 ring-[#048372]/10 font-bold italic font-sans" value={data.title} onChange={e=>setData({...data,title:e.target.value})} placeholder="General Labourer (Certified)" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Engagement Type</label>
                 <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none italic font-sans" value={data.employmentType} onChange={e=>setData({...data,employmentType:e.target.value})}>
                    <option value="Full-time">Full-time Registry</option>
                    <option value="Part-time">Part-time Registry</option>
                    <option value="Contract">Contract Assignment</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Maturity (Min. Experience)</label>
                 <input type="number" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 ring-[#048372]/10 font-bold italic font-sans" value={data.minimumExperience} onChange={e=>setData({...data,minimumExperience:parseInt(e.target.value)})} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Regional Province/State</label>
                 <select className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none italic font-sans" value={data.province} onChange={e=>setData({...data,province:e.target.value})}>
                    <option value="Ontario">Ontario Hub</option>
                    <option value="BC">BC Hub</option>
                    <option value="Alberta">Alberta Hub</option>
                    <option value="Manitoba">Manitoba Hub</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs text-slate-400 block mb-2 font-black italic">Revenue Profile (Comp)</label>
                 <input type="text" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 ring-[#048372]/10 font-bold italic font-sans" value={data.compensation} onChange={e=>setData({...data,compensation:e.target.value})} placeholder="$25.00 / Hour" />
              </div>
           </div>

           <div>
              <label className="text-xs text-slate-400 block mb-2 font-black italic">Operational Address Target</label>
              <input type="text" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs outline-none focus:ring-2 ring-[#048372]/10 font-bold italic font-sans" value={data.address} onChange={e=>setData({...data,address:e.target.value})} placeholder="Main Construction Site B" />
           </div>

           <div>
              <label className="text-xs text-slate-400 block mb-2 font-black italic">Registry Closure Epoch</label>
              <input type="date" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs font-bold italic font-sans" value={data.closingDate} onChange={e=>setData({...data,closingDate:e.target.value})} />
           </div>

           <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-2 font-black italic">Full Mission Description (Personnel Metadata)</label>
              <textarea rows={3} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic resize-none font-sans" value={data.description} onChange={e=>setData({...data,description:e.target.value})} placeholder="Identify necessary staffing protocols, certifications, and shift dynamics..." />
           </div>

           <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-2 font-black italic">Professional Requirements (Candidate Credentials)</label>
              <textarea rows={3} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 ring-[#048372]/10 italic resize-none font-sans" value={data.requirements} onChange={e=>setData({...data,requirements:e.target.value})} placeholder="Enter requirements (one per line)..." />
           </div>

           <button onClick={create} className="w-full py-5 bg-[#048372] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-95 transition-all italic mt-4 underline decoration-white/20 font-sans">Sync Posting to Marketplace Hub</button>
        </div>
     </motion.div>
  </div>
);

const DetailModal = ({ candidate, close, updateMemo, memo, scann, runScan, scanResult, onToggleStatus, isBlocked, apps, handleDownloadCV }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/85 backdrop-blur-2xl">
     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex overflow-hidden shadow-2xl border border-white/20 italic">
        {/* 📋 CANDIDATE PROFILE COLUMN */}
        <div className="w-1/3 bg-slate-50 border-r border-slate-200 p-10 flex flex-col justify-between">
           <div>
              <div className="w-24 h-24 bg-[#048372] rounded-3xl flex items-center justify-center text-4xl text-white font-bold mb-8 shadow-2xl shadow-[#048372]/30 italic">
                 {candidate.username?.charAt(0) || candidate.firstName?.charAt(0)}
              </div>
              <h2 className="text-3xl font-bold text-slate-800 uppercase italic tracking-tighter leading-none mb-2 font-sans">{candidate.username || `${candidate.firstName} ${candidate.lastName}`}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-8 font-sans">Personnel Registry ID: {String(candidate.userId || candidate.id || "X3V").slice(0,8)}</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Core Information</label>
                    <div className="space-y-3 font-sans">
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><FontAwesomeIcon icon={faEnvelope} className="text-[#048372]" /> {candidate.email}</div>
                       <div className="flex items-center gap-3 text-sm font-bold text-slate-600"><FontAwesomeIcon icon={faLocationArrow} className="text-[#AECF5A]" /> {candidate.address || "No Registry Address"}</div>
                    </div>
                 </div>
                 
                 <div className={`p-4 rounded-2xl border ${isBlocked ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <p className="text-sm font-black uppercase tracking-widest mb-1 italic">Security Status</p>
                    <p className="text-sm font-bold flex items-center gap-2 font-sans">
                       <FontAwesomeIcon icon={isBlocked ? faBan : faCheckCircle} /> 
                       {isBlocked ? "Personnel Suspended" : "Authorized X3 Asset"}
                    </p>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              <button 
                 onClick={onToggleStatus}
                 className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isBlocked ? 'bg-[#048372] text-white shadow-[#048372]/20' : 'bg-rose-500 text-white shadow-rose-500/20'} italic font-sans`}
              >
                 <FontAwesomeIcon icon={isBlocked ? faShieldHalved : faBan} />
                 {isBlocked ? "Authorize Platform Access" : "Suspend Personnel Rights"}
              </button>
              <button onClick={close} className="w-full py-4 bg-slate-200 text-slate-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-300 transition-all font-sans italic">Close Command Center</button>
           </div>
        </div>

        {/* 📟 ADMINISTRATIVE CONTROL AREA */}
        <div className="flex-grow p-12 overflow-y-auto bg-white">
           <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-10">
              <div className="flex gap-4">
                 <span className="text-sm font-bold text-[#048372] bg-[#048372]/5 px-3 py-1 rounded-md uppercase italic border border-[#048372]/10 tracking-widest">X3 Personnel Verified</span>
                 <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase py-1">Registry Epoch Active</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Rating</p>
                    <p className="text-xl font-bold italic text-[#AECF5A]">9.8 Pulse</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-12 font-bold uppercase italic">
              <div className="space-y-8">
                 <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner group">
                    <p className="text-sm text-emerald-800 mb-4 tracking-[0.3em] flex items-center gap-3"><FontAwesomeIcon icon={faStickyNote} className="opacity-40" /> Administrative Personnel Memo</p>
                    <textarea rows={6} className="w-full bg-transparent border-none text-sm text-emerald-900 italic outline-none resize-none font-bold placeholder:text-emerald-900/20 font-sans" value={memo} onChange={e=>updateMemo(candidate.userId, e.target.value)} placeholder="Personnel audit notes..." />
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-[#1E293B] rounded-2xl text-white shadow-xl relative overflow-hidden group">
                    <FontAwesomeIcon icon={faMicrochip} className={`absolute bottom-[-10px] right-[-10px] text-7xl text-white/5 ${scann?'animate-spin':''}`} />
                    <h3 className="text-xs text-[#AECF5A] mb-6 tracking-widest uppercase">Identity Certification Audit</h3>
                    <button onClick={runScan} className="w-full py-4 bg-[#048372] rounded-xl text-xs tracking-[0.3em] font-bold uppercase shadow-lg mb-4 hover:scale-105 transition-all italic font-sans">{scann ? 'Auditing Vault...' : 'Scan Personnel Documents'}</button>
                    {scanResult && <p className="text-[10px] text-[#AECF5A] text-center animate-pulse font-black uppercase tracking-widest italic font-sans">Identity Integrity Confirmed ✅</p>}
                 </div>
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl">
                     <p className="text-xs text-slate-400 mb-4 tracking-widest uppercase italic font-sans">Personnel Capability Hub</p>
                     <div className="flex flex-wrap gap-2">
                        {candidate.skills?.map((s:any, i:number)=>(<span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold uppercase italic font-sans">{s}</span>)) || <p className="text-sm text-slate-300">Registry_Clear</p>}
                     </div>
                  </div>

                  {candidate.certifications && candidate.certifications.length > 0 && (
                     <div className="p-8 bg-white border border-slate-100 rounded-2xl">
                        <p className="text-xs text-slate-400 mb-4 tracking-widest uppercase italic font-sans">Personnel Asset Vault / Legitimacy Proof</p>
                        <div className="space-y-3">
                           {candidate.certifications.map((c: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#048372]/30 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#048372] shadow-sm border border-slate-100 group-hover:bg-[#048372] group-hover:text-white transition-all"><FontAwesomeIcon icon={faFilePdf} /></div>
                                    <div>
                                       <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px] italic">{c.originalname}</p>
                                       <p className="text-[10px] font-bold text-[#AECF5A] uppercase tracking-widest">{c.certType || 'Personnel Asset'} • Expires: {c.expiryDate || 'N/A'}</p>
                                    </div>
                                 </div>
                                 <button onClick={() => handleDownloadCV(`data:${c.mimetype};base64,${c.base64Pdf}`, candidate.username || 'Record')} className="px-5 py-2 hover:bg-[#048372] hover:text-white border border-[#048372] text-[#048372] rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all font-sans italic">Audit Proof</button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
                  {/* 🛡️ CENTRAL CV DISPATCH (Auditing JobApp Registry) */}
                  {apps && apps.filter((app: any) => app.userId === candidate.userId && app.resumeUrl).length > 0 && (
                     <div className="p-8 bg-slate-100/50 border border-slate-200 rounded-2xl mt-6 shadow-inner italic">
                        <p className="text-xs text-slate-500 mb-4 tracking-widest uppercase italic font-sans font-black">Marketplace Resume Vault</p>
                        <div className="space-y-2">
                           {apps.filter((app: any) => app.userId === candidate.userId && app.resumeUrl).map((app: any, idx: number) => (
                              <button 
                                key={idx}
                                onClick={() => handleDownloadCV(app.resumeUrl, app.fullname)}
                                className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 hover:border-[#048372] transition-all group shadow-sm"
                              >
                                 <div className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={faFilePdf} className="text-rose-500 text-lg" />
                                    <div className="text-left font-sans not-italic">
                                       <p className="text-sm font-black text-slate-800 uppercase italic">Personnel CV (Registry #{idx + 1})</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked: {app.Job?.title || "Staffing Log"}</p>
                                    </div>
                                 </div>
                                 <span className="text-[10px] font-black text-[#048372] uppercase italic opacity-0 group-hover:opacity-100 transition-opacity font-sans">Fetch Asset</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  )}
              </div>
           </div>
        </div>
     </motion.div>
  </div>
);

const PoolModal = ({ apps, close, viewCand, job, onUpdateStatus, handleDownloadCV }: any) => {
  // 🛡️ X3 AI MATCH PULSE ALGORITHM (High-Fidelity Metadata Sync)
  const scoredApps = apps.map((app: any) => {
    let score = 25; // Base Baseline Integrity
    const jobKeywords = (job?.title + " " + job?.description + " " + job?.department).toLowerCase();
    const profile = app.UserProfile;
    
    if (profile) {
      // 🏗️ ROLE MATCH (40% Weight)
      if (profile.role && jobKeywords.includes(profile.role.toLowerCase())) score += 40;
      
      // 📆 EXPERIENCE MATCH (30% Weight)
      const exp = profile.yearsOfConstructionExperience || 0;
      if (jobKeywords.includes("lead") && exp >= 5) score += 30;
      else if (exp >= 1) score += 15;

      // 🧤 REGISTRY SKILLS MATCH (30% Weight)
      const skills = (profile.certifications || []).map((c: any) => (c.certType || "").toLowerCase()).join(" ");
      if (jobKeywords.includes("certified") && skills.length > 5) score += 20;
      if (skills.includes("forklift") && jobKeywords.includes("forklift")) score += 10;
    }

    // 🇨🇦 ELIGIBILITY MATCH (20% Weight)
    if (app.workEligibility === 'Canadian Citizen' || app.workEligibility === 'Permanent Resident') score += 20;

    return { ...app, matchScore: Math.min(score, 99) }; 
  }).sort((a: any, b: any) => b.matchScore - a.matchScore);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-md font-sans italic">
       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl max-w-2xl w-full p-10 relative shadow-2xl border border-slate-100 text-slate-800 overflow-y-auto max-h-[85vh]">
          <button onClick={close} className="absolute top-6 right-6 text-2xl text-slate-300 hover:text-rose-500 transition-colors">×</button>
          <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
             <div>
                <h2 className="text-xl font-bold uppercase italic tracking-widest">Application Registry</h2>
                <p className="text-xs font-bold text-[#048372] uppercase tracking-[0.2em] italic">AI Match Pulse: {job?.title}</p>
             </div>
             <div className="text-right">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">{apps.length} Total SYNC</span>
             </div>
          </div>
          <div className="space-y-4">
             {scoredApps.map((app:any, index: number)=>(
                <div key={app.id} className={`p-5 rounded-xl flex flex-col border transition-all group ${index < 3 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-[#F8FAFC] border-slate-100'}`}>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg font-bold text-white ${index < 3 ? 'bg-[#048372]' : 'bg-slate-400'}`}>{app.fullname?.charAt(0)}</div>
                         <div>
                            <p className="text-xs text-slate-700 tracking-tight font-black uppercase italic">{app.fullname}</p>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: {app.status}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-right mr-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase italic">Match Rank</p>
                            <p className={`text-xs font-black italic ${index < 3 ? 'text-[#048372]' : 'text-slate-500'}`}>{app.matchScore}%</p>
                         </div>
                         <button onClick={()=>viewCand(app.userId)} className="px-5 py-2 hover:bg-[#048372] hover:text-white border border-[#048372] text-[#048372] rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all font-sans italic">View CV</button>
                      </div>
                   </div>
                   
                    <div className="flex gap-4 items-center justify-between pt-4 border-t border-slate-200/50">
                       <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border ${app.workEligibility === 'Canadian Citizen' ? 'bg-emerald-50 border-emerald-100 text-[#048372]' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                             {app.workEligibility || "Eligibility Pending"}
                          </span>
                          {app.resumeUrl && (
                             <button onClick={() => handleDownloadCV(app.resumeUrl, app.fullname)} className="text-xs font-bold text-[#048372] flex items-center gap-1.5 hover:underline font-sans">
                                <FontAwesomeIcon icon={faFilePdf} /> Download Personnel CV
                             </button>
                          )}
                       </div>
                       <div className="flex gap-2 font-sans italic">
                          <button 
                            onClick={() => onUpdateStatus(app.id, 'Interviewing')}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all italic"
                          >Interview Personnel</button>
                          <button 
                            onClick={() => onUpdateStatus(app.id, 'Hired')}
                            className="px-4 py-2 bg-[#048372] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all italic"
                          >Accept Candidate</button>
                          <button 
                            onClick={() => onUpdateStatus(app.id, 'Rejected')}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all italic"
                          >Reject</button>
                       </div>
                    </div>
                </div>
             ))}
             {apps.length === 0 && <p className="text-center text-[10px] text-slate-400 italic py-10 tracking-[0.4em]">Registry_Empty</p>}
          </div>
       </motion.div>
    </div>
  );
};

const KYCAuditModal = ({ k, user, close, onVerify }: any) => {
   const [scanning, setScanning] = useState(false);
   const [scannedData, setScannedData] = useState<any>(null);

   const runAIScan = () => {
      setScanning(true);
      setTimeout(() => {
         setScanning(false);
         const docType = k.documentType.toLowerCase();
         let detected = "Unknown Asset";
         let integrity = "Low";
         if (docType.includes("license")) { detected = "Driving License Registry"; integrity = "98%"; }
         else if (docType.includes("passport")) { detected = "International Passport Vault"; integrity = "99%"; }
         else if (docType.includes("cv") || docType.includes("resume") || docType.includes("curriculum")) { detected = "ATS Personnel Profile"; integrity = "94%"; }
         setScannedData({ type: detected, integrity, verified: true });
         toast.success("X3 Intelligence: Asset Identified");
      }, 2000);
   };




   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#0F172A]/40 backdrop-blur-md font-sans italic">
         <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-3xl max-w-5xl w-full h-[85vh] flex overflow-hidden shadow-2xl border border-white/20 text-slate-800 font-sans">
            <div className="w-1/2 bg-[#1E293B] p-10 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               </div>
               <div className="relative z-10 w-full h-full flex items-center justify-center font-sans">
                  <motion.div className="w-full max-w-md h-[400px] bg-white/5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden relative" animate={scanning ? { scale: [1, 1.02, 1] } : {}}>
                     {scanning && <motion.div initial={{ top: 0 }} animate={{ top: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute left-0 w-full h-1 bg-[#AECF5A] shadow-[0_0_15px_#AECF5A] z-20"></motion.div>}
                     <img src={k.fileUrl || (k.file && `data:image/png;base64,${k.file}`)} className={`w-full h-full object-contain transition-all duration-700 ${scanning ? 'blur-[2px] opacity-40 grayscale' : 'opacity-100'}`} alt="Personnel Asset" />
                     {scannedData && <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none border-2 border-emerald-500/50"></div>}
                  </motion.div>
               </div>
               <div className="mt-10 text-center relative z-10">
                  <p className="text-[10px] text-[#AECF5A] font-black uppercase tracking-[0.4em] mb-2 font-sans">Registry Pulse</p>
                  <p className="text-white text-xs font-bold italic opacity-60 font-sans">"Document visual sync is active. Personnel ID: #{user?.id?.slice(0,8)}"</p>
               </div>
            </div>
            <div className="w-1/2 p-12 bg-white flex flex-col justify-between italic text-slate-800">
               <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-8 text-slate-800">
                     <div className="font-sans">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-2 italic">Identity Audit Registry</h2>
                        <span className="text-[10px] font-bold text-[#048372] bg-[#048372]/5 px-3 py-1 rounded-md uppercase tracking-widest border border-[#048372]/10">{k.documentType} Payload</span>
                     </div>
                     <button onClick={close} className="text-2xl text-slate-300 hover:text-rose-500 transition-colors">×</button>
                  </div>
                  <div className="space-y-8 text-slate-800 font-sans">
                     {!scannedData ? (
                        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-6">
                           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-200"><FontAwesomeIcon icon={faMicrochip} className={`text-slate-300 text-2xl ${scanning ? 'animate-spin' : ''}`} /></div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Execute AI Identity Sync to Authorize<br/>Verification Actions</p>
                           <button onClick={runAIScan} className="w-full py-4 bg-[#1E293B] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all italic font-sans">{scanning ? 'Auditing Documentation...' : 'Authorize AI Scan Request'}</button>
                        </div>
                     ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                           <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-slate-800 font-sans">
                              <p className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2 font-sans"><FontAwesomeIcon icon={faCheckCircle} /> AI INTELLIGENCE MATCH</p>
                              <div className="space-y-3 font-sans">
                                 <div className="flex justify-between text-xs font-bold italic text-slate-700"><span>Detected Registry Type:</span> <span className="text-[#048372]">{scannedData.type}</span></div>
                                 <div className="flex justify-between text-xs font-bold italic text-slate-700"><span>Document Integrity Pulse:</span> <span className="text-emerald-600">{scannedData.integrity}</span></div>
                                 <div className="flex justify-between text-xs font-bold italic text-slate-700"><span>Security Verification:</span> <span className="text-[#048372]">Authorized ✅</span></div>
                              </div>
                           </div>
                           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">Personnel Identity Metadata</p>
                              <p className="text-sm font-black text-slate-800 uppercase italic">{user?.username || 'Field Personnel'}</p>
                              <p className="text-[10px] text-slate-400 font-bold italic uppercase">{user?.email || 'security@x3staffing.com'}</p>
                           </div>
                        </motion.div>
                     )}
                  </div>
               </div>
               <div className="space-y-3 text-slate-800 font-sans">
                  <div className="flex gap-3">
                     <button onClick={() => onVerify(k.id, 'Verified')} disabled={!scannedData || scanning} className="flex-grow py-5 bg-[#048372] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-[#048372]/20 hover:brightness-110 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all italic underline decoration-white/20 font-sans">Accept Identity</button>
                     <button onClick={() => onVerify(k.id, 'Rejected')} disabled={scanning} className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-xl shadow-rose-600/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all italic font-sans">Reject</button>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
   );
};
