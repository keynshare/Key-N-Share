'use client';

import Logo from '@/public/logo.svg'
import Image from 'next/image';
import HeroVideoDialog from "@/components/LandingPage/hero-video-dialog";
import Thumbnail from '@/public/Thumbnail.svg'
export default function Tutorial() { 
  return (
   <div className='p-4  bg-[#F2F2F2] relative mb-24 mt-28 sm:mb-64 sm:mt-40 px-5 sm:px-11 lg:px-20 xl:px-10 max-h-[400px] md:max-h-[540px] lg:max-h-[630px] mx-[5vw] xl:max-h-[650px] 2xl:max-h-[700px] xl:mx-[15vw] 2xl:mx-[18vw] 3xl:mx-[25vw] gap-10 rounded-xl md:rounded-3xl flex flex-col items-center justify-center '>

            <div className='h-1 sm:h-4 md:h-40 lg:h-52 2xl:h-64'>
        <div className='rounded-full flex items-center justify-center -translate-y-[35%] sm:-translate-y-[19%] md:translate-y-[40%] lg:translate-y-[50%] w-40 h-40 md:w-48 md:h-48 border-8 border-white bg-[#F2F2F2]'>
            <Image src={Logo} alt='Key N Share' className='w-20 md:w-28 ' />
        </div>
        </div>

        <div className='flex flex-col gap-1 md:gap-5 translate-y-5  items-center pt-16 justify-center'>
        <h1 className='text-xl md:text-3xl lg:text-[42px] font-bold text-center  font-bricola '>Explore Vast Range of Datasets With The Security of Web3</h1>
        <p className='text-center  text-[#3F3F3F] text-xs md:text-base  lg:text-lg '>Everything you need to securely share, monetize, and protect your datasets — built for a decentralized, trustless, and traceable future.</p>
        </div>
        
        <HeroVideoDialog
  className="block rounded-full dark:hidden"
  animationStyle="from-center"
  videoSrc="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  thumbnailSrc={Thumbnail}
  thumbnailAlt="Dummy Video Thumbnail"
/>

   </div>
  );
}
