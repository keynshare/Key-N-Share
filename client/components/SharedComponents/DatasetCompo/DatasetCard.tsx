"use client";
import {useState,useEffect} from 'react'
import Image from "next/image";
import Cover from "@/components/assets/Cover.svg";
import User from "@/components/assets/User.svg";
import { Star,EllipsisVertical } from "lucide-react";
import CTAs from "./CTAs";
import Matic from "@/components/assets/Matic"
import Link from 'next/link';

interface Dataset {
  id:number;
  Image: string;
  Title: string;
  Description: string;
  Type: string;
  Price: number | string;
}

// Define the props for the component
interface DatasetCardProps {
  Data: Dataset;
}

const firstNames = ["Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Isha", "Arjun", "Saanvi"];
const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Joshi", "Verma"];
const designations = ["Data Scientist", "AI Researcher", "ML Engineer", "Data Analyst", "Research Scientist", "Analytics Manager"];



export default function DatasetCard({Data}:DatasetCardProps) {

    const [isHovered, setIsHovered] = useState(false);
  const [author, setAuthor] = useState({ name: '', designation: '' });

     useEffect(() => {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomDesignation = designations[Math.floor(Math.random() * designations.length)];
    
    setAuthor({
      name: `${randomFirstName} ${randomLastName}`,
      designation: randomDesignation,
    });
  }, []);

  return (
    <Link href={`/specific-dataset/${Data.id}`} className="max-w-[280px] rounded-xl min-w-[280px] shadow-md border border-gray-200 dark:border-gray-800 dark:bg-[#131313]  bg-white hover:shadow-lg transition">
      {/* Top Image */}
      <div className="relative rounded-t-xl overflow-hidden h-36 w-full">
        <img
          src={Data.Image}
          alt="Spotify Dataset Preview"
          
          className="object-cover"
        />
      </div>

    
      <div className="p-4 py-3 flex flex-col gap-1">
       

        <h2 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">
         {Data.Title}
        </h2>

       

        <p className=" text-gray-700 dark:text-white line-clamp-2">
         {Data.Description}
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
          
          <span className="">{Data.Type}</span>
                    <span className='flex items-center gap-1 '><Matic />{Data.Price}</span>

          <button title='Actions' className='relative p-1 hover:bg-gray-200 dark:hover:bg-[#252525] rounded-full' onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsHovered(!isHovered);}} onBlur={() => {setIsHovered(false);}}>
          <EllipsisVertical size={18}/>
           {isHovered && 
           <div className='absolute -top-6  right-4  z-10'>
            <CTAs/>
            </div>
            }
          </button>
           
        </div>

        
        <div className="flex gap-3 border-t dark:border-gray-600 items-center pt-2">
          <Image
            src={User}
            alt="Author"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div >
            <p className=" font-medium text-gray-900 dark:text-white">{author.name}</p>
            <p className="text-sm text-gray-500 dark:text-white">{author.designation}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
