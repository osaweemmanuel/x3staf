import React from 'react';
import logoAsset from "../assets/appLogo.svg";

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center select-none transition-all duration-500 ${className}`}>
        <img 
          src={logoAsset} 
          alt="X3 Staffing INC" 
          className="h-10 md:h-12 w-auto" 
        />
    </div>
  );
};

export default Logo;
