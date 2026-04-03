import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-baseline select-none font-Outfit transition-all duration-500 ${className}`}>
      {/* 🚀 THE SYMBOLIC 'X3' */}
      <div className="flex items-baseline">
         <span className="text-[26px] md:text-[32px] font-black tracking-tighter text-[#048372] italic">X</span>
         <span className="text-[26px] md:text-[32px] font-black tracking-tighter text-[#048372] -ml-1">3</span>
      </div>
      
      {/* 🧬 BRAND TYPOGRAPHY */}
      <div className="flex items-baseline ml-2.5">
         <span className="text-[18px] md:text-[22px] font-medium text-white tracking-tight">Staffing</span>
         <span className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">INC.</span>
      </div>
    </div>
  );
};

export default Logo;
