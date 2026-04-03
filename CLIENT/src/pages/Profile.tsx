import { useState, useEffect, useRef } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { PDFExport } from "@progress/kendo-react-pdf";
import { useNavigate } from "react-router-dom";

import location from "../assets/icons/location.svg";
import download from "../assets/icons/download.svg";
import notes from "../assets/Illust.png";
import certification from "../assets/Certificate.png";
import Button from "../components/Button";

import { REACT_APP_API_URL } from "../../constants";
import PDFViewer from "../components/PDFViewer";
import { BarLoader } from "react-spinners";
import toast from "react-hot-toast";

interface CertificateType {
  originalname: string;
  mimetype: string;
  base64Pdf: string | undefined; // base64Pdf can be either a string or undefined
}

export const Profile = () => {
  const navigate = useNavigate();
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const { userId, username } = useAuth();
  const [certificateDetails, setCertificateDetails] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [selectedCertPdf, setSelectedCertPdf] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetching(true);
        const response = await axios.get(`${REACT_APP_API_URL}/userProfiles/${userId}`);
        setUserProfile(response.data);
        console.log("User profile:", userProfile);
        setFetching(false);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          toast.error("No user profile found");
        } else {
          toast.error("Bad network connection, try again");
          console.error("Error fetching user profile:", error);
        }
        setFetching(false);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Calculate profile completeness when userProfile changes
    if (userProfile) {
      const totalFields = Object.keys(userProfile).length;
      const filledFields = Object.values(userProfile).filter(
        (value) => value !== null && value !== undefined && value !== ""
      ).length;
      const completeness = (filledFields / totalFields) * 100;
      setProfileCompleteness(completeness);
    }
  }, [userProfile]);

  const pdfExportComponent = useRef<any>(null);

  const handleExportWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  const completeProfile = () => {
    // Your cancel functionality here
    navigate("/userdetails");
  };

  const handleJobClick = async (certificate: CertificateType) => {
    setCertificateDetails(true);
    setSelectedCertPdf(
      `data:${certificate.mimetype};base64,${certificate.base64Pdf}`
    );
  };

  return (
    <div className="flex-grow lg:px-24 px-7 pt-32 pb-9">
      <div className="shadow-md rounded-lg h-max w-full">
        <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary"
            style={{ width: `${profileCompleteness}%` }}
          ></div>
        </div>

        {fetching ? (
          <div className="w-full">
            <div className="flex px-4 py-6 justify-start items-center gap-x-4">
              <div className="w-[90px] h-[90px] bg-[#AECF5A] rounded-full flex text-black justify-center items-center text-[36px]">
                {username[0]}
              </div>
              <div>
                <p className="text-2xl font-normal mb-1">{username}</p>

                <p className="font-medium text-sm tracking-[0.25px] mb-1 text-left font-Raleway">
                  No Job Title
                </p>

                <div className="flex justify-start items-center gap-x-1">
                  <img src={location} alt="clock" className="w-3 h-auto" />
                  <p className="font-normal text-[12px]/[16px] font-Raleway">
                    No location
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center h-[20pc] w-full">
              <BarLoader color="black" />
            </div>
          </div>
        ) : userProfile ? (
          <div>
            <PDFExport ref={pdfExportComponent}>
              <div className="px-4 py-6 flex max-md:flex-wrap items-center gap-y-6 justify-between w-full">
                <div className="flex justify-start items-center gap-x-4">
                  <div className="w-[90px] h-[90px] bg-[#AECF5A] rounded-full flex text-black justify-center items-center text-[36px]">
                    {(userProfile as { firstName: string }).firstName[0]}
                  </div>
                  <div>
                    <p className="text-2xl font-normal mb-1">
                      {`${(userProfile as { firstName: string }).firstName} ${
                        (userProfile as { lastName: string }).lastName
                      }`}
                    </p>

                    <p className="font-medium text-sm tracking-[0.25px] mb-1 text-left font-Raleway">
                      {(userProfile as { role: string }).role}
                    </p>

                    <div className="flex justify-start items-center gap-x-1">
                      <img src={location} alt="clock" className="w-3 h-auto" />
                      <p className="font-normal text-[12px]/[16px] font-Raleway">
                        {
                          (userProfile as { streetAddress: string })
                            .streetAddress
                        }
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <Button
                    variant="transparent"
                    onClick={handleExportWithComponent}
                  >
                    <div className="flex justify-center py-3 gap-x-2">
                      <img
                        src={download}
                        alt="download"
                        className="w-[18px] h-auto"
                      />
                      <p>Download as PDF</p>
                    </div>
                  </Button>
                  <Button variant="primary" onClick={completeProfile}>
                    Complete Profile
                  </Button>
                </div>
              </div>
              {certificateDetails ? (
                <div className="w-full">
                  {selectedCertPdf && (
                    <>
                      <Button
                        variant="danger"
                        onClick={() => setCertificateDetails(false)}
                      >
                        Back
                      </Button>
                      <PDFViewer base64Pdf={selectedCertPdf} />
                    </>
                  )}
                </div>
              ) : (
                <div className="border-t border-t-slate-400">
                  <div className="flex max-md:flex-col justify-start">
                    <div className="py-6 px-7 w-full sm:w-[40%] border-r border-r-slate-400">
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Phone Number
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {(userProfile as { phoneNumber: number }).phoneNumber}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Address
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {(userProfile as { address: string }).address}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        City
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {(userProfile as { city: string }).city}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        State/Province
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {
                          (userProfile as { stateProvince: string })
                            .stateProvince
                        }
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Preferred Job Type
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { preferredJobType: string[] })
                            .preferredJobType
                        )
                          ? (
                              userProfile as { preferredJobType: string[] }
                            ).preferredJobType.join(" ")
                          : (userProfile as { preferredJobType: string[] })
                              .preferredJobType}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Preferred Locations
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {
                          (userProfile as { preferredLocations: string })
                            .preferredLocations
                        }
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Availability
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { availability: string[] })
                            .availability
                        )
                          ? (
                              userProfile as { availability: string[] }
                            ).availability.join(" ")
                          : (userProfile as { availability: string[] })
                              .availability}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Days Available
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { daysAvailable: string[] })
                            .daysAvailable
                        )
                          ? (
                              userProfile as { daysAvailable: string[] }
                            ).daysAvailable.join(" ")
                          : (userProfile as { daysAvailable: string[] })
                              .daysAvailable}
                      </p>
                    </div>
                    <div className="py-6 px-7 w-full sm:w-[60%]">
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        How Do You Get to Work
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { methodOfTransportation: string[] })
                            .methodOfTransportation
                        )
                          ? (
                              userProfile as {
                                methodOfTransportation: string[];
                              }
                            ).methodOfTransportation.join(" ")
                          : (
                              userProfile as {
                                methodOfTransportation: string[];
                              }
                            ).methodOfTransportation}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Years of Construction Experience
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {
                          (
                            userProfile as {
                              yearsOfConstructionExperience: number;
                            }
                          ).yearsOfConstructionExperience
                        }
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        What Experience Do You Have
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { otherExperience: string[] })
                            .otherExperience
                        )
                          ? (
                              userProfile as { otherExperience: string[] }
                            ).otherExperience.join(" ")
                          : (userProfile as { otherExperience: string[] })
                              .otherExperience}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        What Personal Protection Equipment (PPE) Do You Have
                      </p>
                      <p className="text-sm mb-3 font-Raleway font-normal text-[#42474E]">
                        {Array.isArray(
                          (userProfile as { equipmentsOwned: string[] })
                            .equipmentsOwned
                        )
                          ? (
                              userProfile as { equipmentsOwned: string[] }
                            ).equipmentsOwned.join(" ")
                          : (userProfile as { equipmentsOwned: string[] })
                              .equipmentsOwned}
                      </p>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Additional Notes
                      </p>
                      <p className="text-sm mb-7 font-Raleway font-normal text-[#42474E] tracking-wider">
                        {
                          (userProfile as { additionalNotes: string })
                            .additionalNotes
                        }
                      </p>
                      <div className=" border-t mb-7 border-t-slate-400 w-full"></div>
                      <p className="text-base mb-2 font-Raleway font-medium text-[#1A1C1E]">
                        Your Certificates
                      </p>
                      <div className="w-max flex-wrap justify-start gap-6 flex">
                        {(
                          userProfile as { certifications: CertificateType[] }
                        ).certifications.map((certificate, index: number) => (
                          <a
                            key={index}
                            onClick={() => handleJobClick(certificate)} // Assuming base64Pdf contains the base64 representation of the PDF
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={certification}
                              alt="Certificates"
                              className="h-16 w-auto mx-2 mb-2"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </PDFExport>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex px-4 py-6 justify-start items-center gap-x-4">
              <div className="w-[90px] h-[90px] bg-[#AECF5A] rounded-full flex text-black justify-center items-center text-[36px]">
                {username[0]}
              </div>
              <div>
                <p className="text-2xl font-normal mb-1">{username}</p>

                <p className="font-medium text-sm tracking-[0.25px] mb-1 text-left font-Raleway">
                  No Job Title
                </p>

                <div className="flex justify-start items-center gap-x-1">
                  <img src={location} alt="clock" className="w-3 h-auto" />
                  <p className="font-normal text-[12px]/[16px] font-Raleway">
                    No location
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t px-4 border-t-slate-400 w-full rounded-lg py-14 flex flex-col justify-center items-center">
              <img
                src={notes}
                alt="resume img"
                className="w-[166px] h-auto mb-4"
              />
              <div className="max-w-[491px] mb-3">
                <p className="font-normal text-lg sm:text-2xl text-center mb-1">
                  Unlock Opportunities: Complete Your Profile Today
                </p>
                <p className="font-normal text-sm tracking-[0.25px] text-center font-Raleway">
                  Complete your X3 Staffing Solutions profile to showcase your
                  skills, experience, and preferences. A detailed profile
                  ensures our advanced matching system connects you with the
                  most relevant job opportunities.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={completeProfile}
                customClassName="w-full max-w-[400px]"
              >
                Complete Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
