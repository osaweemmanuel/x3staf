import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  return (
    <div className={`backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-2xl p-8 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
