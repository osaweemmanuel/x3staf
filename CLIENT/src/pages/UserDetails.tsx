import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  faShieldHalved, faChartLine, faUsers, faUserTie, faArrowRightFromBracket, faSearch, faChevronLeft,
  faCloudArrowUp, faTrash, faCircleCheck, faFilePdf, faWallet, faRotate
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import PDFViewer from "../components/PDFViewer";
import useAuth from "../hooks/useAuth";
import { REACT_APP_API_URL } from "../../constants";
import { LanguageToggle } from "../components/LanguageToggle";

interface CertificateType {
  originalname: string;
  mimetype: string;
  base64Pdf: string | undefined;
}

interface UserProfile {
  _id: string;
  user: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  role?: string;
  streetAddress?: string;
  streetAddressLine2?: string;
  city?: string;
  stateProvince?: string;
  preferredJobType?: string;
  preferredLocations?: string;
  availableStartDate?: string;
  availability?: string[];
  daysAvailable?: string[];
  methodOfTransportation?: string[];
  additionalNotes?: string;
  yearsOfConstructionExperience?: number;
  otherExperience?: string[];
  equipmentsOwned?: string[];
  certifications?: CertificateType[];
}

export const UserDetails = () => {
  const navigate = useNavigate();
  const { userId, username } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [certType, setCertType] = useState<string>("Driver's License");
  const [certExpiry, setCertExpiry] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    firstName: "", lastName: "", phoneNumber: "", role: "", email: "",
    streetAddress: "", streetAddressLine2: "", city: "", stateProvince: "",
    preferredJobTypes: [], preferredLocations: "", availableStartDate: "",
    availability: [], daysAvailable: [], methodOfTransportation: [],
    additionalNotes: "", yearsOfConstructionExperience: "",
    otherExperience: [], equipmentsOwned: [], certifications: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/userProfiles/${userId}`);
        setUserProfile(res.data);
        if (res.data) {
          setFormData({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            phoneNumber: res.data.phoneNumber || "",
            role: res.data.role || "",
            email: res.data.email || "",
            streetAddress: res.data.streetAddress || "",
            streetAddressLine2: res.data.streetAddressLine2 || "",
            city: res.data.city || "",
            stateProvince: res.data.stateProvince || "",
            preferredJobTypes: res.data.preferredJobTypes || [],
            preferredLocations: res.data.preferredLocations || "",
            availableStartDate: res.data.availableStartDate || "",
            availability: res.data.availability || [],
            daysAvailable: res.data.daysAvailable || [],
            methodOfTransportation: res.data.methodOfTransportation || [],
            additionalNotes: res.data.additionalNotes || "",
            yearsOfConstructionExperience: res.data.yearsOfConstructionExperience || "",
            otherExperience: res.data.otherExperience || [],
            equipmentsOwned: res.data.equipmentsOwned || [],
            certifications: res.data.certifications || [],
          });
        }
      } catch (e: any) {
        console.error("X3 Sync Error:", e);
        if (e.response?.status === 404) toast.error("No active profile detected.");
      }
    };
    fetchProfile();
  }, [userId]);

  const handleUploadPdf = async (file: File) => {
    try {
      if (!userProfile?._id) return toast.error("Profile registry required.");
      if (!certExpiry) return toast.error("Expiration date required for legitimacy audit.");
      setUploading(true);
      const fd = new FormData();
      fd.append("pdf", file);
      fd.append("certType", certType);
      fd.append("expiryDate", certExpiry);
      
      const res = await axios.post(`${REACT_APP_API_URL}/upload/certifications/${userProfile._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData((p: any) => ({
        ...p, certifications: [...p.certifications, res.data]
      }));
      toast.success("Document Synced to Vault.");
      setCertExpiry("");
    } catch (e) { toast.error("Upload handshake error."); }
    finally { setUploading(false); }
  };

  const handlePatch = async () => {
    setIsLoading(true);
    try {
      const { certifications, ...payload } = formData;
      await axios.patch(`${REACT_APP_API_URL}/userProfiles/${userId}`, { ...payload, user: userId });
      toast.success("Profile Registry Updated.");
      navigate("/userdashboard");
    } catch (e) { toast.error("Update failed."); } 
    finally { setIsLoading(false); }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((p: any) => ({
        ...p, [name]: checked ? [...p[name], value] : p[name].filter((v: string) => v !== value)
      }));
    } else {
      setFormData((p: any) => ({ ...p, [name]: value }));
    }
  };

  const removeCert = async (idx: number) => {
    try {
      const res = await axios.patch(`${REACT_APP_API_URL}/userProfiles/${userId}/${idx}`, { user: userId });
      setFormData((p: any) => ({ ...p, certifications: res.data.certifications }));
      toast.success("Certificate purged.");
    } catch (e) { toast.error("Removal handshake error."); }
  };

  const steps = ["Registry", "Logistics", "Expertise", "Verification"];

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* 🧭 X3-STYLE SIDEBAR */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}></div>
      <aside className={`w-64 bg-[#F9FBFC] border-r border-slate-200 flex flex-col fixed h-full z-[101] transition-all duration-350 shadow-2xl lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-8 justify-between">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                 <FontAwesomeIcon icon={faShieldHalved} size="sm" />
              </div>
              <span className="font-extrabold tracking-tight text-xl text-slate-800">X3 Staffing</span>
           </div>
           <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-indigo-600">
              <FontAwesomeIcon icon={faRotate} className="text-xs" />
           </button>
        </div>

        <div className="px-5 py-4 flex-grow space-y-8 overflow-y-auto">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">General</p>
              <nav className="space-y-1">
                 <NavI icon={faChartLine} label="Dashboard" onClick={() => navigate('/userdashboard')} />
                 <NavI icon={faWallet} label="Payments" onClick={() => navigate('/timesheet')} />
                 <NavI icon={faUsers} label="Opportunities" onClick={() => navigate('/jobopenings')} />
              </nav>
           </div>

           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Personnel</p>
              <nav className="space-y-1">
                 <NavI icon={faUserTie} label="Identity Profile" active />
                 <NavI icon={faShieldHalved} label="Compliance Hub" onClick={() => navigate('/kyc')} />
              </nav>
           </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white/50 space-y-4">
           <LanguageToggle />
           <button onClick={() => navigate('/')} className="flex items-center gap-3 text-rose-500 hover:text-rose-700 transition-colors text-[10px] font-black uppercase tracking-widest px-3 italic">
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out X3 Staffing
           </button>
        </div>
      </aside>

      {/* 🚀 MAIN INTERFACE SECTION */}
      <main className="flex-grow lg:ml-64 p-0 flex flex-col h-screen overflow-hidden">
        {/* X3 TOP NAV */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg">
                 <div className="w-5 h-4 flex flex-col justify-between">
                    <div className="h-[2px] w-full bg-indigo-600"></div>
                    <div className="h-[2px] w-4/5 bg-indigo-600"></div>
                    <div className="h-[2px] w-full bg-indigo-600"></div>
                 </div>
              </button>
              <div className="relative w-48 sm:w-96 group">
                 <input type="text" placeholder="Search registry..." className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-10 pr-12 text-sm font-medium outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-400" />
                 <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shadow-indigo-100 border border-white/20">{username?.charAt(0)}</div>
           </div>
        </header>

        <div className="flex-grow overflow-y-auto p-6 lg:p-10 space-y-10">
           <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
              <div>
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">Personnel Ledger</h1>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-3">
                    <div className="w-4 h-[2px] bg-indigo-500"></div> Unified Worker Profile Management
                 </p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Authorized Personnel Registry</p>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">X3 Staffing Inc © 2024</p>
              </div>
           </header>

           {/* 🧬 STEPPER PROGRESS HUB */}
           <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-12 relative">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
                 {steps.map((s, i) => (
                    <div key={s} className="flex flex-col items-center">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border-4 transition-all duration-500 ${stageIndex >= i ? 'bg-indigo-600 border-indigo-100 text-white shadow-xl shadow-indigo-200' : 'bg-white border-slate-50 text-slate-300'}`}>
                          {stageIndex > i ? <FontAwesomeIcon icon={faCircleCheck} /> : `0${i+1}`}
                       </div>
                       <span className={`text-[9px] font-black uppercase tracking-widest mt-3 ${stageIndex >= i ? 'text-indigo-600' : 'text-slate-300'}`}>{s}</span>
                    </div>
                 ))}
              </div>

              <AnimatePresence mode="wait">
                 <motion.div key={stageIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border border-slate-100 rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-12 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-10 w-24 h-24 bg-indigo-500/5 rotate-45 translate-x-12 -translate-y-12"></div>
                    
                    {stageIndex === 0 && (
                       <div className="space-y-8">
                          <HeaderSection title="Personnel Metadata" desc="Core identity information for the global directory." />
                          <div className="grid grid-cols-2 gap-6">
                             <X3Input label="Legal First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                             <X3Input label="Legal Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <X3Input label="Registry Email" name="email" value={formData.email} onChange={handleChange} type="email" />
                             <X3Input label="Mobile Pulse" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                          </div>
                          <X3Input label="Classification / Role" name="role" value={formData.role} onChange={handleChange} />
                          <div className="grid grid-cols-2 gap-6">
                             <X3Input label="Primary Hub Address" name="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                             <X3Input label="City Hub" name="city" value={formData.city} onChange={handleChange} />
                          </div>
                       </div>
                    )}

                    {stageIndex === 1 && (
                       <div className="space-y-8">
                          <HeaderSection title="Logistics & Continuity" desc="Define your operational window and location preferences." />
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic">Target Sectors</label>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {["General Labour", "Skilled Labour", "Carpentry", "Electrician", "Telehandler", "First Aid"].map(opt => (
                                   <X3Check key={opt} label={opt} name="preferredJobTypes" checked={formData.preferredJobTypes.includes(opt)} onChange={handleChange} />
                                ))}
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             <X3Input label="Availability Start" name="availableStartDate" value={formData.availableStartDate} onChange={handleChange} type="date" />
                             <X3Input label="Preferred Locations" name="preferredLocations" value={formData.preferredLocations} onChange={handleChange} />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic">Weekly Window</label>
                             <div className="flex gap-2 flex-wrap">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                   <X3Check key={day} label={day} name="daysAvailable" checked={formData.daysAvailable.includes(day)} onChange={handleChange} tiny />
                                ))}
                             </div>
                          </div>
                       </div>
                    )}

                    {stageIndex === 2 && (
                       <div className="space-y-8">
                          <HeaderSection title="Expertise Matrix" desc="Quantify your field experience and specialized tooling." />
                          <X3Input label="Years of Field Ops" name="yearsOfConstructionExperience" value={formData.yearsOfConstructionExperience} onChange={handleChange} type="number" />
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic">Experience Map</label>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {["Carpentry", "Concrete", "Drywall", "Demo", "Hoist", "Forklift", "Warehouse", "TCP"].map(opt => (
                                   <X3Check key={opt} label={opt} name="otherExperience" checked={formData.otherExperience.includes(opt)} onChange={handleChange} />
                                ))}
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic">Mandatory Asset Checklist (PPE)</label>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {["Hard Hat", "Vest", "Safety Boots", "Gloves", "Glasses"].map(opt => (
                                   <X3Check key={opt} label={opt} name="equipmentsOwned" checked={formData.equipmentsOwned.includes(opt)} onChange={handleChange} />
                                ))}
                             </div>
                          </div>
                       </div>
                    )}

                    {stageIndex === 3 && (
                       <div className="space-y-8">
                          <HeaderSection title="Proof Verification" desc="Upload PDF certificates to the operational vault." />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {formData.certifications.map((c: any, i: number) => (
                                <div key={i} className="bg-[#F9FBFC] border border-slate-100 rounded-2xl p-6 flex items-center justify-between group hover:border-indigo-400 transition-all">
                                   <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewingPdf(`data:${c.mimetype};base64,${c.base64Pdf}`)}>
                                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FontAwesomeIcon icon={faFilePdf} /></div>
                                      <div>
                                         <p className="text-[10px] font-black uppercase text-slate-700 truncate max-w-[120px]">{c.originalname}</p>
                                         <p className="text-[8px] font-bold text-indigo-500 uppercase">{c.certType || 'Personnel Asset'} • Expires: {c.expiryDate || 'N/A'}</p>
                                      </div>
                                   </div>
                                   <button onClick={() => removeCert(i)} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                             ))}
                             
                             <div className="bg-white border border-slate-100 rounded-2xl p-8 space-y-6 shadow-sm">
                                <HeaderSection title="Capture Legit Document" desc="Specify asset metadata before visual capture." />
                                <div className="space-y-4">
                                   <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Document Spectrum</label>
                                      <select 
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold outline-none focus:ring-2 ring-indigo-500/10 italic"
                                        value={certType}
                                        onChange={(e) => setCertType(e.target.value)}
                                      >
                                         <option value="Driver's License">Driver's License Hub</option>
                                         <option value="Forklift Certificate">Forklift Ops Mastery</option>
                                         <option value="Work Safety (WHMIS)">WHMIS Safety Pulse</option>
                                         <option value="First Aid (CPR)">First Aid / CPR Pulse</option>
                                         <option value="TCP Certification">TCP Traffic Pulse</option>
                                         <option value="Identity Passport">International Passport Vault</option>
                                      </select>
                                   </div>
                                   <div>
                                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Audit Expiration Epoch</label>
                                      <input 
                                        type="date" 
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-[10px] font-bold outline-none focus:ring-2 ring-indigo-500/10 italic"
                                        value={certExpiry}
                                        onChange={(e) => setCertExpiry(e.target.value)}
                                      />
                                   </div>
                                   <div className="relative group pt-2">
                                      <input type="file" className="hidden" id="cert-up" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleUploadPdf(e.target.files[0])} />
                                      <label htmlFor="cert-up" className="w-full h-full min-h-[60px] bg-indigo-600/5 border-2 border-dashed border-indigo-200 rounded-xl flex items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/20 transition-all group">
                                         {uploading ? <PulseLoader size={4} color="#4F46E5" /> : (
                                           <>
                                             <FontAwesomeIcon icon={faCloudArrowUp} className="text-indigo-400 group-hover:text-indigo-600 transition-all" />
                                             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">Authorize & Push Asset</span>
                                           </>
                                         )}
                                      </label>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                       <button 
                         onClick={() => stageIndex > 0 ? setStageIndex(stageIndex - 1) : navigate('/userdashboard')} 
                         className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all text-[10px] font-black uppercase tracking-widest italic"
                       >
                          <FontAwesomeIcon icon={faChevronLeft} /> {stageIndex === 0 ? 'Dashboard Hub' : 'Previous Epoch'}
                       </button>
                       <button 
                         onClick={() => stageIndex < 3 ? setStageIndex(stageIndex + 1) : handlePatch()} 
                         disabled={isLoading}
                         className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:brightness-110 active:scale-95 transition-all italic underline decoration-white/20"
                       >
                         {isLoading ? <PulseLoader size={4} color="white" /> : (stageIndex === 3 ? 'Authorize Full Sync' : 'Proceed Ledger')}
                       </button>
                    </div>
                 </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </main>

      {/* PDF VIEWER MODAL */}
      <AnimatePresence>
         {viewingPdf && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md">
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                  <button onClick={() => setViewingPdf(null)} className="absolute top-8 right-8 w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-rose-500 text-2xl font-black flex items-center justify-center z-10">×</button>
                  <div className="flex-grow overflow-y-auto">
                     <PDFViewer base64Pdf={viewingPdf} />
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

const NavI = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all group relative ${active ? 'bg-white text-indigo-600 font-bold shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>
    <FontAwesomeIcon icon={icon} className={`text-base w-5 ${active ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-900'}`} />
    <span className="text-[11px] font-bold tracking-tight">{label}</span>
  </button>
);

const HeaderSection = ({ title, desc }: any) => (
  <div>
     <h2 className="text-xl font-black text-slate-800 italic uppercase leading-none mb-1">{title}</h2>
     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{desc}</p>
  </div>
);

const X3Input = ({ label, ...props }: any) => (
  <div className="space-y-2">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">{label}</label>
     <input {...props} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-indigo-500/10 italic text-slate-800 transition-all" />
  </div>
);

const X3Check = ({ label, tiny, ...props }: any) => (
  <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${props.checked ? 'bg-indigo-50/50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-slate-100'} ${tiny ? 'p-3' : ''}`}>
     <input type="checkbox" className="hidden" {...props} />
     <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${props.checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
     </div>
     <span className={`text-[10px] font-black uppercase tracking-tight italic ${tiny ? 'text-[9px]' : ''}`}>{label}</span>
  </label>
);
