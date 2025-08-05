"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavImage from '@/components/assets/Image.png'
import Logo from "@/public/logo.svg";
import PrimaryBtn from "@/components/SharedComponents/PrimaryBtn";
import SecondaryBtn from "@/components/SharedComponents/SecondaryBtn";
import clsx from "clsx";
import WhiteLogo from '@/public/WhiteLogo.svg'

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Upload Dataset", href: "/contact" },
  { label: "Catalog", href: "/catalog" },
  { label: "Orders", href: "/orders" },
];

function Navbar() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tabStyle, setTabStyle] = useState<React.CSSProperties>({});
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [IsScrolled, setIsScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentIndex = navLinks.findIndex((link) => link.href === pathname);
    setActiveIndex(currentIndex);
    moveTabTo(currentIndex);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const moveTabTo = (index: number) => {
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
  };

  const handleMouseEnter = (index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredIndex(index);
    moveTabTo(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      moveTabTo(activeIndex);
    }, 100);
  };

  return (
  
    <div className='sticky w-screen top-0 p-4 z-[99999999999999999999] px-5 overflow-hidden xl:px-10 bg-transparent '>
      <div className="flex justify-center">
        <div
          className={clsx(
          
            ' flex items-center min-w-[90vw] md:min-w-[700px] justify-between transition-[padding] duration-500 ease-in-out',
            IsScrolled
              ? 'backdrop-blur-[5px] w-fit border border-gray-200 bg-[#DBF0FF]/30 p-2 gap-4 rounded-lg'
              : 'p-0 gap-[18px] w-full bg-transparent' 
          )}
        >
         
          <div className={`text-[29px] flex items-center gap-[18px] font-bold text-black transform transition-all duration-700 ease-out ${
            isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[-50px] opacity-0 scale-95'
          } `}>
            <Image
              src={Logo}
              alt="Key N Share"
              width={43}
              className="w-[30px] xl:w-[43.38px] "
            />
            <p
              className={clsx(
                'font-cinzel transition-all text-2xl lg:text-[29px] duration-500 ease-in-out overflow-hidden whitespace-nowrap',
                IsScrolled ? 'max-w-xs opacity-100 lg:max-w-0 lg:opacity-0' : 'max-w-xs opacity-100'
              )}
            >
              Key N Share
            </p>
          </div>

          {/* Navigation Links */}
          <div className={`relative hidden lg:block w-fit transform transition-all duration-700 ease-out delay-100 ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-30px] opacity-0 scale-95'
          }`}>
            <div
              ref={containerRef}
              className={clsx(
                'flex justify-center items-center p-[3px] transition-all duration-500 ease-in-out ',
                IsScrolled
                  ? 'rounded-none border-none backdrop-blur-none bg-transparent'
                  : 'rounded-full border border-[#d7d6d6cc] backdrop-blur-sm bg-[#DBF0FF]/30'
              )}
            >
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => handleMouseEnter(index)}
                   onMouseLeave={handleMouseLeave}
                  className={clsx( 
                    IsScrolled ? 'rounded-2xl ' : 'rounded-full ',
                    'relative z-20 px-5 py-[8px] transition-all duration-300 text-black hover:text-[#272727] hover:scale-105 transform'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* Sliding BG */}
              <span
                className={clsx( 
                  IsScrolled ? 'rounded-[10px]' : 'rounded-full',
                  "absolute top-[3px] z-10 border border-gray-100 backdrop-blur-sm transition-all opacity-10 duration-300 ease-in-out [background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)]"
                )}
                style={tabStyle}
              />
            </div>
          </div>

          <div className={`hidden lg:flex items-center gap-5 transform transition-all duration-700 ease-out delay-400 ${
            isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[50px] opacity-0 scale-95'
          }`}>
            <div className="animate-bounce-slow">
              <SecondaryBtn>Login</SecondaryBtn>
            </div>
            <div className="animate-bounce-slow delay-200">
              <PrimaryBtn>Register</PrimaryBtn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className={`lg:hidden text-black flex bg-[#DBF0FF]/30 backdrop-blur-md  border border-gray-100 aspect-square rounded-full items-center transform transition-all duration-500 ease-out delay-400 hover:scale-110 hover:shadow-lg shadow-blue-200 ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-20px] opacity-0 scale-95'
          }`}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              aria-label="Toggle Menu"
              className="transition-all duration-300 hover:rotate-90 p-1 px-3"
            >
              {menuOpen ? 'X' : '|||'}
            </button>
          </div>

        </div>
                
      
     
      </div>


       {/* Mobile Menu */}
      {menuOpen && (
        <div className={`lg:hidden mt-4 fixed flex w-[90%] md:w-[95%] justify-between gap-3 bg-[#DBF0FF]/30 backdrop-blur-xl border rounded-xl p-4 shadow-lg transform transition-all duration-500 ease-out ${
          menuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-[-20px] opacity-0 scale-95'
        }`}>
        <div className="lg:hidden mt-4 flex flex-col gap-3">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-black text-lg font-medium hover:text-blue-600 transition-all duration-300 transform hover:translate-x-2 hover:scale-105 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="">
            <SecondaryBtn className={'w-[156px]'} >Login</SecondaryBtn>
          </div>
          <div className=" delay-200">
            <PrimaryBtn sparkelClass='sm:!-top-3 -top-[15.5px]  w-[180px] ' className={'!w-[156px]'}>Register</PrimaryBtn>
          </div>
        </div>
       
        <div className=" w-full rounded-lg relative ">
  <Image
    src={NavImage}
    alt="Nav Visual Key N Share"
    className="w-full h-[264px] md:h-[274px] rounded-lg object-fill"
  />

  <Image src={WhiteLogo} alt="Key N Share" className="absolute w-44 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
</div>        
        </div>
      )}
    </div>
  );
}

export default Navbar;