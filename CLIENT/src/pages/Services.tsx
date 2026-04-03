import GetInTouch from "../components/GetInTouch";
import Recommendations from "../components/Recommendations";
import Generallabour from "../assets/generallabour.png";
import Skilledlabour from "../assets/skilledlabour.png";
import ContructionSafteyOfficers from "../assets/constructionsafetyofficers.png";
import TeleHandlers from "../assets/telehandlers.png";
import Carpenters from "../assets/carpenters.png";
import Electricians from "../assets/electricians.png";
import HoistOperators from "../assets/hoistoperators.png";
import ElevatorOperators from "../assets/elevatoroperators.png";
import FirstAidAttendants from "../assets/firstaidattendants.png";
import TrafficControlPersonnel from "../assets/trafficcontrolpersonnel.png";
import Demolition from "../assets/demolition.png";
import Landscaping from "../assets/landscsaping.png";
import CleaningService from "../assets/cleaningservice.png";
import { NavLink } from "react-router-dom";

const servicesData = [
  {
    image: Generallabour,
    title: "General Labour",
    description: "Multi-sector workforce ready for loading, site preparation, and fundamental infrastructure support. We provide reliable personnel for immediate deployment across construction and warehousing hubs.",
    buttonLink: "/general-labour",
  },
  {
    image: Skilledlabour,
    title: "Skilled Labour",
    description: "Access a tiered hierarchy of specialized professionals. From precision technicians to trade leads, our skilled personnel bring high-efficiency tactical expertise to complex projects.",
    buttonLink: "/skilled-labour",
  },
  {
    image: ContructionSafteyOfficers,
    title: "Safety Officers & CSOs",
    description: "Elite oversight for site compliance and risk mitigation. Our CSOs enforce strict safety protocols, ensuring zero-incident target achievement and regulatory alignment.",
    buttonLink: "/skilled-labour",
  },
  {
    image: TeleHandlers,
    title: "Heavy Equipment Ops",
    description: "Certified mastery of telehandlers, forklifts, and industrial machinery. We provide operators who prioritize machine integrity and operational velocity.",
    buttonLink: "/skilled-labour",
  },
  {
    image: Carpenters,
    title: "Precision Carpentry",
    description: "Strategic woodworking, structural framing, and high-end finishing. Our carpenters deliver structural excellence and aesthetic precision for commercial and residential sectors.",
    buttonLink: "/skilled-labour",
  },
  {
    image: Electricians,
    title: "Electrical Grid Hub",
    description: "Licensed electricians for power distribution, systems integration, and maintenance. Ensuring continuous energy flow and compliance with national electrical protocols.",
    buttonLink: "/skilled-labour",
  },
  {
    image: HoistOperators,
    title: "Hoist & Vertical Ops",
    description: "Strategic management of vertical logistics. Our operators ensure the rhythmic movement of materials and personnel across multi-tier construction infrastructure.",
    buttonLink: "/skilled-labour",
  },
  {
    image: ElevatorOperators,
    title: "Elevator Logistics",
    description: "Seamless personnel transport for high-rise developments. Dedicated operators focused on safety, load optimization, and time-sensitive movement.",
    buttonLink: "/skilled-labour",
  },
  {
    image: FirstAidAttendants,
    title: "Medical & First Aid",
    description: "Immediate trauma response and health monitoring. Our attendants are trained for high-stakes environments, ensuring personnel well-being and rapid medical pulse.",
    buttonLink: "/skilled-labour",
  },
  {
    image: TrafficControlPersonnel,
    title: "TCP & Traffic Pulse",
    description: "Global infrastructure traffic management. Our TCPs deploy advanced flow control tactics to protect work zones and maintain urban logistical speed.",
    buttonLink: "/skilled-labour",
  },
  {
    image: Demolition,
    title: "Controlled Demolition",
    description: "Tactical deconstruction and site clearing protocols. We manage phased demolition with a focus on material salvage and environmental safety.",
    buttonLink: "/skilled-labour",
  },
  {
    image: Landscaping,
    title: "Territorial Landscaping",
    description: "Civil and aesthetic landscape engineering. From ground preparation to final flora deployment, our teams transform industrial and residential terrain.",
    buttonLink: "/skilled-labour",
  },
  {
    image: CleaningService,
    title: "Post-Construction Clean",
    description: "Deep-registry cleaning for site transitions. We provide specialized janitorial pulses for post-construction handovers and ongoing facility hygiene.",
    buttonLink: "/skilled-labour",
  },
  {
    image: Skilledlabour,
    title: "Warehousing & Logistics",
    description: "High-volume inventory management, order fulfillment, and distribution logistics. We provide the personnel pulse required for modern supply chain velocity.",
    buttonLink: "/skilled-labour",
  },
  {
    image: ContructionSafteyOfficers,
    title: "Security & Asset Guard",
    description: "Perimeter protection and site surveillance. Our security assets ensure that high-value equipment and project zones remain authorized environments.",
    buttonLink: "/skilled-labour",
  },
];

export const Services = () => {
  return (
    <div className="pb-24">
      <section className="w-full pt-32 pb-20 flex justify-center items-center flex-col bg-[#0F172A] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <h1 className="sm:text-6xl w-[90%] text-4xl font-black max-w-[900px] uppercase italic tracking-tighter leading-tight relative z-10">
          Tailored Staffing <span className="text-[#AECF5A]">Solutions</span> for Global <span className="text-[#048372]">Industries</span>
        </h1>
        <p className="lg:w-[700px] w-[90%] text-xs sm:text-sm px-5 sm:p-0 mt-6 font-bold uppercase tracking-[0.3em] text-slate-400 opacity-80 relative z-10 italic">
          High-performance personnel placement for construction, logistics, and specialized infrastructure.
        </p>
      </section>

      <section className="flex justify-center items-center w-full bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20 px-6 w-full max-w-[1400px]">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden group hover:border-[#048372] transition-all hover:shadow-2xl hover:shadow-[#048372]/10 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                   <span className="text-[10px] font-black text-[#AECF5A] px-2 py-1 rounded bg-black/40 backdrop-blur-md uppercase tracking-widest italic border border-white/20">Authorized Service</span>
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-slate-800 uppercase italic mb-4 group-hover:text-[#048372] transition-colors font-sans">{service.title}</h3>
                <p className="text-xs font-bold text-slate-500 italic leading-relaxed mb-8 flex-grow font-sans">{service.description}</p>
                <NavLink
                  to="/employers"
                  className="mt-auto"
                >
                  <button className="w-full py-4 bg-[#0F172A] text-[#AECF5A] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#048372] hover:text-white transition-all italic font-sans border border-[#AECF5A]/20">
                    Request Personnel Hub
                  </button>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Recommendations BGcolor="#0F100D" />
      <div className="pt-20">
        <GetInTouch />
      </div>
    </div>
  );
};
