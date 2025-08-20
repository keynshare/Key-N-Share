"use client";
import {useState} from 'react'
import Image from "next/image";
import Cover from "@/components/assets/Cover.svg";
import User from "@/components/assets/User.svg";
import { Star,EllipsisVertical } from "lucide-react";
import CTAs from "./CTAs";
import Matic from "@/components/assets/Matic.svg"
export default function DatasetCard() {

    const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-xs rounded-xl min-w-[280px] shadow-md border border-gray-200  bg-white hover:shadow-lg transition">
      {/* Top Image */}
      <div className="relative rounded-t-xl overflow-hidden h-36 w-full">
        <Image
          src={Cover}
          alt="Spotify Dataset Preview"
          fill
          className="object-cover"
        />
      </div>

    
      <div className="p-4 py-3 flex flex-col gap-1">
       

        <h2 className="font-semibold text-lg text-gray-900 line-clamp-2">
          Top Spotify Listening History Songs in Cou
          Top Spotify Listening History Songs in Cou
          Top Spotify Listening History Songs in Cou
        </h2>

       

        <p className=" text-gray-700 line-clamp-2">
          This dataset contains detailed Spotify listening history
          This dataset contains detailed Spotify listening history
          This dataset contains detailed Spotify listening history
          This dataset contains detailed Spotify listening history
        </p>

       

        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span>Uploaded 2 months ago</span>
           <span>•</span>
          <span >252 mb</span>
        </div>

        

        <div className="flex  items-center justify-between pb-1">
          <div className="flex items-center space-x-1">
           <Star size={14} stroke="#FFC300" fill="#FFC300"/>
            <span className="font-medium">5</span>
          </div>
          
          <span className="">CSV</span>
                    <span className='flex items-center gap-1 text-black'><Image src={Matic} alt="matic" width={18} height={18} />45</span>

          <button className='relative' onClick={() => {setIsHovered(!isHovered);}} onBlur={() => {setIsHovered(false);}}>
          <EllipsisVertical size={18}/>
           {isHovered && 
           <div className='absolute -top-6 lg:top-6 right-4 lg:right-0 z-10'>
            <CTAs/>
            </div>
            }
          </button>
           
        </div>

        
        <div className="flex gap-3 border-t items-center pt-2">
          <Image
            src={User}
            alt="Author"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div >
            <p className=" font-medium text-gray-900">Mohammad Sumbul</p>
            <p className="text-sm text-gray-500">Data Scientist</p>
          </div>
        </div>
      </div>
    </div>
  );
}
