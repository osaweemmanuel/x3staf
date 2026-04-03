import { useState, useEffect } from "react";
import { 
  faIdCard, faPassport, faCloudArrowUp, faClockRotateLeft, faTrash, faShieldHalved, faChartLine, faWallet, faUsers, faArrowRightFromBracket, faUserTie, faEnvelope, faBriefcase, faFileLines, faBell, faRotate
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { X3Logo } from "../components/X3Logo";
import { useSelector } from "react-redux";
import { selectLanguage } from "../auth/languageSlice";
import { LanguageToggle } from "../components/LanguageToggle";

interface KYCDoc {
  id: string;
  documentType: string;
  status: "Pending" | "Verified" | "Rejected";
  createdAt: string;
  expiryDate?: string;
}

export const KYCDashboard = () => {
  const { userId, username } = useAuth();
  const navigate = useNavigate();
  useSelector(selectLanguage);

  const [documents, setDocuments] = useState<KYCDoc[]>([]);
  const [selectedType, setSelectedType] = useState("Passport");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { fetchKYC(); }, [userId]);

  const fetchKYC = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/kyc/user/${userId}`);
      setDocuments(res.data);
    } catch (err) { console.error(err); } 
    finally { setIsFetching(false); }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a document first");
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      fd.append("userId", userId);
      fd.append("documentType", selectedType);
      await axios.post(`${REACT_APP_API_URL}/kyc/upload`, fd);
      toast.success(`${selectedType} synced to vault!`);
      setFile(null);
      fetchKYC();
    } catch (err) { toast.error("Upload failed."); } 
    finally { setIsLoading(false); }
  };

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

        <div className="px-3 py-6 flex-grow space-y-8 overflow-y-auto">
           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50">Main Menu</p>
              <nav className="space-y-1">
                 <NavI icon={faChartLine} label="Dashboard" onClick={() => { navigate('/userdashboard'); setMobileMenuOpen(false); }} />
                 <NavI icon={faWallet} label="Payments" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faUsers} label="Opportunities" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faEnvelope} label="Messages" onClick={() => { navigate('/messages'); setMobileMenuOpen(false); }} />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4 opacity-50">Personnel Tools</p>
              <nav className="space-y-1">
                 <NavI icon={faBriefcase} label="Applications" onClick={() => { navigate('/jobopenings'); setMobileMenuOpen(false); }} />
                 <NavI icon={faFileLines} label="Work Logs" onClick={() => { navigate('/timesheet'); setMobileMenuOpen(false); }} />
                 <NavI icon={faShieldHalved} label="Compliance" active />
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
               <h1 className="text-sm font-bold text-slate-500 uppercase tracking-widest font-sans hidden sm:block">Identity Vault Registry</h1>
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
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
               <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Identity Vault</h1>
                    <p className="text-emerald-50/60 text-xs font-medium italic">Compliance Assurance & Identity Integrity Registry</p>
                  </div>
               </div>
            </div>

            <div className="px-6 lg:px-10 -mt-12 lg:-mt-20 grid grid-cols-1 xl:grid-cols-12 gap-8 pb-10 relative z-20">
               {/* 📁 UPLOAD SECTION */}
               <div className="xl:col-span-4 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 shadow-sm space-y-6">
                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                        <FontAwesomeIcon icon={faCloudArrowUp} className="text-[#048372]" /> New Proof Submission
                     </h3>
                     
                     <div className="space-y-4">
                        <TypeBtn active={selectedType === 'Passport'} onClick={() => setSelectedType('Passport')} label="X3 Passport" icon={faPassport} />
                        <TypeBtn active={selectedType === 'DriversLicense'} onClick={() => setSelectedType('DriversLicense')} label="Operational License" icon={faIdCard} />

                        <div className="relative group mt-6">
                           <input type="file" className="hidden" id="kyc-file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                           <label htmlFor="kyc-file" className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#048372] hover:bg-[#048372]/5 transition-all group font-sans">
                              <FontAwesomeIcon icon={faCloudArrowUp} className="text-slate-300 group-hover:text-[#048372] transition-colors mb-2" size="lg" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{file ? file.name : 'Select Meta Asset'}</span>
                           </label>
                        </div>

                        <button onClick={handleUpload} disabled={isLoading || !file} className="w-full py-4 bg-[#048372] text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg ring-offset-2 active:scale-95 disabled:opacity-30 transition-all italic mt-4 font-sans">
                           {isLoading ? <PulseLoader size={4} color="white" /> : 'Authorize Sync'}
                        </button>
                     </div>
                  </div>
               </div>

               {/* 📁 LIVE RECORDS TABLE */}
               <div className="xl:col-span-8 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-max">
                     <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic font-sans">Vault Records</h2>
                        <button onClick={fetchKYC} className="text-[10px] font-bold text-[#048372] hover:underline px-3 py-1 bg-[#048372]/5 rounded-md uppercase tracking-tight font-sans">Refresh Vault</button>
                     </div>
                     
                     <div className="divide-y divide-slate-100 min-h-[400px]">
                        {isFetching ? (
                          <div className="h-[400px] flex items-center justify-center"><PulseLoader color="#048372" size={8} /></div>
                        ) : (
                          documents.length === 0 ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-slate-200 italic opacity-40">
                               <FontAwesomeIcon icon={faClockRotateLeft} size="3x" className="mb-4" />
                               <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Vault_Neutral</p>
                            </div>
                          ) : documents.map((doc) => (
                            <div key={doc.id} className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-[#048372]">
                               <div className="flex items-center gap-5">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 shadow-inner'}`}>
                                     <FontAwesomeIcon icon={doc.documentType.includes('Passport') ? faPassport : faIdCard} />
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-bold text-slate-800 uppercase italic leading-none mb-1 font-sans">{doc.documentType}</h4>
                                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-sans">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-6">
                                  <span className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest italic border font-sans ${
                                    doc.status === 'Verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 
                                    doc.status === 'Rejected' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-400'
                                  }`}>
                                    {doc.status}
                                  </span>
                                  <button className="w-10 h-10 bg-white border border-slate-200 text-slate-300 rounded-lg hover:text-rose-600 hover:border-rose-100 transition-all"><FontAwesomeIcon icon={faTrash} size="xs" /></button>
                               </div>
                            </div>
                          ))
                        )}
                     </div>
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

const TypeBtn = ({ active, onClick, label, icon }: any) => (
  <button onClick={onClick} className={`w-full p-4 rounded-xl flex items-center gap-4 border transition-all ${active ? 'border-[#048372] bg-[#048372]/5 text-[#048372] shadow-sm font-bold' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>
    <FontAwesomeIcon icon={icon} className="text-base" />
    <span className="text-[10px] font-bold uppercase tracking-widest leading-none italic font-sans">{label}</span>
  </button>
);
