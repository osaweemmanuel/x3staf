import Recommendations from "../components/Recommendations";
import first from "../assets/engineersworking.png";
import second from "../assets/enigineerstalking.png";
import third from "../assets/holdinghelmet.png";
import valueimage from "../assets/femaleengineer.png";
import workingfemaleimage from "../assets/workingfemale.png";
import accessiblity from "../assets/icons/accessibility.svg";
import efficiency from "../assets/icons/efficiency.svg";
import reliability from "../assets/icons/reliablility.svg";
import expertise from "../assets/icons/expertise.svg";
import innovation from "../assets/icons/Innovation.svg";
import communityfocus from "../assets/icons/communityfocus.svg";
import personalizedservice from "../assets/icons/personalizedservice.svg";
import GetInTouch from "../components/GetInTouch";

const missionValues = [
  {
    icon: reliability,
    title: "Reliability",
    description:
      "We ensure that our staffing solutions are dependable, allowing companies to focus on their projects with confidence.",
  },
  {
    icon: efficiency,
    title: "Efficiency",
    description:
      "Streamlined processes make it quick and easy for job seekers to find suitable employment and for companies to access top-tier talent.",
  },
  {
    icon: accessiblity,
    title: "Accessibility",
    description:
      "We prioritize accessibility, providing a user-friendly platform and personalized assistance throughout the staffing process.",
  },
];

const chooseUsData = [
  {
    icon: expertise,
    title: "Expertise",
    description:
      "Benefit from our industry knowledge and experience, ensuring that we understand the unique staffing needs of the construction and warehouse sectors.",
  },
  {
    icon: innovation,
    title: "Innovation",
    description:
      "Stay ahead with our innovative approach, leveraging advanced technology to streamline the staffing process for both employers and job seekers.",
  },
  {
    icon: communityfocus,
    title: "Community Focus",
    description:
      "We believe in fostering a sense of community, connecting professionals with opportunities that align with their goals and helping companies build successful teams.",
  },
  {
    icon: personalizedservice,
    title: "Personalized Service",
    description:
      "Experience a personalized approach to staffing solutions. Our dedicated team is committed to understanding your specific needs, providing tailored assistance, and delivering a service that goes beyond expectations.",
  },
];

export const About = () => {
  return (
    <div className="pb-24">
      {/* Intro */}
      <section className="w-full pt-[80px] h-screen flex justify-center items-center flex-col bg-black text-white text-center">
        <h1 className="sm:text-5xl w-[90%] text-4xl font-semibold lg:w-[900px]">
          Empowering Success in Construction and{" "}
          <span className="text-secondary">Warehouse Staffing</span>
        </h1>
        <span className="lg:w-[800px] w-[90%] text-xs sm:text-base px-5 sm:p-0 mt-2 sm:mt-5">
          Welcome to X3 Staffing, where innovation meets expertise
          in revolutionizing the construction and warehouse staffing industry.
          Our commitment to excellence, reliability, and efficiency sets us
          apart as your trusted partner in connecting job seekers with quality
          opportunities and companies with top-tier talent.
        </span>
        <div className="flex w-full h-[250px] mt-10 justify-center items-center">
          <div className="flex h-[220px] sm:gap-6 gap-3">
            <img
              src={third}
              className="h-full rounded-2xl shadow-lg brightness-90 hover:brightness-100 transition-all sm:block hidden"
              alt="Third"
            />
            <img
              src={second}
              className="h-full rounded-2xl shadow-xl brightness-110 hover:scale-105 transition-all"
              alt="Second"
            />
            <img
              src={first}
              className="h-full rounded-2xl shadow-lg brightness-90 hover:brightness-100 transition-all sm:block hidden"
              alt="First"
            />
          </div>
        </div>
      </section>
      {/* Our Mission and Values */}
      <section className="bg-white py-20 px-3 flex flex-col justify-start items-center gap-16 relative">
        {/* Our Mission */}
        <div className="flex lg:flex-row flex-col lg:h-[510px] container justify-center items-center gap-16 w-screen">
          <div className="w-[90%] lg:w-[40%]">
            <div>
              <h1 className="text-black text-3xl font-semibold">
                Our <span className="text-primary">Mission</span>
              </h1>
              <p className="mt-4 text-xs">
                At X3, our mission is to empower success by bridging the gap
                between skilled professionals and companies in need of their
                expertise. We strive to create a seamless and accessible
                platform that fosters growth, efficiency, and mutual success for
                both job seekers and employers.
              </p>
            </div>
            <div className="mt-5">
              <h1 className="mb-5 font-semibold">Values We Uphold:</h1>
              <div className="space-y-4">
                {missionValues.map((value, index) => (
                  <div key={index} className="flex gap-x-2 items-center">
                    <img
                      src={value.icon}
                      alt="icon"
                      className="w-[30px] mb-auto h-auto"
                    />
                    <section>
                      <p className="font-semibold text-sm sm:text-base text-black">
                        {value.title}
                      </p>
                      <p className={`font-normal sm:text-sm mb-6 text-xs`}>
                        {value.description}
                      </p>
                    </section>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sm:h-full max-w-[470px] h-[400px]">
            <img
              src={valueimage}
              className={`h-full w-auto`}
              alt="Value Image"
            />
          </div>
        </div>
        <div className="flex flex-col w-full max-w-5xl pb-10 sm:pb-5">
          <h1 className="font-semibold text-center lg:text-left text-3xl text-gray-800 w-full">
            Together, we build success,
            <br /> one connection at a time
          </h1>
          <div className="flex lg:flex-row flex-col gap-10 mt-10 items-center">
            <section className="flex w-[90%] lg:w-1/2 h-[250px] lg:justify-end justify-center items-center">
              <img
                src={workingfemaleimage}
                className={`sm:h-full w-full sm:w-auto`}
                alt="Value Image"
              />
            </section>
            <section className="flex flex-col w-[90%] lg:w-1/2 sm:h-[200px] justify-start items-center">
              <h1 className="mr-auto mb-5 font-semibold text-3xl">
                Our <span className="text-primary">Story</span>
              </h1>
              <p>
                Founded with a vision to transform the staffing landscape, X3
                Staffing began its journey with the belief that
                matching the right talent with the right opportunity could be a
                catalyst for success in the construction and warehouse sectors.
                Over the years, we've evolved into a dynamic platform, driven by
                a passion for facilitating meaningful connections and
                contributing to the growth of businesses and careers.
              </p>
            </section>
          </div>
        </div>
      </section>
      {/* Why Choose? */}
      <section className="pt-20 pb-32 bg-[#0F100D] text-white w-full flex flex-col justify-center items-center">
        <h1 className="font-semibold text-3xl w-full text-center pb-10">
          Why Choose X3 Staffing
        </h1>
        <div className="flex flex-wrap gap-10 w-full lg:w-[800px] items-center justify-center">
          {chooseUsData.map((data, index) => (
            <div
              key={index}
              className="min-w-[320px] max-w-[350px] bg-[#202020] h-[200px] flex flex-col justify-center gap-2 px-5 text-xs"
              style={{ boxShadow: "3px 4px 0px 0px black" }}
            >
              <img src={data.icon} alt="icon" className="w-[30px] mb-2" />
              <h1 className="text-base">{data.title}</h1>
              <p>{data.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Recommendations BGcolor="#ffffff" />
      {/* Get in touch */}
      <GetInTouch />
    </div>
  );
};
