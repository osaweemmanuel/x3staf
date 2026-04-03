import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  motion,
  useMotionValue,
  MotionValue,
  useAnimation,
} from "framer-motion";
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from "../auth/authApiSlice";
import { useNavigate } from "react-router-dom";

import HamburgerIcon from "./HamburgerIcon";
import logo from "../assets/appLogo.svg";
// import notification from "../assets/icons/notification.svg";
import dropDown from "../assets/icons/arrow-down.svg";
import { appNavItems } from "../data/appNavItems";
import Button from "./Button";

const AppNavbar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const menuHeight: MotionValue<number> = useMotionValue(0);

  const { verified, isLoggedIn, username, roles } = useAuth();
  const navigate = useNavigate();
  // const { pathname } = useLocation()

  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  // console.log(verified)

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isLoggedIn && !verified) {
      navigate("/otpverification");
    }
  }, [isLoggedIn, verified, navigate]);

  const handleNavClick = () => {
    setNavOpen(!navOpen);
    setIsAnimating(!isAnimating);
    setAnimationKey((prevKey) => prevKey + 1);
  };

  const controls = useAnimation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isAnimating) {
      controls.start({
        opacity: 1,
        x: 0,
      });
    } else {
      controls.start({
        opacity: 0,
        x: "-100%",
      });
    }
  }, [controls, isAnimating]);

  return (
    <header
      className={`w-full z-20 ${
        navOpen ? "bg-white" : "bg-transparent"
      } fixed top-0 transition-all ease-in-out duration-500`}
    >
      <nav>
        <div className="flex justify-between lg:justify-between py-7 items-center px-7 font-poppins mx-auto max-w-[1500px]">
          <div className="flex justify-start gap-x-12 items-center">
            <div>
              <img
                src={logo}
                alt="logo"
                className="relative h-[28px] xmd:max-xl:h-[16px] sm:h-5 cursor-pointer z-40"
              />
            </div>
            {/* Menu */}
            <div className="items-center justify-center hidden menu xl:flex">
              <div>
                <ul className="flex justify-center gap-x-[23px]">
                  {appNavItems.map((item) => {
                    // Check if the role includes "Admin" and item name is "profiles"
                    if (
                      roles.includes("Admin") &&
                      item.name === "Job Openings"
                    ) {
                      return null; // Skip rendering this item
                    }

                    return (
                      <li
                        key={item.key}
                        className="font-normal text-base tracking-[0.5px] font-Raleway transition-all cursor-pointer hover:scale-105 hover:text-primary hover:underline hover:decoration-primary underline-offset-8"
                      >
                        <NavLink
                          to={item.where}
                          className={
                            window.location.pathname === item.where
                              ? "text-primary underline decoration-primary"
                              : "text-[#1E1E1E]"
                          }
                        >
                          {" "}
                          {item.name}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 items-center">
            {/* <div>
              <img
                src={notification}
                className="w-[48px] h-auto"
                alt="notification"
              />
            </div> */}
            {isLoggedIn && (
              <div className="flex gap-x-2 items-center relative">
                <div className="w-[50.3px] h-[50.3px] bg-[#AECF5A] rounded-full flex text-black justify-center items-center text-[24px]">
                  {username ? username[0] : 'U'}
                </div>
                <img
                  src={dropDown}
                  onClick={() => setProfile(!profile)}
                  className={`w-[24px] h-auto ${
                    profile && "rotate-180"
                  } transform transition-all ease-in-out duration-500`}
                  alt="drop down"
                />
                {profile && (
                  <div className="fixed right-7 top-[90px] w-[150px] border border-black">
                    <Button
                      variant="danger"
                      customClassName="w-full"
                      onClick={() => {
                        sendLogout("");
                      }}
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div
              className="z-40 cursor-pointer xl:hidden"
              onClick={handleNavClick}
            >
              <div className="mobile-icon">
                <HamburgerIcon isOpen={navOpen} />
              </div>
            </div>
          </div>
          {/* Mobile Menu */}
        </div>

        {/* Tab menu */}
        <motion.div
          className={`fixed overflow-hidden left-0 right-0 mt-[80px] bg-white transform transition-all ease-in-out duration-500 ${
            navOpen ? "top-0 h-full" : "-top-full"
          }`}
        >
          <ul className="text-left px-7 sm:px-[62px] font-poppins pb-6 pt-4">
            {appNavItems.map((item) => {
              // Check if the role includes "Admin" and item name is "profiles"
              if (roles.includes("Admin") && item.name === "Job Openings") {
                return null; // Skip rendering this item
              }

              return (
                <motion.li
                  key={`${item.key}-${animationKey}`}
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={isAnimating ? controls : undefined}
                  style={{ transitionDelay: `${item.key * 100}ms` }}
                  className={`hover:scale-105 ${
                    !navOpen && "hidden"
                  } border-light-purple text-[#070F18] font-normal border-opacity-20 py-3 border-dashed border-t-2 text-2xl transform transition-all ease-in-out duration-500`}
                >
                  <span>
                    <NavLink
                      to={item.where}
                      onClick={() => {
                        setNavOpen(false);
                        menuHeight.set(navOpen ? 0 : 0);
                        setIsAnimating(false);
                        setAnimationKey((prevKey) => prevKey + 1);
                        window.location.pathname === item.where &&
                          scrollToTop();
                      }}
                      className={
                        window.location.pathname === item.where
                          ? "text-primary"
                          : "text-[#070F18]"
                      }
                    >
                      {item.name}
                    </NavLink>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </nav>
    </header>
  );
};

export default AppNavbar;
