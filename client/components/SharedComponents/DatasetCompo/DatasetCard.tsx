"use client";
import {useState,useEffect} from 'react'
import Image from "next/image";
// import Cover from "@/components/assets/Cover.svg";
import User from "@/components/assets/User.svg";
import { Star,EllipsisVertical } from "lucide-react";
import CTAs from "./CTAs";
import Solana from "@/components/assets/Solana"
import Link from 'next/link';

import timeAgo from './timeAgo';



interface Dataset {
  _id?: string;
  id?: number;
  Image?: string;
  coverImageUrl?: string;
  Title?: string;
  title?: string;
  extension?: string;
  Description?: string;
  description?: string;
  Type?: string;

  Price?: number | string;
  price?: number;
  fileSize?: string;
  downloads?: number;
  views?: number;
  averageRating?: number;
  createdAt?: string;
  user?: {
    id?: string;
    name?: string;
    role?: string;
  }
  
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

  // Helper function to get the correct field values
  const getDatasetId = () => Data._id ||'unknown';
  const getTitle = () => Data.title || Data.Title || 'Untitled Dataset';
  const getDescription = () => Data.description || Data.Description || 'No description available';
  const getImage = () => Data.coverImageUrl || Data.Image || 'https://via.placeholder.com/280x144?text=No+Image';
  const getPrice = () => Data.price || Data.Price || 0;
  const getType = () => Data.extension || 'UNKNOWN';
  const getFileSize = () => Data.fileSize || 'Unknown size';
  const getRating = () => Data.averageRating;
  const getTime = () => Data.createdAt ? timeAgo(Data.createdAt) : 'Unknown time';

  return (
    <Link href={`/specific-dataset/${getDatasetId()}`} className="max-w-[280px] min-h-[395px] rounded-xl min-w-[280px] flex flex-col justify-between shadow-md border border-gray-200 dark:border-gray-800 dark:bg-[#131313]  bg-white hover:shadow-lg transition">
      {/* Top Image */}
      <div className="relative rounded-t-xl overflow-hidden h-36 w-full">
        <img
          src={getImage()}
          alt={`${getTitle()} Preview`}
          className="object-cover w-full h-full"
        />
      </div>

    
      <div className="p-4 py-3 flex flex-col gap-1">
       

        <h2 className="font-semibold text-lg text-gray-900 min-h-[54px] dark:text-white line-clamp-2">
         {getTitle()}
        </h2>

       

        <p className=" text-gray-700 min-h-[48px] dark:text-white line-clamp-2">
         {getDescription()}
        </p>

       

        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span className='max-w-[155px] whitespace-nowrap overflow-hidden text-ellipsis'>Uploaded {getTime()}</span>
           <span>•</span>
          <span>{getFileSize()}</span>
        </div>

        

        <div className="flex  items-center justify-between pb-1">
          <div className="flex items-center space-x-1">
           <Star size={14} stroke="#FFC300" fill="#FFC300"/>
            <span className="font-medium">{getRating()}</span>
          </div>
          
          <span className="">{getType()}</span>
                    <span className='flex items-center gap-1 '><Solana />{getPrice()}</span>

          <button title='Actions' className='relative p-1 hover:bg-gray-200 dark:hover:bg-[#252525] rounded-full' onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsHovered(!isHovered);}} >
          <EllipsisVertical size={18}/>
           {isHovered && 
           <div className='absolute -top-6  right-6  z-10' >
            <CTAs datasetId={getDatasetId()}/>
            </div>
            }
          </button>
           
        </div>

        
        <Link href={`/profile/${Data.user?.id}`} className="flex gap-3 border-t dark:border-gray-600 items-center pt-2">
          <Image
            src={User}
            alt="Author"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div >
            <p className=" font-medium text-gray-900 dark:text-white">{Data.user?.name || author.name}</p>
            <p className="text-sm text-gray-500 dark:text-white">{Data.user?.role || author.designation}</p>
          </div>
        </Link>
      </div>
    </Link>
  );
}
