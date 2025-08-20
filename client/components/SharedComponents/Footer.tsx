'use client';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Logo from '@/public/logo.svg';
import LogoDark from "@/public/DarkLogo.svg";

import India from '@/components/assets/India.svg'
import { useTheme } from "@/lib/theme-context";
import SecondaryBtn from './Btns/SecondaryBtn';

const Footer = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const currentRef = footerRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of the footer is visible
        rootMargin: '0px'
      }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };


  return (
    <footer ref={footerRef} className="border-t dark:border-[#272727] pt-8 pb-4 ">
      <div className=" mr-5 xl:pr-[80px] 2xl:px-[80px] 3xl:px-[150px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row justify-between gap-10 lg:gap-14">
          {/* Logo Section */}
          <div className="flex-shrink-0">
          <div className={`text-[29px] flex items-center gap-4 font-bold transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Image
              src={theme === 'light' ? Logo : LogoDark}
              alt="Key N Share"
              width={43}
              className="w-[30px] xl:w-[43.38px] "
            />
            <p
              className='font-cinzel transition-all text-2xl xl:text-[29px] duration-500 ease-in-out overflow-hidden whitespace-nowrap'
            >
              Key N Share
            </p>
          </div>
          </div>

          {/* Link Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full  lg:grid-cols-4 gap-5 lg:gap-0 flex-grow">
            {/* Pages Section */}
            <div className={`transform transition-all duration-1000  ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>
              <h3 className="font-bold text-lg xl:text-xl mb-2 font-bricola">Pages</h3>
              <ul className="space-y-1 text-lg">
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/about">About Us</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/orders">Previous Orders</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/datasets">Your Datasets</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/upload">Upload Datasets</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/favourites">Favourites</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/cart">Cart</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className={`transform transition-all duration-1000  ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '350ms' }}>
              <h3 className="font-bold mb-2 text-lg xl:text-xl font-bricola">Legal</h3>
              <ul className="space-y-1 text-lg">
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/terms">Terms & Conditions</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/privacy">Privacy Policy</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/cookies">Cookies Policy</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div className={`transform transition-all duration-1000  ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '500ms' }}>
              <h3 className="font-bold mb-2 text-lg xl:text-xl font-bricola ">Support</h3>
              <ul className="space-y-1   text-lg">
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/contact">Contact Us</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="/faqs">FAQs</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="https://discord.gg/">Discord</Link></li>
                <li className='hover:text-orange-500 transition-colors duration-300'><Link href="https://github.com/">Github</Link></li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div className={`col-span-2 sm:col-span-1 transform transition-all duration-800 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`} style={{ transitionDelay: '650ms' }}>
              <h3 className="font-bold mb-2 text-lg xl:text-xl whitespace-nowrap font-bricola">Subscribe to our newsletter</h3>
              <p className=" mb-3 text-base md:w-[120%] 2xl:w-[110%] 3xl:w-auto">Lorem Ipsum is simply dummy text of the printing and industry.</p>
              <form className="flex flex-col gap-2">
             <input className="w-full bg-gray-200/55 p-2 py-[10px]  dark:bg-[#141414] rounded-md " type="text" placeholder="Enter First Name" />

                <SecondaryBtn
                 className='w-fit !py-2'
                >
                  Subscribe
                </SecondaryBtn>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t dark:border-[#272727] pt-4 mt-8 text-center flex items-center justify-center gap-1 flex-wrap md:text-lg text-gray-600 dark:text-gray-300 transform transition-all duration-800 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ transitionDelay: '800ms' }}>
          Copyright © 2025 <span className="text-orange-500 font-medium">Key-N-Share</span>  {/*Designed & Developed by <span className="text-orange-500 font-medium">Cinfinite</span>| Made in <button className='onfocus:outline-none outline-none' onClick={togglePlay}><Image src={India} width={18} alt="India" /></button> With ❤️*/ }  
           {/* <audio ref={audioRef} src='/Army.mp3' /> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
