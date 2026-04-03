import welcome from "../../assets/welcome.png";
import accessiblity from "../../assets/icons/accessibility.svg";
import efficiency from "../../assets/icons/efficiency.svg";
import reliability from "../../assets/icons/reliablility.svg";

const Welcome = () => {
  return (
    <section className="px-7 overflow-hidden py-24 sm:px-16 lg:px-[65px] xl:pl-[101px] relative bg-white selection:bg-[#048372]/10 font-Outfit">
      <div className="flex max-lg:flex-col justify-between gap-x-8 gap-y-14">
        <div className="space-y-12 w-full lg:w-[52%]">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-[45px] leading-tight font-bold italic tracking-tight">
              Welcome to <span className="text-[#048372]">X3 StaffingInc!</span>
            </h1>
            <p className="font-medium text-slate-500 text-sm sm:text-base italic leading-relaxed">
              At X3 StaffingInc Solutions, we are committed to
              transforming the construction and warehouse staffing industry.
              With a focus on reliability, efficiency, and accessibility, we
              connect skilled professionals with companies seeking top-tier
              talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <X3Value icon={reliability} label="Reliability" color="text-[#048372]" desc="We ensure that our staffing solutions are dependable, allowing companies to focus on their projects with confidence." />
             <X3Value icon={efficiency} label="Efficiency" color="text-[#AECF5A]" desc="Streamlined processes make it quick and easy for job seekers to find suitable employment and for companies to access top-tier talent." />
             <X3Value icon={accessiblity} label="Accessibility" color="text-[#048372]" desc="We prioritize accessibility, providing a user-friendly platform and personalized assistance throughout the staffing process." />
          </div>
        </div>
        <div className="w-full lg:w-[43%]">
          <img
            src={welcome}
            className="w-full h-auto object-cover rounded-2xl shadow-2xl skew-x-1"
            alt="welcome image"
          />
        </div>
      </div>
    </section>
  );
};

const X3Value = ({ icon, label, color, desc }: any) => (
  <div className="space-y-3 group">
    <div className="flex gap-x-3 items-center">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center p-1.5 shadow-inner border border-slate-100 group-hover:scale-110 transition-all">
         <img src={icon} alt="icon" className="w-full h-auto" />
      </div>
      <p className={`font-bold text-sm sm:text-base uppercase tracking-widest italic ${color}`}>
        {label}
      </p>
    </div>
    <p className="font-medium text-[11px] sm:text-xs text-slate-400 italic leading-relaxed group-hover:text-slate-600 transition-colors">
      {desc}
    </p>
  </div>
);

export default Welcome;
