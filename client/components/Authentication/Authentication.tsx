"use client";
import { useState } from "react";
import Loginimg from "@/components/assets/Login.svg";
import Image from "next/image";
import { ArrowRight,SunMediumIcon, MoonStar } from "lucide-react";
import WhiteLogo from "@/public/WhiteLogo.svg";
import Signupform from "./Signupform";
import LoginForm from "./LoginForm";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";

function Authentication() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center lg:min-h-0 lg:h-screen p-2">
      <div className="flex flex-col lg:flex-row rounded-xl w-full h-full p-2 gap-2 [background:linear-gradient(105deg,#1070FF_0%,#BA8CFF_17%,rgba(167,108,255,0.80)_30%,#FFBEE6_40%,#FF9C4B_75%,#FFC18E_83%,#FF7A00_100%)] relative overflow-hidden">
        
        {/* Form Container*/}
        <div className={`w-full lg:w-[55%] order-2 lg:order-1 flex items-center overflow-auto pb-4 pt-9 justify-center px-6 lg:px-4 xl:px-12 flex-col gap-5 bg-white dark:bg-black rounded-xl transition-all duration-700 ease-in-out ${
          isLoginMode ? 'lg:translate-x-[83.2%] xl:translate-x-[82.9%] 2xl:translate-x-[82.8%] ' : ''
        }`}>

         
         <Signupform isLoginMode={isLoginMode} toggleMode={toggleMode} />
          
         
         <LoginForm isLoginMode={isLoginMode} toggleMode={toggleMode} />

        </div>

        {/* Image Container*/}
        <div className={`w-full lg:w-[45%] order-1 lg:order-2 h-64 lg:h-auto bg-white relative dark:bg-black overflow-hidden rounded-xl transition-all duration-700 ease-in-out ${
          isLoginMode ? 'lg:-translate-x-[124%] xl:-translate-x-[123.7%] 2xl:-translate-x-[123.5%] ' : ''
        }`}>
          <Image
            src={Loginimg}
            className="object-cover h-full w-full"
            alt="Key N Share Login"
          />
          <Image
            src={WhiteLogo}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-40 md:w-64"
            alt="logo"
          />
          <Link href="/" className="text-white flex gap-1 py-1 border-[0.1px] border-gray-400 bg-white/10 rounded-full px-3 absolute z-50 left-2 hover:text-black hover:bg-white transition-colors duration-500 top-3 items-center justify-center backdrop-blur-md">
            Back to Website <ArrowRight size={18} />
          </Link>

           <button
            onClick={toggleTheme}
            className="rounded-full ml-2 text-white aspect-square absolute z-50 right-2 top-3 w-8 mr-2 border border-gray-300 dark:border-gray-500 flex items-center justify-center hover:[background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] dark:hover:[background:linear-gradient(89deg,rgba(255,255,255,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] "
            >
            {" "}
            {theme === "light" ? (
            <MoonStar size={18} strokeWidth={1.5} />
            ) : (
            <SunMediumIcon size={18} />
            )}{" "}
            </button>

        </div>

      </div>
    </div>
  );
}

export default Authentication;