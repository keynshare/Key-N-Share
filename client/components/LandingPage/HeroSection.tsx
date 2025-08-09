'use client'
import { useEffect, useState } from 'react'
import CircleBG from './CircleBG'
import Logo from '@/public/logo.svg'
import LogoDark from "@/public/DarkLogo.svg";
import Image from 'next/image'
import PrimaryBtn from '../SharedComponents/Btns/PrimaryBtn'
import SecondaryBtn from '../SharedComponents/Btns/SecondaryBtn'
import Diagram from './Diagram'
import { Sparkles } from '../Animations/Sparkels'
import { useTheme } from "@/lib/theme-context";

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
   <CircleBG/>

   <div className='flex flex-col z-50 relative items-center gap-9  justify-center h-screen md:h-[580px] xl:h-[700px] w-screen px-[5vw] '>

      <div className={`flex justify-center items-center  gap-3 [background:#192B42/25] backdrop-blur-xl shadow-[0_0_5px_0_#12e3ffde_inset] px-[15px] py-[5px] rounded-full border-[0.75px] border-[rgba(25,43,66,0.25)] transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      } hover:scale-105  transition-all duration-300`}>
        
        <Image src={ theme === 'light' ? Logo : LogoDark} alt='Key N Share' className="w-[18px] sm:w-[25px] animate-pulse" />
        <p className='text-[#004CBE] text-xs sm:text-base shiny-text animate-pulse'>  Sell Smarter. Share Safer.</p>

      </div>

      <div className={`flex flex-col items-center justify-center gap-3 transform transition-all duration-1000 ease-out delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}>
        <h1 className='font-bricola font-extrabold sm:font-bold text-lg sm:text-3xl md:text-[31px] lg:text-[42px] xl:text-5xl w-[320px] sm:w-3/4 text-center '>
          Own Your Data. Share It Securely. Get Paid Fairly.
        </h1>
        <p className='text-[#3F3F3F] dark:text-[#c4c4c4] text-center text-base md:text-lg animate-fade-in-up delay-500  '> 
          Own, protect, and monetize your data in the Web3 era. 
        </p>
      </div>

      <div className={`flex flex-wrap items-center justify-center gap-5 transform transition-all duration-1000 ease-out delay-600 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90'
      }`}>
      
          <SecondaryBtn>Upload Datasets</SecondaryBtn>
        
       
          <PrimaryBtn sparkelClass='sm:!-top-3 -top-[15px] w-[200px]' className={'w-[156px] sm:w-fit'}>Get Started</PrimaryBtn>
        
      </div>
      <div className='absolute bottom-0 z-[-1] h-[450px] w-screen overflow-hidden [mask-image:radial-gradient(100%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#48b6ff,transparent_90%)] before:opacity-30 after:absolute'>
            <Sparkles
              density={1800}
              speed={1.2}
              color='#48b6ff'
              direction='top'
              className='absolute inset-x-0 -bottom-52 h-full w-full '
            />
          </div>

   </div>

   <div className={`transform transition-all duration-1000 ease-out delay-900 ${
     isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
   }`}>
     <Diagram/>
   </div>

 
    
    </>
  )
}

export default HeroSection
