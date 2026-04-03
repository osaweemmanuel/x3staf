import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CanadaTimeIndex = () => {
  const [times, setTimes] = useState<any[]>([]);

  const zones = [
    { name: 'Vancouver (PT)', zone: 'America/Vancouver' },
    { name: 'Edmonton (MT)', zone: 'America/Edmonton' },
    { name: 'Winnipeg (CT)', zone: 'America/Winnipeg' },
    { name: 'Toronto (ET)', zone: 'America/Toronto' },
    { name: 'Halifax (AT)', zone: 'America/Halifax' },
    { name: 'St. Johns (NT)', zone: 'America/St_Johns' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const updated = zones.map(z => ({
        ...z,
        time: new Intl.DateTimeFormat('en-CA', {
          timeZone: z.zone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(now)
      }));
      setTimes(updated);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
      {times.map((t, i) => (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={t.zone} 
          className="flex flex-col items-center bg-white/5 backdrop-blur px-4 py-2 rounded-xl border border-white/10 min-w-[120px]"
        >
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter opacity-70">{t.name}</span>
          <span className="text-sm font-black text-white tabular-nums">{t.time}</span>
        </motion.div>
      ))}
    </div>
  );
};
