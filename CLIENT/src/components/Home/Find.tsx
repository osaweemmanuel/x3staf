import shake from "../../assets/shake.png";
import talent from "../../assets/talent.png";
import art1 from "../../assets/art1.svg";
import art2 from "../../assets/art2.svg";

import { NavLink } from "react-router-dom";

import Button from "../Button";

const Find = () => {
  return (
    <section className="px-7 overflow-hidden space-y-24 py-24 sm:px-16 lg:px-[65px] xl:pl-[101px] relative bg-white selection:bg-[#048372]/10 font-Outfit">
      <div className="flex max-lg:flex-col-reverse justify-start items-center gap-16 relative">
        <img
          src={art1}
          alt="design"
          className="absolute -right-14 top-11 max-md:w-52 h-auto opacity-20"
        />
        <img src={shake} alt="img" className="w-full lg:w-[454px] h-auto shadow-2xl rounded-2xl" />
        <div className="lg:max-w-[556px] w-full space-y-8">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-3">
             <div className="w-8 h-[2px] bg-[#048372]"></div> For Job Seekers
          </div>
          <h1 className="text-4xl sm:text-[45px] leading-tight font-bold tracking-tight italic">
            Find Your Next <span className="text-[#048372]">Opportunity</span>
          </h1>
          <p className="font-medium text-slate-500 text-sm sm:text-base leading-relaxed italic">
            Browse through our dynamic job listings and discover exciting
            opportunities in the construction and warehouse industries. Sign in
            now for a personalized X3 job-seeking experience.
          </p>
          <div className="flex flex-col gap-y-4 pt-2">
            <div className="flex justify-start gap-x-3 items-center group">
              <div className="w-6 h-6 bg-emerald-50 text-[#048372] rounded-full flex items-center justify-center text-[10px] group-hover:scale-110 transition-all shadow-sm italic font-black">X3</div>
              <p className="font-bold text-xs sm:text-sm text-slate-700 uppercase tracking-tight italic">Streamlined application process</p>
            </div>
            <div className="flex justify-start gap-x-3 items-center group">
              <div className="w-6 h-6 bg-emerald-50 text-[#048372] rounded-full flex items-center justify-center text-[10px] group-hover:scale-110 transition-all shadow-sm italic font-black">X3</div>
              <p className="font-bold text-xs sm:text-sm text-slate-700 uppercase tracking-tight italic">Curated suitable assignments</p>
            </div>
          </div>
          <NavLink
            to="/jobseekers"
            className="transition-all donate hover:scale-110 block w-max mt-10"
          >
            <Button variant="primary" customClassName="w-[220px] bg-[#048372] border-none italic font-bold text-xs tracking-[0.2em] shadow-xl shadow-[#048372]/20 shadow-[0_0_20px_rgba(4,131,114,0.3)]">
              Find jobs
            </Button>
          </NavLink>
        </div>
      </div>
      
      <div className="flex max-lg:flex-col justify-start items-center gap-16 relative">
        <img
          src={art2}
          alt="design"
          className="absolute -z-10 -left-20 top-0 max-md:w-52 h-auto opacity-20"
        />
        <div className="lg:max-w-[556px] w-full space-y-8">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-3">
             <div className="w-8 h-[2px] bg-[#AECF5A]"></div> For Employers
          </div>
          <h1 className="text-4xl sm:text-[45px] leading-tight font-bold tracking-tight italic">
            Hire Top-Tier <span className="text-[#AECF5A]">Talent</span>
          </h1>
          <p className="font-medium text-slate-500 text-sm sm:text-base leading-relaxed italic">
            Streamline your staffing process by requesting skilled X3 professionals
            directly through our platform. Experience efficient and reliable
            talent solutions.
          </p>
          <div className="flex flex-col gap-y-4 pt-2">
            <div className="flex justify-start gap-x-3 items-center group">
              <div className="w-6 h-6 bg-[#AECF5A]/10 text-[#AECF5A] rounded-full flex items-center justify-center text-[10px] group-hover:scale-110 transition-all shadow-sm italic font-black">X3</div>
              <p className="font-bold text-xs sm:text-sm text-slate-700 uppercase tracking-tight italic">Skilled and vetted professionals</p>
            </div>
            <div className="flex justify-start gap-x-3 items-center group">
              <div className="w-6 h-6 bg-[#AECF5A]/10 text-[#AECF5A] rounded-full flex items-center justify-center text-[10px] group-hover:scale-110 transition-all shadow-sm italic font-black">X3</div>
              <p className="font-bold text-xs sm:text-sm text-slate-700 uppercase tracking-tight italic">Digital Monitoring Assistance</p>
            </div>
          </div>
          <NavLink
            to="/employers"
            className="transition-all donate hover:scale-110 block w-max mt-10"
          >
            <Button variant="primary" customClassName="w-[220px] bg-[#048372] border-none italic font-bold text-xs tracking-[0.2em] shadow-xl shadow-[#048372]/10">
              Request Talent
            </Button>
          </NavLink>
        </div>
        <img src={talent} alt="img" className="w-full lg:w-[454px] h-auto shadow-2xl rounded-2xl" />
      </div>
    </section>
  );
};

export default Find;
