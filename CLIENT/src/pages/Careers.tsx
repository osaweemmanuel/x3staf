import { motion } from "framer-motion";
import { 
  faArrowRight, faGlobe, faEnvelope, faRocket, faUsers, faChartLine, faBriefcase
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export const Careers = () => {
  const Reasons = [
    {
      icon: faRocket,
      title: "X3 Staffing Innovation Hub",
      description: "Thrive in an elite operational culture that values disruptive creativity and forward-thinking logistics.",
    },
    {
      icon: faUsers,
      title: "Interconnected Teams",
      description: "Join a high-performance personnel network where collaborative success is at the core of our hub.",
    },
    {
      icon: faChartLine,
      title: "Exponential Growth",
      description: "Enjoy unprecedented opportunities for professional development within the dynamic staffing industry.",
    },
  ];


  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-500/10">
      {/* 🚀 ELITE HERO SECTION */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-slate-900">
         <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
         </div>

         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="z-10 max-w-4xl space-y-8">
            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full italic">Operational Excellence</span>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
               Join the <span className="text-indigo-400">X3 Staffing Personnel</span> Network
            </h1>
            <p className="text-lg text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
               We believe in building success through high-fidelity talent and operational innovation. Explore opportunities to scale your career with the industry leader.
            </p>
            <div className="pt-8">
               <NavLink to="/register" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:brightness-110 transition-all italic underline decoration-white/20">
                  Begin Onboarding Hub
               </NavLink>
            </div>
         </motion.div>
      </section>

      {/* 🧬 WHY X3 STAFFING? (ELITE ARCHITECTURE) */}
      <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#048372]/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#AECF5A]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10">
            <div className="lg:w-1/2 space-y-12">
               <div>
                  <motion.span 
                     initial={{ opacity: 0 }} 
                     whileInView={{ opacity: 1 }}
                     className="text-[10px] font-black text-[#048372] uppercase tracking-[0.5em] mb-4 block"
                  >
                     Operational DNA
                  </motion.span>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic uppercase">
                     Why Partner <br/><span className="text-[#048372]">With X3 Hub</span>
                  </h3>
               </div>

               <div className="space-y-8">
                  {Reasons.map((r, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-8 group p-6 hover:bg-white hover:shadow-2xl hover:shadow-[#048372]/10 rounded-2xl transition-all duration-500 border border-transparent hover:border-[#048372]/10"
                     >
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#048372] group-hover:bg-[#048372] group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-xl shadow-[#048372]/5">
                           <FontAwesomeIcon icon={r.icon} size="lg" />
                        </div>
                        <div className="flex-grow pt-2">
                           <h4 className="text-lg font-bold text-slate-800 italic uppercase mb-2 leading-none font-sans italic">{r.title}</h4>
                           <p className="text-sm font-bold text-slate-400 leading-relaxed font-sans">{r.description}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>

            <div className="lg:w-1/2 relative group">
               <div className="absolute -inset-6 bg-gradient-to-tr from-[#048372] to-[#AECF5A] rounded-[4rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
               <div className="rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white relative z-10 perspective-1000">
                  <img src="https://images.unsplash.com/photo-1541888941257-182097389945?q=80&w=1470&auto=format&fit=crop" className="w-full h-auto brightness-95 group-hover:scale-110 transition-transform duration-1000 origin-bottom" alt="X3 Staffing Elite Operations" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
               
               {/* 📊 FLOATING TRUST INDEX WIDGET */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-10 -left-10 bg-[#048372] p-8 rounded-[2.5rem] shadow-2xl shadow-[#048372]/40 space-y-2 border border-white/20 backdrop-blur-md z-20 overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <p className="text-4xl font-black italic text-white leading-none tracking-tighter">98<span className="text-[#AECF5A]">%</span></p>
                  <p className="text-[10px] font-black text-emerald-50/60 uppercase tracking-[0.2em] italic">Trust Index Score</p>
               </motion.div>

               <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#AECF5A] rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
         </div>
      </section>

      {/* 📬 APPLY HUB */}
      <section className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
         <div className="max-w-2xl mx-auto px-6 space-y-10">
            <h2 className="text-4xl font-black italic tracking-tighter leading-none">Direct <span className="text-indigo-400 font-black">Handshake</span></h2>
            <p className="text-slate-400 font-bold leading-relaxed">
               If you're interested in joining our network, please submit your metadata registry to <b className="text-white font-black underline decoration-indigo-500 underline-offset-8 italic">careers@x3staffingsolutions.com</b>.
            </p>
            <NavLink to="/register" className="inline-flex items-center gap-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-all group">
               Start Digital Registration <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-2 transition-transform" />
            </NavLink>
         </div>
      </section>

      {/* 🌐 SOCIAL INTELLIGENCE */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter mb-12 uppercase text-center">Open <span className="text-indigo-600">Sequences</span></h2>
            <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mb-20 italic">X3 Staffing Operational Careers Hub</p>
            <div className="flex flex-wrap justify-center gap-8">
               <SocialLink icon={faGlobe} label="Portal" />
               <SocialLink icon={faUsers} label="LinkedIn" />
               <SocialLink icon={faEnvelope} label="Email Hub" />
               <SocialLink icon={faBriefcase} label="Market" />
            </div>
         </div>
      </section>
    </div>
  );
};

const SocialLink = ({ icon, label }: any) => (
  <button className="flex items-center gap-4 px-8 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group">
     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
        <FontAwesomeIcon icon={icon} />
     </div>
     <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 italic">{label}</span>
  </button>
);
