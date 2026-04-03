import { motion } from 'framer-motion';
import { faBolt, faMicrochip, faShieldHeart, faSignature, faGlobe, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GlassCard from './GlassCard';

const features = [
  {
    icon: faMicrochip,
    title: "AI talent matching",
    desc: "Optimized candidate ranking using local Canadian labor insights.",
    color: "from-primary to-emerald-400"
  },
  {
    icon: faBolt,
    title: "1-Click Broadcast",
    desc: "Instantly notify matching contractors. Fill roles in minutes.",
    color: "from-amber-400 to-orange-500"
  },
  {
    icon: faSignature,
    title: "Digital Verification",
    desc: "Paperless timesheets with integrated secure digital signatures.",
    color: "from-blue-400 to-indigo-600"
  },
  {
    icon: faShieldHeart,
    title: "Verified Identity",
    desc: "Robust KYC document vault for secure contractor onboarding.",
    color: "from-rose-400 to-pink-600"
  },
  {
    icon: faGlobe,
    title: "Bilingual (EN/FR)",
    desc: "Full Canadian French support for seamless national reach.",
    color: "from-slate-700 to-slate-900"
  },
  {
    icon: faFileInvoiceDollar,
    title: "Automated Invoicing",
    desc: "Verified work receipts and tax-compliant digital invoices.",
    color: "from-emerald-600 to-teal-800"
  }
];

const FeaturesShowcase = () => {
  return (
    <section className="py-24 px-8 bg-[#0F100D] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4 block">Engineered for Excellence</span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">WHAT WE DO BEST</h2>
          <p className="max-w-2xl mx-auto text-slate-400 font-medium">
            Bridging the gap between Canadian business needs and elite labor talent through 
            automation, verification, and real-time intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <GlassCard className="h-full bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all duration-500 backdrop-blur-3xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-8 shadow-xl transform group-hover:rotate-6 transition-transform`}>
                  <FontAwesomeIcon icon={f.icon} size="lg" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
