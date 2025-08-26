import React from 'react'
import Image from 'next/image'
import Matic from '@/components/assets/Matic'
import SecondaryBtn from '../Btns/SecondaryBtn'
import { CircleMinus,Star } from 'lucide-react'




type Data={
    id?:number,
    Image?: string;
    Title?: string;
    Description?: string;
    Type?: string;
    Price?: number | string;
    Tags?: string[];
}

type CheckOutDatasetCard = {
   Data:Data
}
function CheckOutDatasetCard({Data}:CheckOutDatasetCard) {
  return (
   <>
   
    <div className='flex flex-col max-w-[300px]  lg:max-w-max 2xl:max-w-[1400px] lg:flex-row gap-2 items-center justify-center p-3 shadow-[1px_1px_17px_0_rgba(0,0,0,0.10)] bg-white dark:bg-[#131313] rounded-lg '>

        <img src={Data?.Image} alt="checkout" className='object-cover border border-gray-100 dark:border-gray-600 rounded-md w-full lg:min-w-[300px] lg:max-w-[300px] aspect-video' width={200} height={200} />

        <div className="">
      <h1 className=" md:text-lg font-bold font-bricola line-clamp-1">
        {Data?.Title}
      </h1>
    
        <p className='text-gray-600 line-clamp-2 dark:text-gray-200'>{Data?.Description}</p>

      <div className="flex flex-wrap items-center my-1 gap-4 text-sm text-gray-500">
        <span>Uploaded 2 days ago</span>
        
        <span>256 MB</span>
       
        <span>{Data?.Type}</span>
       
        <span className="inline-flex items-center gap-1"><Star size={18} className="text-yellow-500"/>4.5</span>
      </div>
     

        <div className="flex flex-wrap justify-between items-center gap-4">

            <span className="flex items-center gap-2">
            <Matic size={32} /> 
            <h6 className="text-[42px]  ">{Data?.Price} </h6>
            </span>
        <div className='flex flex-col lg:flex-row lg:w-fit w-full gap-2 justify-center'>
            <SecondaryBtn className='bg-red-600 dark:bg-red-600 hover:bg-[#fd5959] dark:hover:bg-[#fd5959] hover:text-white'> <CircleMinus size={20} /> Remove</SecondaryBtn>
            <SecondaryBtn>Send Request</SecondaryBtn>
            </div>
        </div>

    </div>

    </div>

   </>
  )
}

export default CheckOutDatasetCard
