import { useEffect, useState, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  faSearch, faBriefcase, faLocationArrow, faMoneyBillWave, 
  faRotate, faChevronRight, faChartLine, faWallet, faUsers, faEnvelope, 
  faFileLines, faUserTie, faArrowRightFromBracket, faCheck,
  faChevronLeft, faFileUpload, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { X3Logo } from "../components/X3Logo";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { LanguageToggle } from "../components/LanguageToggle";
import { useSendLogoutMutation } from "../auth/authApiSlice";

interface Job {
  id: string; 
  title: string; 
  address: string; 
  compensation: string;
  department: string; 
  employmentType: string; 
  description?: string;
  requirements?: string;
  minimumExperience?: number;
  province?: string;
  city?: string; 
  v?: string; 
  jobCategory?: string;
  closingDate?: string;
}

export const JobOpening = () => {
  const { userId, username } = useAuth();
  const navigate = useNavigate();
  const [sendLogout] = useSendLogoutMutation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [userProgressJobs, setUserProgressJobs] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState<"All" | "Applied" | "In Progress" | "Internal" | "External">("All");

  // 📄 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 9;

  // 🇨🇦 CANADIAN RECRUITMENT STATE
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [targetJob, setTargetJob] = useState<Job | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [workEligibility, setWorkEligibility] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (userId) fetchHandshake(currentPage);
  }, [userId, currentPage, selectedOption]);

  const fetchHandshake = async (page = 1) => {
    setIsSyncing(true);
    try {
      const jobsUrl = `${REACT_APP_API_URL}/jobs?page=${page}&limit=${jobsPerPage}`;
      const appsUrl = userId ? `${REACT_APP_API_URL}/jobApp/user/${userId}` : null;
      
      const requests = [axios.get(jobsUrl)];
      if (appsUrl) requests.push(axios.get(appsUrl));

      const results = await Promise.all(requests);
      const jobsRes = results[0];
      const appsRes = results[1];
      
      // 🛡️ Fail-Safe Data Projection
      const rawData = jobsRes?.data;
      if (rawData?.jobs && Array.isArray(rawData.jobs)) {
        setJobs(rawData.jobs);
        setTotalPages(rawData.totalPages || 1);
      } else if (Array.isArray(rawData)) {
        setJobs(rawData);
        setTotalPages(1);
      } else {
        setJobs([]);
      }

      if (appsRes?.data) {
         setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
         const progress = Array.isArray(appsRes.data) ? appsRes.data.filter((a: any) => a.status === "In Progress") : [];
         setUserProgressJobs(progress);
      }
      
      if (jobs.length > 0) toast.success("Registry Synced.");
    } catch (e) {
      toast.error("Registry Sync Fail.");
    } finally { setIsSyncing(false); }
  };

  const handleInitiateApply = (job: Job) => {
    setTargetJob(job);
    setShowSubmitModal(true);
  };

  const applyForJob = async () => {
    if (!targetJob || !userId) return;
    if (!selectedFile) return toast.error("Please upload your CV/Resume.");
    if (!workEligibility) return toast.error("Please select work eligibility.");

    const jobId = targetJob.id || targetJob.v || "";
    setLoadingStatus(prev => ({ ...prev, [jobId]: true }));
    
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("jobId", jobId);
      formData.append("workEligibility", workEligibility);
      formData.append("resume", selectedFile);

      await axios.post(`${REACT_APP_API_URL}/jobApp`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Application Dispatched.");
      setShowSubmitModal(false);
      setTargetJob(null);
      setSelectedFile(null);
      setWorkEligibility("");
      fetchHandshake(currentPage);
    } catch (e) { 
       toast.error("Submission failed."); 
    } finally { 
       setLoadingStatus(prev => ({ ...prev, [jobId]: false })); 
    }
  };

  const handleLogout = async () => {
    try {
      await sendLogout("").unwrap();
      navigate("/");
    } catch (e) {
      navigate("/");
    }
  };
  // Hub Projection logic
  let displayJobs: any[] = [];
  const activeJobs = (jobs || []).filter(j => {
    if (!j.closingDate) return true; // Fail-safe for legacy logs
    return new Date(j.closingDate) >= new Date();
  });

  if (selectedOption === "Applied") {
    displayJobs = applications || [];
  } else if (selectedOption === "In Progress") {
    displayJobs = userProgressJobs || [];
  } else if (selectedOption === "Internal") {
    displayJobs = activeJobs.filter(j => String(j.jobCategory || "").toLowerCase() === 'internal');
  } else if (selectedOption === "External") {
    displayJobs = activeJobs.filter(j => String(j.jobCategory || "").toLowerCase() === 'external');
  } else {
    displayJobs = activeJobs.filter(job => {
      if (!job) return false;
      const title = String(job.title || "").toLowerCase();
      const address = String(job.address || "").toLowerCase();
      const query = String(searchQuery || "").toLowerCase();
      return title.includes(query) || address.includes(query);
    });
  }

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

        <div className="px-3 py-6 flex-grow space-y-8 overflow-y-auto font-sans italic">
           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50 font-sans italic">Main Menu</p>
              <nav className="space-y-1">
                 <NavI icon={faChartLine} label="User Dashboard" onClick={() => navigate('/userdashboard')} />
                 <NavI icon={faWallet} label="Payments Hub" onClick={() => navigate('/timesheet')} />
                 <NavI icon={faUsers} label="Marketplace" active />
                 <NavI icon={faEnvelope} label="Secure Messages" onClick={() => navigate('/messages')} />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50 font-sans italic">Personnel Assets</p>
              <nav className="space-y-1">
                 <NavI icon={faBriefcase} label="My Applications" onClick={() => { setSelectedOption("Applied"); setMobileMenuOpen(false); }} />
                 <NavI icon={faFileLines} label="Duty Work Logs" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUserTie} label="Identity Profile" onClick={() => { navigate('/userdetails'); setMobileMenuOpen(false); }} />
              </nav>
           </div>
        </div>

        <div className="p-4 bg-[#0F172A]/40 m-4 rounded-xl space-y-4 font-sans italic">
           <div className="px-2 font-sans italic"><LanguageToggle /></div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest italic font-sans italic">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out X3 Hub
           </button>
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE */}
      <main className="flex-grow lg:ml-64 flex flex-col h-screen overflow-hidden font-sans italic">
         {/* TOP HEADER */}
         <header className="h-16 bg-white sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 shrink-0 border-b border-slate-200 font-sans italic">
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
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 ring-[#048372]/10 transition-all font-sans italic font-sans italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-sans italic" />
               </div>
            </div>
            
            <div className="flex items-center gap-4 font-sans italic">
               <button onClick={() => fetchHandshake(currentPage)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 border border-slate-100 transition-all font-sans italic">
                  <FontAwesomeIcon icon={faRotate} className={isSyncing ? "animate-spin" : ""} />
               </button>
               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-[#048372] flex items-center justify-center text-[10px] font-bold uppercase text-white shadow-lg italic font-sans italic">
                  {username?.charAt(0)}
               </div>
            </div>
         </header>

         {/* DASH UI CORE VIEW */}
         <div className="flex-grow overflow-y-auto font-sans italic">
            {/* 🟦 VIBRANT HERO BAR (COMPANY TEAL) */}
            <div className="bg-[#048372] px-6 lg:px-10 pt-8 lg:pt-10 pb-24 lg:pb-32 relative overflow-hidden">
               <div className="flex items-center justify-between font-sans italic">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight italic">Personnel Marketplace Hub</h1>
                    <p className="text-emerald-50/60 text-xs font-medium italic">Real-time Opportunity Matching & Digital Registry Active</p>
                  </div>
                   <div className="flex bg-white/10 p-1 rounded-lg backdrop-blur-md italic font-sans">
                    <button onClick={() => setSelectedOption("All")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${selectedOption === "All" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>All Hubs</button>
                    <button onClick={() => setSelectedOption("External")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${selectedOption === "External" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>Marketplace</button>
                    <button onClick={() => setSelectedOption("Internal")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${selectedOption === "Internal" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>Careers</button>
                    <button onClick={() => setSelectedOption("Applied")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tight rounded-md transition-all ${selectedOption === "Applied" ? "bg-white text-[#048372] shadow-lg" : "text-white/60 hover:text-white"}`}>Applied Logs</button>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-12 lg:-mt-20 space-y-8 pb-10 font-sans italic">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {isSyncing ? (
                    [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                  ) : displayJobs.length > 0 ? (
                    displayJobs.map((item: any) => {
                      // 🛡️ High-Fidelity Data Extraction (Handles Nested Joins & Direct Job Objects)
                      const job: Job = item.Job || item.job || item;
                      
                      // Check if already applied (String-safe comparison for Registry Integrity)
                      const isApplied = applications.some(a => 
                        String(a.jobId) === String(job.id || job.v || "")
                      );

                      // Stable Key Priority: Application ID > Job ID
                      const uniqueKey = item.id || job.id || job.v || Math.random();
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          key={uniqueKey} 
                          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 group hover:border-[#048372] transition-all hover:shadow-xl hover:shadow-[#048372]/5 flex flex-col font-sans italic"
                        >
                           <div className="flex justify-between items-start mb-6 font-sans italic">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#048372] text-xl border border-slate-100 group-hover:bg-[#048372] group-hover:text-white transition-all shadow-inner uppercase font-bold italic font-sans italic">
                                 {job.title?.charAt(0) || "X"}
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-[10px] font-black text-[#AECF5A] px-2 py-0.5 rounded-md uppercase tracking-tight italic bg-[#AECF5A]/10 border border-[#AECF5A]/20">Active Epoch</span>
                                 <p className="text-[10px] text-slate-400 mt-1 font-bold italic font-sans italic">{job.employmentType}</p>
                              </div>
                           </div>

                           <div className="space-y-1 mb-4 font-sans italic">
                              <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-[#048372] transition-colors uppercase leading-tight line-clamp-1 italic font-sans italic">{job.title}</h3>
                              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2 italic">
                                 <FontAwesomeIcon icon={faLocationArrow} className="text-[#048372]/30" /> {job.address}
                              </p>
                           </div>

                           <div className="flex flex-wrap gap-2 mb-6 font-sans italic">
                               <span className="text-[9px] font-black text-[#048372] px-2 py-0.5 rounded-md uppercase tracking-tight italic bg-[#048372]/5 border border-[#048372]/10 flex items-center gap-1.5">
                                  <FontAwesomeIcon icon={faBriefcase} className="text-[8px] opacity-60" /> {job.minimumExperience || 0}+ Years Exp
                               </span>
                               {job.requirements && (
                                  <span className="text-[9px] font-black text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tight italic bg-slate-100 border border-slate-200 font-sans italic">
                                     Requirement Verified
                                  </span>
                               )}
                            </div>

                            <div className="space-y-4 mb-8 font-sans italic flex-grow">
                               <div className="group/desc">
                                  <p className="text-[10px] font-black text-[#048372] uppercase tracking-[0.2em] mb-2 italic opacity-60 font-sans italic">Registry Description</p>
                                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500 font-sans italic">
                                     {job.description || "The industry-leading platform criteria for this role is currently in the high-fidelity registry matching phase."}
                                  </p>
                                </div>
                                
                                {job.requirements && (
                                   <div className="pt-4 border-t border-slate-100 italic font-sans italic">
                                      <p className="text-[10px] font-black text-[#AECF5A] uppercase tracking-[0.2em] mb-2 italic opacity-80 font-sans italic">Operational Requirements</p>
                                      <p className="text-[11px] text-slate-500 font-medium italic line-clamp-2 leading-relaxed font-sans italic">
                                         {job.requirements}
                                      </p>
                                   </div>
                                )}
                            </div>

                           <div className="grid grid-cols-2 gap-3 mb-8 font-sans italic mt-auto">
                               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all hover:bg-white hover:shadow-md group/rev font-sans italic">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60 italic group-hover/rev:text-[#048372]">Revenue</p>
                                  <p className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-sans italic">
                                     <FontAwesomeIcon icon={faMoneyBillWave} className="text-[#048372]" /> {job.compensation}
                                  </p>
                               </div>
                               <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all hover:bg-white hover:shadow-md group/dept font-sans italic">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60 italic group-hover/dept:text-[#AECF5A]">Dept</p>
                                  <p className="text-xs font-bold text-slate-700 tracking-tight flex items-center gap-1.5 uppercase italic italic font-sans italic">
                                     <FontAwesomeIcon icon={faBriefcase} className="text-[#AECF5A]" /> {job.department}
                                  </p>
                               </div>
                            </div>

                           {isApplied ? (
                              <div className="w-full flex items-center justify-center gap-2 py-3 bg-[#048372]/5 text-[#048372] rounded-xl text-[10px] font-bold uppercase tracking-widest italic border border-[#048372]/20 font-sans italic">
                                 <FontAwesomeIcon icon={faCheck} className="text-[#AECF5A]" /> Registry_Applied
                              </div>
                           ) : (
                              <button 
                                onClick={() => handleInitiateApply(job)}
                                disabled={loadingStatus[job.id || job.v || ""]}
                                className="w-full py-3 bg-[#048372] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#048372]/10 hover:shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 italic font-sans italic"
                              >
                                 {loadingStatus[job.id || job.v || ""] ? (
                                    <PulseLoader size={4} color="white" />
                                 ) : (
                                    <><span>Submit Application</span> <FontAwesomeIcon icon={faChevronRight} /></>
                                 )}
                              </button>
                           )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center gap-6 opacity-30 select-none grayscale font-sans italic">
                       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                          <FontAwesomeIcon icon={faBriefcase} size="2xl" />
                       </div>
                       <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 italic font-sans italic">Registry_Clear</p>
                    </div>
                  )}
               </div>

               {/* 📄 PAGINATION CONTROLS */}
               {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 py-10 font-sans italic">
                     <button 
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-[#048372] hover:text-white transition-all flex items-center justify-center shadow-sm"
                     >
                        <FontAwesomeIcon icon={faChevronLeft} />
                     </button>
                     
                     <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button 
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-xl text-xs font-bold transition-all border ${currentPage === i + 1 ? 'bg-[#048372] text-white border-[#048372] shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-[#048372]'}`}
                          >
                             {i + 1}
                          </button>
                        ))}
                     </div>

                     <button 
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages}
                       className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-[#048372] hover:text-white transition-all flex items-center justify-center shadow-sm"
                     >
                        <FontAwesomeIcon icon={faChevronRight} />
                     </button>
                  </div>
               )}
            </div>
         </div>
      </main>

      {/* 🇨🇦 CANADIAN COMPLIANCE SUBMISSION MODAL */}
      <AnimatePresence>
         {showSubmitModal && targetJob && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 font-sans italic">
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                 onClick={() => setShowSubmitModal(false)}
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden font-sans italic"
               >
                  <div className="bg-[#048372] p-6 text-white font-sans italic">
                     <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">X3 Personnel Registry</label>
                        <button onClick={() => setShowSubmitModal(false)} className="text-white/40 hover:text-white transition-colors">
                           <FontAwesomeIcon icon={faTimes} />
                        </button>
                     </div>
                     <h2 className="text-xl font-bold italic tracking-tight">{targetJob.title}</h2>
                     <p className="text-emerald-50/60 text-[10px] font-bold uppercase mt-1 italic">{targetJob.department} // Dispatch Intake</p>
                  </div>

                  <div className="p-8 space-y-8 font-sans italic text-slate-600">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 italic text-slate-400">1. Work Eligibility (Canada)</p>
                        <div className="grid grid-cols-1 gap-2">
                           {["Canadian Citizen", "Permanent Resident", "Work Permit", "Other"].map(opt => (
                              <button 
                                key={opt}
                                onClick={() => setWorkEligibility(opt)}
                                className={`px-4 py-3 rounded-xl text-left text-xs font-bold transition-all border ${workEligibility === opt ? 'bg-[#048372]/5 border-[#048372] text-[#048372] shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}
                              >
                                 {opt}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-4 italic text-slate-400">2. Document Documentation</p>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full py-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${selectedFile ? 'border-[#048372] bg-[#048372]/5 text-[#048372]' : 'border-slate-200 hover:border-slate-300 text-slate-400'}`}
                        >
                           <FontAwesomeIcon icon={faFileUpload} size="2xl" className={selectedFile ? 'animate-bounce' : ''} />
                           <div className="text-center">
                              <p className="text-xs font-black uppercase italic">{selectedFile ? selectedFile.name : 'Upload Resume/CV'}</p>
                              <p className="text-[9px] font-bold opacity-60 mt-1 uppercase">PDF or Word Registry Format</p>
                           </div>
                        </button>
                     </div>

                     <button 
                       onClick={applyForJob}
                       disabled={loadingStatus[targetJob.id || targetJob.v || ""]}
                       className="w-full py-4 bg-[#048372] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#048372]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 italic"
                     >
                        {loadingStatus[targetJob.id || targetJob.v || ""] ? (
                           <PulseLoader size={5} color="white" />
                        ) : (
                           <>Dispatch Application <FontAwesomeIcon icon={faChevronRight} /></>
                        )}
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

const NavI = memo(({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group relative ${active ? 'bg-[#048372] text-white font-bold shadow-lg ring-1 ring-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5 font-sans italic'}`}>
    <FontAwesomeIcon icon={icon} className={`text-sm w-5 transition-all ${active ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-100 font-sans italic'}`} />
    <span className="text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] font-sans italic">{label}</span>
  </button>
));

const SkeletonCard = memo(() => (
  <div className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse font-sans italic">
     <div className="flex justify-between items-start mb-6 font-sans italic">
        <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        <div className="w-20 h-4 bg-slate-50 rounded" />
     </div>
     <div className="space-y-2 mb-6">
        <div className="h-5 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-50 rounded w-1/2" />
     </div>
     <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="h-10 bg-slate-50 rounded-lg" />
        <div className="h-10 bg-slate-50 rounded-lg" />
     </div>
     <div className="h-12 bg-slate-100 rounded-xl w-full" />
  </div>
));
