import { useEffect, useState } from "react";
import jobseekersbg from "../assets/BG.png";
import GetInTouch from "../components/GetInTouch";
import Recommendations from "../components/Recommendations";
import toast from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { REACT_APP_API_URL } from "../../constants";

export const Employers = () => {
  const [Industry, setIndustry] = useState("");
  const [FullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [City, setCity] = useState("");
  const [Province, setProvince] = useState("");
  const [jobTitle, setTitle] = useState("");
  const [Positions, setPosition] = useState(0);
  const [skills, setSkills] = useState("");
  const [date, setDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  // const [isSelectFocused, setIsSelectFocused] = useState(false);
  const sectionStyle = {
    backgroundImage: `url(${jobseekersbg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const payload = {
        companyName,
        industry: Industry,
        province: Province,
        city: City,
        jobTitle,
        numberOfPositions: String(Positions),
        skills,
        startDate: date,
        fullName: FullName,
        email,
        number,
        time,
        message
      };

      // Send POST request to backend route
      await axios.post(`${REACT_APP_API_URL}/contact/employer`, payload);
      toast.success("Request logged in Personnel Registry");
      // Clear the form fields
      setEmail("");
      setFullName("");
      setMessage("");
      setCity("");
      setProvince("");
      setTitle("");
      setPosition(0);
      setSkills("");
      setDate("");
      setCompanyName("");
      setNumber("");
      setTime("");
      setIndustry("");
      setIsLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error submitting contact form:", error);
      toast.error("Error submitting form");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsButtonActive(
      email !== "" &&
        FullName !== "" &&
        jobTitle !== "" &&
        message !== "" &&
        Industry !== "" &&
        Positions !== 0 &&
        skills !== "" &&
        date !== "" &&
        companyName !== "" &&
        time !== "" &&
        number !== "" &&
        City !== "" &&
        Province !== ""
    );
  }, [
    email,
    FullName,
    message,
    Industry,
    City,
    Province,
    jobTitle,
    Positions,
    skills,
    date,
    companyName,
    time,
    number,
  ]);
  return (
    <div className="pb-24 flex flex-col justify-center items-center">
      <section
        className="w-full pt-[80px] h-screen flex justify-center items-center flex-col bg-black text-white text-center"
        style={sectionStyle}
      >
        <h1 className="sm:text-5xl w-[90%] max-w-[710px] text-4xl font-semibold">
          Hire Top-Tier Talent with{" "}
          <span className="text-secondary">X3 StaffingInc Solutions</span>
        </h1>
        <span className="lg:w-[800px] w-[90%] text-xs sm:text-base px-5 sm:p-0 mt-2 sm:mt-5">
          Discover a seamless and efficient way to meet your staffing needs. Our
          platform connects you with a pool of pre-vetted, skilled professionals
          in the construction and warehouse industries. Your perfect team
          members are just a click away.
        </span>
      </section>
      <section className="flex flex-col justify-center items-center">
        <div className="rounded-3xl max-w-[706px] w-[90%] border border-gray-300 mb-20 mt-20">
          <aside className="pt-10 px-12 pb-8">
            <h1 className="text-lg sm:text-[32px]/[40px] pb-5 font-semibold text-[#131313]">
              Start Your Effortless Staffing Journey Today!
            </h1>
            <p className="text-sm text-gray-700">
              Fill out our user-friendly form to detail your staffing needs.
              Provide information about the positions, required skills, and any
              specific qualifications you're looking for.
            </p>
            <form
              className="w-full flex flex-col gap-4 py-10"
              onSubmit={handleSubmit}
            >
              <div className="space-x-4 space-y-4">
                <p className="text-sm text-gray-700 mb-5 text-[10px] font-bold uppercase tracking-widest text-[#048372]">
                  Company Information
                </p>
                <div className="w-full flex gap-4">
                  <input
                    type="name"
                    placeholder="ex: XYZ Construction Inc."
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ex: Construction, Warehousing"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={Industry}
                    onChange={(e) => {
                      setIndustry(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full flex gap-4">
                  <input
                    type="text"
                    placeholder="Your State/Province"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={Province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={City}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="space-x-4 space-y-4">
                <p className="text-sm text-gray-700 mb-5 text-[10px] font-bold uppercase tracking-widest text-[#048372]">
                  Staffing Requirements
                </p>
                <div className="w-full flex gap-4">
                  <input
                    type="name"
                    placeholder="ex: Project Manager, Electrician"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={jobTitle}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="ex: 2"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={Positions}
                    onChange={(e) => setPosition(parseInt(e.target.value, 10))}
                  />
                </div>

                <div className="w-full flex gap-4">
                  <input
                    type="text"
                    placeholder="ex: Minimum 3 years of experience"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-x-4 space-y-4">
                <p className="text-sm text-gray-700 mb-5 text-[10px] font-bold uppercase tracking-widest text-[#048372]">
                  Contact Information
                </p>
                <div className="w-full flex gap-4">
                  <input
                    type="name"
                    placeholder="Full Name"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={FullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="w-full flex gap-4">
                  <input
                    type="number"
                    placeholder="ex: (555) 123-4567"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  <input
                    type="time"
                    placeholder="Best Time to Call"
                    className="px-4 py-2 border border-gray-300 placeholder:text-gray-400 w-[50%] rounded-xl text-sm h-[56px] focus:outline-[#048372] shadow-sm"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="space-x-4 space-y-4">
                <p className="text-sm text-gray-700 mb-5 text-[10px] font-bold uppercase tracking-widest text-[#048372]">Additional Details</p>
                <div className="w-full">
                  <textarea
                    placeholder="Any specific requirements or details you'd like us to consider?"
                    className="px-4 py-4 border border-gray-300 placeholder:text-gray-400 w-full rounded-xl text-sm min-h-[120px] focus:outline-[#048372] shadow-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={`w-[240px] h-[56px] ml-auto rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${
                  isButtonActive
                    ? "bg-[#048372] text-white shadow-xl shadow-[#048372]/20 hover:brightness-110"
                    : "bg-gray-200 text-gray-400"
                } mt-6`}
                disabled={!isButtonActive}
              >
                {isLoading ? (
                  <PulseLoader size="8px" color="white" />
                ) : (
                  "Submit Staffing Request"
                )}
              </button>
            </form>
          </aside>
        </div>
      </section>
      <Recommendations BGcolor="#3D4B18" />
      <div className="mt-20 w-full">
        <GetInTouch />
      </div>
    </div>
  );
};
