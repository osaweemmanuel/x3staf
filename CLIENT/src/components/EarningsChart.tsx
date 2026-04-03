import { motion } from 'framer-motion';

export const EarningsChart = () => {
  const data = [120, 450, 320, 680, 510, 890, 750]; // Sample weekly earnings
  const max = Math.max(...data);
  const height = 150;
  const width = 400;

  // Generate path points
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d / max) * height
  }));

  const pathData = `M ${points[0].x} ${points[0].y} ` + 
    points.map((p, i) => i === 0 ? '' : `L ${p.x} ${p.y}`).join(' ');

  const areaData = pathData + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="relative w-full h-40 mt-4 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl p-4">
      <div className="flex justify-between items-center mb-4">
         <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Live Performance Index</h4>
         <span className="text-xl font-black text-white tracking-tighter">$2,430.00</span>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#048372" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#048372" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Shadow Area */}
        <motion.path 
          d={areaData} 
          fill="url(#gradient)"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Main Line */}
        <motion.path 
          d={pathData} 
          fill="none" 
          stroke="#048372" 
          strokeWidth="3" 
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Pulse Points */}
        {points.map((p, i) => (
           <motion.circle 
             key={i} 
             cx={p.x} 
             cy={p.y} 
             r="4" 
             fill="#048372" 
             initial={{ scale: 0 }}
             animate={{ scale: [0, 1.2, 1] }}
             transition={{ delay: i * 0.1, duration: 0.5 }}
           />
        ))}
      </svg>
      
      <div className="flex justify-between mt-3 text-[8px] font-bold text-slate-600 uppercase tracking-widest px-1">
         <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </div>
  );
};
