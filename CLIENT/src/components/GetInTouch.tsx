import sms from "../assets/icons/smsicon.svg";
import call from "../assets/icons/callicon.svg";
import { useNavigate } from "react-router-dom";

const GetInTouch = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-primary rounded-xl h-[340px] w-[95%] max-w-[900px] text-white flex flex-col justify-center items-center gap-y-5">
        <h1 className="text-3xl font-semibold">
          Get in <span className="text-light">Touch</span>
        </h1>
        <p className="w-[90%] max-w-[550px] text-center">
          Have questions or inquiries? Reach out to us. Our dedicated team is
          ready to assist you. Fill out a form or use the contact information
          provided.
        </p>
        <section className="text-sm flex gap-5">
          <div className="flex items-center gap-1.5">
            <img src={sms} alt="icon" className="w-[20px]" />
            <a href="mailto:info@X3staffinginc.ca">info@X3staffinginc.ca</a>
          </div>
          <div className="flex items-center  gap-1.5">
            <img src={call} alt="icon" className="w-[20px]" />
            <a href="tel:+7788625073"></a>
            <span>778-862-5073</span>
          </div>
        </section>
        <button
          onClick={() => {
            navigate("/contact");
          }}
          className="mt-5 text-black text-xs h-[50px] w-[180px] bg-light rounded"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default GetInTouch;
