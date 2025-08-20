"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavImage from "@/components/assets/Image.png";
import Logo from "@/public/logo.svg";
import LogoDark from "@/public/DarkLogo.svg";
import PrimaryBtn from "@/components/SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "@/components/SharedComponents/Btns/SecondaryBtn";
import clsx from "clsx";
import WhiteLogo from "@/public/WhiteLogo.svg";
import { SunMediumIcon, MoonStar, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { Wallet, ShoppingCart, LucideFileHeart, Bell } from "lucide-react";
import User from "@/components/assets/User.svg";
import { useConnect, useAccount, useBalance, useDisconnect } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import WalletGradient from '@/components/assets/Wallet.svg'

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Upload Dataset", href: "/contact" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Orders", href: "/orders" },
];

function Navbar() {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: polygonAmoy.id,
  });

  //take the first connector which has injected
  const connector = connectors[0];

  const { theme, toggleTheme } = useTheme();

  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [IsScrolled, setIsScrolled] = useState<boolean>(false);
  const [IsLogout, setIsLogout] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (pathname === "/") {
      setIsLogout(true);
    } else {
      setIsLogout(false);
    }
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const moveTabTo = useCallback((index: number) => {
    if (!containerRef.current) return;

    if (index === -1) {
      setTabStyle({ ...tabStyle, opacity: 0 });
      return;
    }
    const target = containerRef.current.children[index] as HTMLElement;
    if (target) {
      const { offsetLeft, offsetWidth } = target;
      setTabStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        height: "41px",
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    const currentIndex = navLinks.findIndex((link) => link.href === pathname);
    setActiveIndex(currentIndex);
    moveTabTo(currentIndex);
  }, [pathname, moveTabTo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    moveTabTo(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      moveTabTo(activeIndex);
    }, 100);
  };

  return (
    <div className="sticky w-screen top-0 p-4 z-[99999999999999999999] px-5 overflow-hidden xl:px-10 bg-transparent ">
      <div className="flex justify-center">
        <div
          className={clsx(
            " flex items-center min-w-[90vw] lg:min-w-[80vw] xl:min-w-[700px] justify-between transition-[padding] duration-500 ease-in-out",
            IsScrolled
              ? "backdrop-blur-md w-fit border border-gray-200 dark:border-gray-400 bg-[#DBF0FF]/30 dark:bg-[#DBF0FF]/20 p-2 gap-4 rounded-lg"
              : "p-0 gap-[18px] w-full bg-transparent"
          )}
        >
          <Link
            href={IsLogout ? "/" : "/dashboard"}
            className={`text-[29px] flex items-center gap-[18px] font-bold  transform transition-all duration-700 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100 scale-100"
                : "translate-x-[-50px] opacity-0 scale-95"
            } `}
          >
            <Image
              src={theme === "light" ? Logo : LogoDark}
              alt="Key N Share"
              width={43}
              className="w-[30px] xl:w-[43.38px] "
            />
            <p
              className={clsx(
                "font-cinzel transition-all text-2xl xl:text-[29px] duration-500 ease-in-out overflow-hidden whitespace-nowrap",
                IsScrolled
                  ? "max-w-xs opacity-100 xl:max-w-0 xl:opacity-0"
                  : "max-w-xs opacity-100"
              )}
            >
              Key N Share
            </p>
          </Link>

          {/* Navigation Links */}
          <div
            className={`relative hidden xl:block w-fit transform transition-all duration-700 ease-out delay-100 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-[-30px] opacity-0 scale-95"
            }`}
          >
            <div
              ref={containerRef}
              className={clsx(
                "flex justify-center items-center p-[3px] transition-all duration-500 ease-in-out ",
                IsScrolled
                  ? "rounded-none border-none backdrop-blur-none bg-transparent"
                  : "rounded-full border border-[#d7d6d6cc] dark:border-gray-400 backdrop-blur-sm bg-[#DBF0FF]/30 dark:bg-[#DBF0FF]/20"
              )}
            >
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className={clsx(
                    IsScrolled ? "rounded-2xl " : "rounded-full ",
                    "relative z-20 px-5 py-[8px] transition-all duration-300  hover:scale-105 transform"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="rounded-full ml-2 aspect-square w-8 mr-2 border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:[background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] dark:hover:[background:linear-gradient(89deg,rgba(255,255,255,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] "
              >
                {" "}
                {theme === "light" ? (
                  <MoonStar size={18} strokeWidth={1.5} />
                ) : (
                  <SunMediumIcon size={18} />
                )}{" "}
              </button>
              {/* Sliding BG */}
              <span
                className={clsx(
                  IsScrolled ? "rounded-[10px]" : "rounded-full",
                  "absolute top-[3px] z-10 border border-gray-100 dark:border-gray-400 backdrop-blur-sm transition-all opacity-10 duration-300 ease-in-out [background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)]"
                )}
                style={tabStyle}
              />
            </div>
          </div>

          {IsLogout ? (
            <div
              className={`hidden xl:flex items-center gap-5 transform transition-all duration-700 ease-out delay-400 ${
                isVisible
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-[50px] opacity-0 scale-95"
              }`}
            >
              <div className="animate-bounce-slow">
                <SecondaryBtn Href="/authentication">Login</SecondaryBtn>
              </div>
              <div className="animate-bounce-slow delay-200">
                <PrimaryBtn Href="/authentication" sparkelClass="max-w-[128%]">
                  Register
                </PrimaryBtn>
              </div>
            </div>
          ) : (
            <div
              className={`hidden xl:flex items-center gap-5 transform transition-all duration-700 ease-out delay-400 ${
                isVisible
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-[50px] opacity-0 scale-95"
              }`}
            >
              <div className="animate-bounce-slow flex gap-4 items-center justify-center delay-200">
                <PrimaryBtn
                  onClick={() => !isConnected ? connector && connect({ connector }) : disconnect()}
                  disabled={isPending}
                  Hovered={isConnected}
                  sparkelClass="hidden"
                  classsecondInner="px-1"
                >
                {!isConnected ? <Wallet size={22}/> : <Image src={WalletGradient} width={24} alt="wallet svg" />} {isConnected ? balance?.formatted : "Connect"}  
                  
                </PrimaryBtn>

                <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <ShoppingCart size={22} />
                </button>
                <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <LucideFileHeart size={22} />
                </button>
                <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <Bell size={22} />
                </button>
                <Link href="#" className="  text-white rounded-full">
                  <Image
                    className="object-cover w-10"
                    src={User}
                    alt="user svg"
                  />
                </Link>
              </div>
            </div>
          )}
          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`xl:hidden hover:rotate-90 p-[1px] px-2 w-fit h-fit flex transition-all duration-500  bg-[#DBF0FF]/30 dark:bg-gray-800/30 backdrop-blur-md  border border-gray-100 dark:border-gray-700 aspect-square rounded-full items-center transform  ease-out delay-400 hover:scale-110 hover:shadow-lg shadow-blue-200 dark:shadow-blue-900 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-[-20px] opacity-0 scale-95"
            }`}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`xl:hidden mt-4 fixed flex w-[90%] md:w-[95%] justify-between gap-3 bg-[#DBF0FF]/30 dark:bg-gray-800/30 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg transform transition-all duration-500 ease-out ${
            menuOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-[-20px] opacity-0 scale-95"
          }`}
        >
          <div className="xl:hidden mt-4 flex flex-col gap-3">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={` text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 ">
            {IsLogout ?
             <>
            <button
              onClick={toggleTheme}
              className="rounded-full  aspect-square w-8 mr-2 border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:[background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] dark:hover:[background:linear-gradient(89deg,rgba(255,255,255,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] "
            >
              {" "}
              {theme === "light" ? (
                <MoonStar size={18} strokeWidth={1.5} />
              ) : (
                <SunMediumIcon size={18} />
              )}{" "}
            </button>

            <div className="">
              <SecondaryBtn Href="/authentication" className={"w-[156px]"}>
                Login
              </SecondaryBtn>
            </div>
            <div className=" delay-200">
              <PrimaryBtn
                Href="/authentication"
                sparkelClass="sm:!-top-3 -top-[15.5px]  w-[180px] "
                className={"!w-[156px]"}
              >
                Register
              </PrimaryBtn>
            </div>
            </>
            :
            <>

            <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-full  aspect-square w-8 mr-2 border border-gray-300 dark:border-gray-400 flex items-center justify-center hover:[background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] dark:hover:[background:linear-gradient(89deg,rgba(255,255,255,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)] "
            >
              {" "}
              {theme === "light" ? (
                <MoonStar size={18} strokeWidth={1.5} />
              ) : (
                <SunMediumIcon size={18} />
              )}{" "}
            </button>
             <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <ShoppingCart size={22} />
                </button>
                <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <LucideFileHeart size={22} />
                </button>
                <button className="p-2 bg-[#131313] dark:border dark:border-gray-800 hover:bg-[#242424] text-white rounded-full">
                  <Bell size={22} />
                </button>
                <Link href="#" className="  text-white rounded-full">
                  <Image
                    className="object-cover w-10"
                    src={User}
                    alt="user svg"
                  />
                </Link>
              </div>


            <div className="">
              <SecondaryBtn Href="/authentication" className={"w-[156px]"}>
                Login
              </SecondaryBtn>
            </div>
            <div className=" delay-200">
              <PrimaryBtn
                Href="/authentication"
                sparkelClass="sm:!-top-3 -top-[15.5px]  w-[180px] "
                className={"!w-[156px]"}
              >
                Register
              </PrimaryBtn>
            </div>
            </>
            }
            </div>
          </div>

          <div className=" w-full rounded-lg relative ">
            <Image
              src={NavImage}
              alt="Nav Visual Key N Share"
              className={clsx(IsLogout ? "h-[314px] sm:h-[324px]" : "h-[380px] sm:h-[390px]" ,"w-full rounded-lg object-fill")}
              priority
            />

            <Image
              src={WhiteLogo}
              alt="Key N Share"
              className="absolute w-44 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
