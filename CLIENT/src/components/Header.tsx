import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { menuItems } from "../data/menuItems";
import HamburgerIcon from "./HamburgerIcon";

const Header: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.pageYOffset > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-700 font-Outfit ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent py-5'}`}>
      {/* 📡 OPERATION BAR PULSE (TEAL PROTOCOL) */}
      <AnimatePresence>
        {!isScrolled && !navOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-0 left-0 w-full overflow-hidden hidden lg:block border-b border-white/5">
            <div className="max-w-[1500px] mx-auto px-7 xl:px-20 py-2 flex justify-end gap-10 relative z-50">
               <div className="flex items-center gap-2 group cursor-pointer">
                  <FontAwesomeIcon icon={faCircleNodes} className="text-[#048372] text-[11px] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider italic">Call Dispatch <a href="tel:7788625073" className="text-white hover:text-[#AECF5A] ml-1 transition-colors">778-862-5073</a></span>
               </div>
               <div className="flex items-center gap-2 group cursor-pointer">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[#048372] text-[11px] group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider italic">Get Jobs <a href="tel:7788625073" className="text-white hover:text-[#AECF5A] ml-1 transition-colors">778-862-5073</a></span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="max-w-[1500px] mx-auto px-7 xl:px-20 flex justify-between items-center relative mt-0 lg:mt-8 transition-all duration-700">
        {/* BRAND LOGO (SYNCHRONIZED WITH BRAND IDENTITY) */}
        <NavLink to="/" className="relative z-[110] transition-transform hover:scale-105 active:scale-95 duration-500">
           <Logo className="scale-[0.85] md:scale-100 origin-left" />
        </NavLink>

        {/* 🧭 DESKTOP NAVIGATION REGISTRY */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-7">
            {menuItems.map((item) => (
              <li key={item.key}>
                <NavLink to={item.where} className={({isActive}) => `text-[13px] font-black uppercase tracking-tight transition-all hover:text-[#048372] ${isActive ? 'text-[#048372] underline decoration-[#048372]/30 underline-offset-8' : 'text-white'}`}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="flex gap-4">
             <NavLink to="/jobseekers" className="px-8 py-3.5 rounded-lg text-[11px] font-black uppercase tracking-widest border border-white/30 text-white hover:bg-[#048372] hover:border-[#048372] hover:shadow-lg hover:shadow-[#048372]/20 transition-all text-center min-w-[130px] italic font-sans italic">
                Get Jobs
             </NavLink>
             <NavLink to="/register" className="px-8 py-3.5 rounded-lg text-[11px] font-black uppercase tracking-widest bg-[#048372] text-white hover:brightness-110 shadow-xl shadow-[#048372]/20 transition-all text-center min-w-[130px] flex items-center justify-center translate-y-[-1px] italic">
                Call Dispatch
             </NavLink>
          </div>
        </div>

        {/* 🖱️ MOBILE INTERFACE TRIGGER */}
        <div className="lg:hidden relative z-[110]" onClick={() => setNavOpen(!navOpen)}>
           <HamburgerIcon isOpen={navOpen} />
        </div>

        {/* 📱 MOBILE OVERLAY HUB */}
        <AnimatePresence>
          {navOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[100] pt-32 px-10 flex flex-col justify-between pb-20">
               <ul className="space-y-8">
                  {menuItems.map((item, i) => (
                    <motion.li key={item.key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                      <NavLink to={item.where} onClick={() => setNavOpen(false)} className="text-3xl font-black italic uppercase text-white tracking-tighter hover:text-[#048372] transition-all block underline decoration-[#048372]/0 hover:decoration-[#048372]/40 underline-offset-8">
                        {item.name}
                      </NavLink>
                    </motion.li>
                  ))}
               </ul>
               <div className="space-y-4">
                  <NavLink to="/jobseekers" onClick={() => setNavOpen(false) } className="w-full py-5 border border-white/20 text-white rounded-2xl font-black uppercase text-xs tracking-widest text-center flex items-center justify-center italic hover:bg-white/5 transition-all">Get Jobs Hub</NavLink>
                  <NavLink to="/register" onClick={() => setNavOpen(false)} className="w-full py-5 bg-[#048372] text-white rounded-2xl font-black uppercase text-xs tracking-widest text-center flex items-center justify-center italic shadow-xl shadow-[#048372]/20">Call Dispatch Hub</NavLink>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
