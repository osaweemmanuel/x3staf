import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, setLanguage } from '../auth/languageSlice';
import { motion } from 'framer-motion';

export const LanguageToggle = () => {
  const dispatch = useDispatch();
  const lang = useSelector(selectLanguage);

  return (
    <div className="flex bg-[#0F172A]/40 p-1.5 rounded-xl shadow-inner border border-white/5 relative overflow-hidden group">
      {/* 🟦 SLIDING INDICATOR HANDSHAKE */}
      <motion.div 
        animate={{ x: lang === 'EN' ? 0 : '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-[#048372] rounded-lg shadow-xl shadow-[#048372]/20"
      />

      <button 
        onClick={() => dispatch(setLanguage('EN'))}
        className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all relative z-10 tracking-[0.2em] uppercase italic ${lang === 'EN' ? 'text-white drop-shadow-md' : 'text-slate-500 hover:text-white'}`}
      >
        EN
      </button>
      <button 
        onClick={() => dispatch(setLanguage('FR'))}
        className={`flex-1 py-1.5 rounded-lg text-[11px] font-black transition-all relative z-10 tracking-[0.2em] uppercase italic ${lang === 'FR' ? 'text-white drop-shadow-md' : 'text-slate-500 hover:text-white'}`}
      >
        FR
      </button>
    </div>
  );
};
