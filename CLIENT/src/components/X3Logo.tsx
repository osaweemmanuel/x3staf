import React from 'react';
import logo from '../assets/logoColoured.svg';
import logoLight from '../assets/logo.svg';

interface X3LogoProps {
  className?: string;
  light?: boolean;
}

export const X3Logo: React.FC<X3LogoProps> = ({ className = "h-8", light = false }) => {
  return (
    <div className={`flex items-center select-none pointer-events-none ${className}`}>
      <img 
        src={light ? logoLight : logo} 
        alt="X3 Staffing Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
};
