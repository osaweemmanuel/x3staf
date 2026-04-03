import Button from "../Button";
import { NavLink } from "react-router-dom";

const Explore = () => {
  return (
    <section className="px-7 overflow-hidden bg-black py-20 sm:px-16 lg:px-[65px] xl:pl-[101px] relative selection:bg-[#048372]/30 font-Outfit">
      <div className="gap-y-4 mb-16 flex sm:items-center flex-col">
        <h1 className="sm:text-center text-white text-4xl sm:text-[45px] leading-tight font-bold italic tracking-tight">
          Explore Our Comprehensive <br />{" "}
          <span className="text-[#048372]">Staffing Services</span>
        </h1>
        <p className="text-slate-400 font-medium text-sm sm:text-base w-full max-w-[626px] sm:text-center italic leading-relaxed">
          At X3 StaffingInc Solutions, we pride ourselves on delivering a
          diverse range of staffing services tailored to meet the unique needs
          of the construction and warehouse industries.
        </p>
      </div>
      <div className="gap-3 mb-10 flex justify-center flex-wrap">
        <X3ServiceCard bg="bg-[url('../assets/woman.png')]" title="General Labour" desc="Versatile and skilled labor for various tasks on construction sites." />
        <X3ServiceCard bg="bg-[url('../assets/man.png')]" title="Skilled Labour" desc="Highly trained professionals for specialized construction needs." />
        <X3ServiceCard bg="bg-[url('../assets/women.png')]" title="Safety Officers" desc="Ensuring a secure and compliant work environment with X3 protocols." />
      </div>
      <div className="flex justify-center mt-12">
        <NavLink
          to="/services"
          className="transition-all donate hover:scale-110"
        >
          <Button
            variant="secondary"
            customClassName="w-[200px] text-white border-white/20 hover:border-[#048372] italic font-bold text-xs uppercase tracking-widest"
          >
            Explore Services
          </Button>
        </NavLink>
      </div>
    </section>
  );
};

const X3ServiceCard = ({ bg, title, desc }: any) => (
  <div className="relative rounded-2xl h-[358px] sm:w-[312px] lg:w-[342px] w-full group overflow-hidden shadow-2xl border border-white/5">
     <div className={`${bg} h-full w-auto bg-no-repeat bg-left bg-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0`}>
        <div className="flex flex-col h-full justify-end px-6 pb-10 bg-gradient-to-t from-black via-black/40 to-transparent space-y-4">
           <div className="flex items-center gap-3">
              <div className="w-1 h-3 bg-[#048372]"></div>
              <p className="text-white font-bold text-base uppercase tracking-tight italic">
                 {title}
              </p>
           </div>
           <p className="text-slate-300 font-medium text-xs leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
              {desc}
           </p>
        </div>
     </div>
  </div>
);

export default Explore;
