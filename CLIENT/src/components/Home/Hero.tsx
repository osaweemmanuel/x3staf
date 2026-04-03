import hero from "../../assets/hero (1).png";
import { NavLink } from "react-router-dom";
import Button from "../Button";

const Hero = () => {
  return (
    <section className="px-7 overflow-hidden pb-24 pt-[224px] h-auto bg-black sm:px-16 lg:px-[65px] xl:pl-[101px] relative selection:bg-[#048372]/30">
      <div className="w-full h-full justify-between font-Outfit">
        <div className="w-full xl:w-[52%]">
          <h1 className="text-3xl leading-normal sm:text-6xl sm:leading-[75px] mb-[20px] tracking-tight text-white font-bold italic">
            Revolutionizing Construction and Warehouse{" "}
            <span className="text-[#048372]">Staffing</span>
          </h1>
          <p className="text-sm sm:text-base mb-[40px] text-slate-400 font-medium tracking-[0.5px] italic">
            Your Trusted Partner for Reliable, Efficient, and Accessible Talent
            Solutions across the X3 personnel ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 italic">
            <NavLink
              to="/employers"
              className="transition-all hover:scale-105 active:scale-95 group"
            >
              <Button variant="primary" customClassName="w-full sm:w-[200px] bg-[#048372] border-none italic font-black uppercase tracking-widest shadow-xl shadow-[#048372]/20">
                Call Dispatch
              </Button>
            </NavLink>
            <NavLink
              to="/jobseekers"
              className="transition-all hover:scale-105 active:scale-95"
            >
              <Button variant="secondary" customClassName="w-full sm:w-[200px] text-white border-white/20 hover:border-[#048372] transition-colors italic font-black uppercase tracking-widest">
                Find Job
              </Button>
            </NavLink>
          </div>
        </div>
        <div className="absolute h-[810px] max-xl:hidden w-[44%] top-0 right-0">
          <img src={hero} className="h-full w-auto object-cover opacity-80" alt="hero" />
        </div>
        <div className=" mt-6 w-full block xl:hidden">
          <img src={hero} className="h-auto w-full object-cover rounded-2xl" alt="hero" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
