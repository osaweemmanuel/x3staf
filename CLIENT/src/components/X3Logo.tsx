import React from 'react';

interface X3LogoProps {
  className?: string;
  light?: boolean;
}

export const X3Logo: React.FC<X3LogoProps> = ({ className = "h-8", light = false }) => {
  return (
    <div className={`flex items-center gap-3 select-none pointer-events-none ${className}`}>
      <svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-auto">
        {/* Vibrant Teal Stylized X */}
        <path d="M4 6L14 26H18L8 6H4Z" fill="#0BD1B0" />
        <path d="M18 6L8 26H4L14 6H18Z" fill="#0BD1B0" />
        {/* Vibrant Teal Stylized 3 */}
        <path d="M22 6H34C37 6 39 8 39 11C39 13.5 37.5 15 35 15.5C38 16 40 18 40 21C40 25 37 26 33 26H22V22H32C34.5 22 36 21.5 36 19.5C36 17.5 34.5 17 32 17H26V14H32C34.5 14 35.5 13.5 35.5 11.5C35.5 9.5 34 10 32 10H22V6Z" fill="#0BD1B0" />
      </svg>
      
      <div className="flex items-baseline font-sans italic">
        <span className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-slate-800'}`}>Staffing</span>
        <span className={`text-[9px] font-black ml-1 uppercase tracking-widest ${light ? 'text-[#0BD1B0]' : 'text-slate-400'}`}>Inc.</span>
      </div>
    </div>
  );
};
