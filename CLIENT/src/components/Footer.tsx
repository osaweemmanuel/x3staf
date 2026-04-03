import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faShieldHalved, faGlobe, faEnvelope, faUsers, faLocationDot 
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#0F172A] pt-32 pb-16 px-10 selection:bg-[#048372]/30 selection:text-white font-Outfit backdrop-blur-3xl relative overflow-hidden">
      {/* 🔮 BACKGROUND AMBIENCE DECOR */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#048372]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">
        
        {/* 🏢 BRAND ARCHITECTURE */}
        <div className="lg:col-span-4 space-y-10">
          <div className="flex flex-col gap-6">
             <Logo className="scale-110 origin-left" />
             <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm italic opacity-80">
                The industry-leading high-fidelity platform for construction and warehouse personnel management. Scalable logistics, verified identity hubs, and real-time operational telemetry.
             </p>
          </div>
          <div className="flex gap-4">
             <SocialIcon icon={faUsers} url="https://www.linkedin.com/company/x3staffinginc" />
             <SocialIcon icon={faGlobe} url="https://web.facebook.com/x3staffinginc" />
             <SocialIcon icon={faEnvelope} url="mailto:info@X3staffinginc.ca" />
          </div>
        </div>

        {/* 🧭 NAVIGATION REGISTRY */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <h4 className="text-[10px] font-black text-[#048372] uppercase tracking-[0.4em] italic mb-6">Directory</h4>
          <ul className="space-y-4">
             <FootLink to="/about" label="Identity Registry" />
             <FootLink to="/services" label="Operations Hub" />
             <FootLink to="/jobseekers" label="Personnel Assets" />
             <FootLink to="/employers" label="Enterprise Portal" />
             <FootLink to="/careers" label="Careers Gateway" />
          </ul>
        </div>

        {/* 📍 GEOLOCATION HUB */}
        <div className="lg:col-span-3 space-y-8">
          <h4 className="text-[10px] font-black text-[#048372] uppercase tracking-[0.4em] italic mb-6">HQ Metadata</h4>
          <div className="flex gap-4 group">
             <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-[#048372] group-hover:text-white transition-all duration-700 border border-white/5 group-hover:border-[#048372]/30 shadow-lg">
                <FontAwesomeIcon icon={faLocationDot} />
             </div>
             <div>
                <p className="text-xs font-black text-white italic uppercase tracking-wider mb-1">Langley Hub 01</p>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic opacity-70">20686 Eastleigh Crescent,<br/>Langley BC. V3A 0M4</p>
             </div>
          </div>
        </div>

        {/* 📊 SYSTEM STATUS */}
        <div className="lg:col-span-3 space-y-8">
           <h4 className="text-[10px] font-black text-[#048372] uppercase tracking-[0.4em] italic mb-6">System Health</h4>
           <div className="p-7 bg-slate-800/30 rounded-3xl border border-white/5 space-y-5 backdrop-blur-xl hover:border-[#048372]/20 transition-all duration-500">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 tracking-widest italic">
                 <span>Operational Status</span>
                 <span className="text-[#AECF5A] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#AECF5A] rounded-full animate-pulse shadow-[0_0_8px_#AECF5A]"></span>
                    Live Network
                 </span>
              </div>
              <div className="h-1 bg-slate-700/50 w-full overflow-hidden rounded-full p-[1px]">
                 <div className="h-full bg-gradient-to-r from-[#048372] to-[#AECF5A] w-[98%] shadow-[0_0_15px_rgba(4,131,114,0.4)] rounded-full"></div>
              </div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic opacity-60">99.9% Core Registry Uptime</p>
              <div className="pt-5 border-t border-white/5">
                 <NavLink to="/admin/signin" className="text-[10px] font-black text-[#048372] hover:text-white uppercase tracking-[0.2em] italic flex items-center gap-2 transition-all group">
                    <FontAwesomeIcon icon={faShieldHalved} className="text-[9px] group-hover:scale-125 transition-transform" />
                    Admin Command Hub
                 </NavLink>
              </div>
           </div>
        </div>
      </div>

      {/* ⚖️ LEGAL FOOTER */}
      <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic font-sans opacity-60 italic">© 2024 X3 Staffing Inc. All Rights Reserved Registry.</p>
        <div className="flex gap-10">
           <LegalLink label="Standard Protocol" />
           <LegalLink label="Privacy Meta" />
           <LegalLink label="Hub Terms" />
        </div>
      </div>
    </footer>
  );
};

const FootLink = ({ to, label }: any) => (
  <li>
     <NavLink to={to} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#048372] transition-all italic block decoration-transparent hover:decoration-[#048372] underline underline-offset-8 decoration-2 opacity-80 hover:opacity-100">
        {label}
     </NavLink>
  </li>
);

const LegalLink = ({ label }: any) => (
  <button className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-[#048372] transition-all italic underline decoration-transparent hover:decoration-[#048372]/30 underline-offset-4 font-sans opacity-60 hover:opacity-100">
     {label}
  </button>
);

const SocialIcon = ({ icon, url }: any) => (
  <a href={url} target="_blank" rel="noreferrer" className="w-11 h-11 bg-slate-800/50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-[#048372] hover:text-white hover:scale-110 active:scale-90 transition-all duration-500 border border-white/5 shadow-inner">
     <FontAwesomeIcon icon={icon} size="sm" />
  </a>
);

export default Footer;
