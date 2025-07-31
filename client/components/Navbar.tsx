"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/public/logo.svg";
import PrimaryBtn from "@/components/SharedComponents/PrimaryBtn";
import SecondaryBtn from "@/components/SharedComponents/SecondaryBtn";
import clsx from "clsx";

const navLinks = [
  { label: "About Us", href: "/about" },
  { label: "Upload Dataset", href: "/contact" },
  { label: "Catalog", href: "/catalog" },
  { label: "Orders", href: "/orders" },
];

function Navbar() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tabStyle, setTabStyle] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [IsScrolled, setIsScrolled] = useState<boolean>(false);

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
  
    <div className='sticky top-0 p-4 px-6 bg-transparent z-50'>
      <div className="flex justify-center">
        <div
          className={clsx(
          
            ' flex items-center justify-between transition-[padding] duration-500 ease-in-out',
            IsScrolled
              ? 'backdrop-blur-[5px] w-fit border border-gray-200 bg-[#DBF0FF]/30 p-2 gap-4 rounded-lg'
              : 'p-0 gap-[18px] w-full' 
          )}
        >
          <div className="text-[29px] flex items-center gap-[18px] font-bold text-black">
            <Image
              src={Logo}
              alt="logo"
              width={43}
              className="w-[30px] xl:w-[43.38px]"
            />
            <p
              className={clsx(
                'font-poppins transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap',
                IsScrolled ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
              )}
            >
              Key N Share
            </p>
          </div>


          <div className="relative w-fit">
            <div
              ref={containerRef}
              className={clsx(
                'flex justify-center items-center p-[3px] transition-all duration-500 ease-in-out',
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
                  className={clsx( IsScrolled ? 'rounded-2xl ' : 'rounded-full ' ,'relative z-20 px-5  py-[8px] transition-colors duration-300 text-black')}
                >
                  {link.label}
                </Link>
              ))}
              {/* Sliding BG */}
              <span
                className={clsx( IsScrolled ? 'rounded-[10px]' : 'rounded-full',"absolute top-[3px] z-10 border border-gray-100  backdrop-blur-sm transition-all opacity-10 duration-300 ease-in-out [background:linear-gradient(89deg,rgba(0,0,0,0.01)_11.29%,rgba(0,102,255,0.25)_96.93%)]")}
                style={tabStyle}
              />
            </div>
          </div>



          <div className="flex items-center gap-5">
            <SecondaryBtn>Login</SecondaryBtn>
            <PrimaryBtn>Register</PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;