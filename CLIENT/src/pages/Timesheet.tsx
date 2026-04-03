import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  faPaperPlane, faFileSignature, faClock, faRotate,
  faChartLine, faWallet, faUsers, faEnvelope, faBriefcase, faFileLines, faUserTie, faArrowRightFromBracket, faBell
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { SignaturePad } from "../components/SignaturePad";
import { LanguageToggle } from "../components/LanguageToggle";

interface RowData {
  date: string;
  day: string;
  startTime: string;
  finishTime: string;
  lessLunch: string;
  supervisorInitial: string;
}

export const Timesheet = () => {
  const { userId, username } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [rows, setRows] = useState<RowData[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await axios.get(`${REACT_APP_API_URL}/userProfiles/${userId}`);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
    const storedJob = localStorage.getItem("selectedInProgressJob");
    if (storedJob) setJob(JSON.parse(storedJob));
  }, [userId]);

  const generateRows = (start: string) => {
    if (!start) return [];
    const date = new Date(start);
    const newRows: RowData[] = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(date);
      current.setDate(date.getDate() + i);
      newRows.push({
        date: current.toLocaleDateString("en-GB"),
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][current.getDay()],
        startTime: "",
        finishTime: "",
        lessLunch: "0",
        supervisorInitial: "",
      });
    }
    return newRows;
  };

  useEffect(() => {
    if (selectedDate) setRows(generateRows(selectedDate));
  }, [selectedDate]);

  const handleRowChange = (index: number, field: keyof RowData, value: string) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("screenshot", file);
      fd.append("userId", userId);
      fd.append("jobId", job.v || job.id || "");
      fd.append("weekEnding", selectedDate);
      await axios.post(`${REACT_APP_API_URL}/timesheet`, fd);
      toast.success("Document Override Synced.");
      setStep(3);
    } catch (e) { toast.error("Transmission failed."); }
    finally { setIsLoading(false); }
  };

  const captureAndSubmit = async () => {
    const element = document.getElementById("timesheet-to-capture");
    if (!element) return;
    setIsLoading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const fd = new FormData();
        fd.append("screenshot", blob, "timesheet.png");
        fd.append("userId", userId);
        fd.append("jobId", job.v || job.id || "");
        fd.append("weekEnding", selectedDate);
        await axios.post(`${REACT_APP_API_URL}/timesheet`, fd);
        toast.success("Submission synced to registry.");
        setStep(3);
      }, "image/png");
    } catch (error) { toast.error("Handshake fail."); } 
    finally { setIsLoading(false); }
  };

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
                 <NavI icon={faChartLine} label="Dashboard" onClick={() => navigate('/userdashboard')} />
                 <NavI icon={faWallet} label="Payments" active />
                 <NavI icon={faUsers} label="Opportunities" onClick={() => navigate('/jobopenings')} />
                 <NavI icon={faEnvelope} label="Messages" onClick={() => navigate('/messages')} />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50">Personnel Tools</p>
               <nav className="space-y-1">
                  <NavI icon={faBriefcase} label="Applications" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                  <NavI icon={faFileLines} label="Work Logs" active />
                  <NavI icon={faUserTie} label="Identity Hub" onClick={() => { navigate('/userdetails'); setMobileMenuOpen(false); }} />
               </nav>
           </div>
        </div>

        <div className="p-4 bg-[#0F172A]/40 m-4 rounded-xl space-y-4">
           <div className="px-2"><LanguageToggle /></div>
           <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all rounded-lg text-[10px] font-bold uppercase tracking-widest italic">
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
               <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-sans hidden sm:block">Time Registry Protocol</h1>
            </div>
            <div className="flex items-center gap-4">
               <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 relative border border-slate-100 transition-all">
                  <FontAwesomeIcon icon={faBell} />
               </button>
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
                    <h1 className="text-2xl font-bold text-white tracking-tight">Time Registry</h1>
                    <p className="text-emerald-50/60 text-xs font-medium">Digital Weekly Submission Registry for X3 Personnel</p>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-12 lg:-mt-20 grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10">
               <div className="xl:col-span-9 space-y-6">
                  <AnimatePresence mode="wait">
                     {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#048372]/5 rounded-bl-full group-hover:bg-[#048372]/10 transition-all"></div>
                           <div className="mb-10 flex justify-between items-center bg-slate-50/50 p-6 rounded-xl border border-slate-100 relative z-10">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-[#048372] text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg italic">WS</div>
                                 <div>
                                    <h3 className="text-base font-bold text-slate-800 tracking-tight font-sans">Weekly Snapshot</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Registry Enrollment</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic whitespace-nowrap">Period Epoch:</label>
                                 <input type="date" className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold font-sans outline-none focus:ring-2 ring-[#048372]/10 italic w-40" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                              </div>
                           </div>

                           {!selectedDate ? (
                              <div className="py-32 text-center flex flex-col items-center gap-6 opacity-30">
                                 <FontAwesomeIcon icon={faClock} size="3x" className="text-slate-300" />
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] italic">Await_Date_Selection</p>
                              </div>
                           ) : (
                              <div id="timesheet-to-capture" className="space-y-10">
                                 <div className="overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="w-full text-left font-sans">
                                       <thead className="bg-[#F8FAFC]">
                                          <tr className="text-[10px] font-bold uppercase text-slate-400 tracking-widest border-b border-slate-100 italic">
                                             <th className="px-6 py-4">Date / Day</th>
                                             <th className="px-6 py-4">Start Time</th>
                                             <th className="px-6 py-4">Finish Time</th>
                                             <th className="px-6 py-4 text-center">Lunch</th>
                                             <th className="px-6 py-4 text-right">Initials</th>
                                          </tr>
                                       </thead>
                                       <tbody className="divide-y divide-slate-100 text-xs font-bold">
                                          {rows.map((row, idx) => (
                                             <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                   <span className="text-slate-900">{row.date}</span>
                                                   <span className="text-[10px] uppercase text-[#048372] ml-3 opacity-60 italic">{row.day}</span>
                                                </td>
                                                <td className="px-6 py-4"><input type="time" className="bg-transparent border-none p-0 outline-none text-[#048372] focus:bg-[#048372]/10 rounded px-2" value={row.startTime} onChange={(e) => handleRowChange(idx, 'startTime', e.target.value)} /></td>
                                                <td className="px-6 py-4"><input type="time" className="bg-transparent border-none p-0 outline-none text-[#048372] focus:bg-[#048372]/10 rounded px-2" value={row.finishTime} onChange={(e) => handleRowChange(idx, 'finishTime', e.target.value)} /></td>
                                                <td className="px-6 py-4 text-center"><input type="number" className="bg-transparent border-none p-0 outline-none text-center w-8 italic text-slate-600" value={row.lessLunch} onChange={(e) => handleRowChange(idx, 'lessLunch', e.target.value)} /></td>
                                                <td className="px-6 py-4 text-right"><input type="text" className="bg-transparent border-none p-0 text-right outline-none font-serif italic text-[#048372]/60 uppercase placeholder:opacity-20" value={row.supervisorInitial} onChange={(e) => handleRowChange(idx, 'supervisorInitial', e.target.value)} placeholder="Sign" /></td>
                                             </tr>
                                          ))}
                                       </tbody>
                                    </table>
                                 </div>

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
                                    <div className="space-y-6">
                                       <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                                          <StatItem label="Personnel ID" value={username} />
                                          <StatItem label="Site Location" value={job.address || "Main Site"} />
                                       </div>
                                    </div>
                                    <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-inner">
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Personnel Authorization</p>
                                       <SignaturePad onSave={() => {}} />
                                    </div>
                                 </div>
                              </div>
                           )}
                        </motion.div>
                     )}

                     {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-xl py-24 text-center flex flex-col items-center gap-8 shadow-sm">
                           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl shadow-lg ring-4 ring-emerald-100 italic font-black">OK</div>
                           <div>
                              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-3 font-sans">Transmission Authorized</h2>
                              <p className="text-slate-400 max-w-sm italic text-xs font-bold leading-relaxed px-10">The weekly registry for this personnel has been securely encrypted and transmitted to the command hub.</p>
                           </div>
                           <button onClick={() => navigate('/userdashboard')} className="mt-8 px-10 py-3 bg-[#1E293B] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:bg-slate-800 transition-all font-sans">Return to Dashboard</button>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="xl:col-span-3 space-y-6">
                  <div className="bg-[#048372] rounded-xl p-6 text-white shadow-xl space-y-6 relative overflow-hidden group">
                     <FontAwesomeIcon icon={faFileSignature} className="absolute bottom-[-10px] right-[-10px] text-6xl text-white/10" />
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-70">Handshake Protocol</h4>
                        <p className="text-xs font-medium italic leading-relaxed opacity-90">"I hereby verify that all hours entered in this digital registry represent actual operational time at the assigned site."</p>
                     </div>

                     <button onClick={captureAndSubmit} disabled={isLoading || !selectedDate} className="w-full bg-white text-[#048372] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 shadow-lg uppercase text-[10px] tracking-widest italic hover:brightness-105">
                        {isLoading ? <PulseLoader size={4} color="#048372" /> : (
                           <>
                              <span>Authorize Sync</span>
                              <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                           </>
                        )}
                     </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Manual Override</h4>
                     <p className="text-[9px] font-bold text-slate-500 italic">Upload a signed paper scan if digital capture is unavailable.</p>
                     <input type="file" id="manual-upload" className="hidden" accept="image/*,application/pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                     <label htmlFor="manual-upload" className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:border-[#048372] hover:text-[#048372] cursor-pointer transition-all">Upload Registry Scan</label>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

const NavI = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group relative ${active ? 'bg-[#048372] text-white font-bold shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    <FontAwesomeIcon icon={icon} className={`text-sm w-5 transition-all ${active ? 'scale-110' : 'opacity-40 group-hover:opacity-100'}`} />
    <span className="text-[13px] font-medium tracking-tight overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] font-sans">{label}</span>
  </button>
);

const StatItem = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 border-dashed">
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{label}</p>
     <p className="text-[10px] font-extrabold text-slate-800 uppercase italic opacity-80">{value}</p>
  </div>
);
