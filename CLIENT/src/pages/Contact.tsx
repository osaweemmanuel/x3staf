import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Recommendations from "../components/Recommendations";
// import Twitter from "../assets/icons/Twitter.svg";
import Linkedln from "../assets/icons/Linkedln.svg";
import Instagram from "../assets/icons/instagram.svg";
import Facebook from "../assets/icons/facebook.svg";
import toast from "react-hot-toast";
import axios from "axios";
import { REACT_APP_API_URL } from "../../constants";
import { PulseLoader } from "react-spinners";

export const Contact = () => {
  const [Email, setEmail] = useState("");
  const [FullName, setFullName] = useState("");
  const [Subject, setSubject] = useState("");
  const [Message, setMessage] = useState("");
  const [JobSeekerOREmployer, setJobSeekerOREmployer] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        fullName: FullName,
        email: Email,
        subject: Subject,
        message: Message,
        userType: JobSeekerOREmployer
      };

      // Send POST request to backend route
      await axios.post(`${REACT_APP_API_URL}/contact/`, payload);
      toast.success("Message logged in registry.");
      // Clear the form fields
      setEmail("");
      setFullName("");
      setSubject("");
      setMessage("");
      setJobSeekerOREmployer("");
      setIsLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error submitting contact form:", error);
      toast.error("Error submitting form");
      setIsLoading(false);
    }
  };

  const handleJobSeekerChange = (value: any) => {
    setJobSeekerOREmployer(value);
  };

  useEffect(() => {
    setIsButtonActive(
      Email !== "" &&
        FullName !== "" &&
        Subject !== "" &&
        Message !== "" &&
        JobSeekerOREmployer !== ""
    );
  }, [Email, FullName, Subject, Message, JobSeekerOREmployer]);

  return (
    <div className="pb-24 font-Outfit">
      <section className="w-full pt-[80px] h-screen flex justify-center items-center flex-col bg-[#0F172A] text-white text-center relative overflow-hidden">
        {/* 🎆 ATMOSPHERIC DECOR */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#048372]/10 blur-[150px] rounded-full"></div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="sm:text-6xl w-[90%] text-4xl font-black italic tracking-tighter relative z-10"
        >
          Connect with <span className="text-[#048372]">X3 Staffing INC.</span>
        </motion.h1>
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="lg:w-[800px] w-[90%] text-sm sm:text-lg px-5 sm:p-0 mt-6 sm:mt-8 text-slate-400 font-medium italic relative z-10 leading-relaxed"
        >
          Whether you have questions, need assistance, or are ready to embark on
          a strategic partnership, we're here for you. Reach out to the X3 Hub 
          through the official channels below. Your inquiries are prioritized 
          by our dispatch team.
        </motion.span>
      </section>
      <section className="flex flex-col justify-center items-center">
        <div className="rounded-3xl max-w-[706px] w-[90%] border border-gray-300 mb-10 mt-7">
          <aside className="pt-10 px-12 pb-5">
            <h1 className="text-lg pb-5">We're Listening</h1>
            <p className="text-sm text-gray-700">
              Feel free to use the contact form below to send us a message.
              Whether it's a question about our services, a partnership
              proposal, or a general inquiry, we'll get back to you promptly.
            </p>
            <form
              className="w-full flex flex-col gap-4 py-10"
              onSubmit={handleSubmit}
            >
              <div className="w-full flex gap-4">
                {/* FullName */}
                <input
                  type="name"
                  placeholder="Full Name"
                  className="px-4 py-2 border border-gray-500 placeholder:text-gray-500 w-[50%] rounded text-sm h-[56px] focus:outline-primary"
                  value={FullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  className="px-4 py-2 border border-gray-500 placeholder:text-gray-500 w-[50%] rounded text-sm h-[56px] focus:outline-primary"
                  value={Email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsButtonActive(
                      e.target.value !== "" &&
                        FullName !== "" &&
                        Subject !== "" &&
                        Message !== "" &&
                        JobSeekerOREmployer !== ""
                    );
                  }}
                />
              </div>
              <div className="w-full flex gap-4">
                {/* Job Seeker Or Employer Option */}
                <div
                  className={`w-1/2 px-4 py-2 border ${
                    isSelectFocused ? "border-primary" : "border-gray-500"
                  } flex items-center rounded text-sm h-[56px] focus-within:ring-1 focus-within:ring-primary`}
                >
                  <select
                    className="w-full bg-white h-full focus:outline-none text-gray-500"
                    value={JobSeekerOREmployer}
                    onChange={(e) => handleJobSeekerChange(e.target.value)}
                    onFocus={() => setIsSelectFocused(true)}
                    onBlur={() => setIsSelectFocused(false)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option
                      value="JobSeeker"
                      className="text-black bg-primary selection:bg-white"
                    >
                      Job Seeker
                    </option>
                    <option value="Employer" className="text-black bg-primary">
                      Employer
                    </option>
                  </select>
                </div>
                {/* Subject */}
                <input
                  type="text"
                  placeholder="Subject"
                  className="px-4 py-2 border border-gray-500 placeholder:text-gray-500 w-1/2 rounded text-sm h-[56px] focus:outline-primary"
                  value={Subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setIsButtonActive(
                      e.target.value !== "" &&
                        FullName !== "" &&
                        Email !== "" &&
                        Message !== "" &&
                        JobSeekerOREmployer !== ""
                    );
                  }}
                />
              </div>
              <div className="w-full">
                {/* Message */}
                <input
                  type="text"
                  placeholder="Write your message"
                  className="px-4 py-2 border border-gray-500 placeholder:text-gray-500 w-full rounded text-sm h-[56px] focus:outline-primary"
                  value={Message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                className={`w-[200px] h-[56px] ml-auto ${
                  isButtonActive
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                } mt-2`}
                disabled={!isButtonActive}
              >
                {isLoading ? (
                  <PulseLoader size="8px" color="white" />
                ) : (
                  "Submit Message"
                )}
              </button>
            </form>
          </aside>
          <aside className="bg-[#D1E1A7] rounded-b-3xl border-t border-t-gray-300 text-gray-800 flex flex-col w-full justify-center items-start px-10 py-10">
            <div>
              <h1 className="text-lg">Contact Information</h1>
              <h2 className="text-sm mt-5 mb-1">Visit Us</h2>
              <p className="text-sm">X3 StaffingInc</p>
              <p className="text-sm">
                20686 Eastleigh Crescent, Langley BC. V3A 0M4
              </p>
            </div>
            <div className="mt-5">
              <h2 className="text-base mb-1">Call Us:</h2>
              <p className="flex gap-3">
                <span className="text-sm">778-862-5073</span>
              </p>
            </div>
            <div className="flex flex-col mt-5">
              <h2 className="text-base mb-1">Email Us:</h2>
              <div>
                <p className="text-sm">
                  General Inquiries:{" "}
                  <a href="mailto:info@X3staffinginc.ca">
                    info@X3staffinginc.ca
                  </a>
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-5">
              <h2 className="text-sm">Socials</h2>
              <div className="flex gap-4 mt-3 items-center text-sm">
                {/* <img src={Twitter} className={`w-[16px]`} alt="Twitter" /> */}
                <a
                  href="https://www.linkedin.com/company/x3staffinginc"
                  className="hover:opacity-60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Linkedln} className={`w-[16px]`} alt="Linkedln" />
                </a>
                <a
                  href="https://web.facebook.com/x3staffinginc"
                  className="hover:opacity-60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Facebook} className={`w-[16px]`} alt="Facebook" />
                </a>
                <a
                  href="https://www.instagram.com/x3staffing?igsh=MTZvYmZmcW8xc2N6ag=="
                  className="hover:opacity-60"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Instagram} className={`w-[16px]`} alt="Instagram" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <Recommendations BGcolor="#0F100D" />
    </div>
  );
};
