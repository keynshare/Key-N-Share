"use client"
import React,{useState} from 'react'
import CheckOutDatasetCard from '../SharedComponents/DatasetCompo/CheckOutDatasetCard'
import DatasetData from '@/components/assets/dataset.json'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
import CardsWithCategory from '../Dashboard/CardsWithCategory'
import PrimaryBtn from '../SharedComponents/Btns/PrimaryBtn'
import Matic from '../assets/Matic'
import { ShoppingCart } from 'lucide-react'
import clsx from 'clsx'
function CartPage() {
const [ShowCheckOut,setShowCheckOut] = useState(false)

    const categories = ["Trending"];


const breadcrumbItems = [
    { label: "Catalogue", href: "/catalogue" },
    { label: "Favourite", isActive: true }
];

  return (
    <>
      <div className=' px-3 md:px-5 mb-5 overflow-x-hidden lg:px-10 xl:px-16 2xl:px-20'>  
        <Breadcrumb items={breadcrumbItems} />
        <div className='grid grid-cols-1 lg:grid-cols-4 pb-10  mt-4 flex-wrap gap-5 items-start justify-center w-full '>
            
            <div className='w-full col-span-full xl:col-span-3 flex xl:flex-col justify-center xl:justify-start  mt-4 max-h-screen overflow-y-auto xl:flex-nowrap flex-wrap gap-5'>
                {
                DatasetData.map((data,index)=>(
                       <React.Fragment key={index}>
                         <CheckOutDatasetCard Data={data} />
                       </React.Fragment>
                ))


            }
            </div>
            <div  className={clsx( ShowCheckOut ? 'translate-x-0' : 'translate-x-[100vw] xl:translate-x-0 ',' z-50 fixed min-w-[300px] max-w-[300px] transition-all duration-500 right-4  xl:right-auto top-28 xl:col-span-1 xl:sticky ')}>
                    <div className='  flex flex-col gap-4  bg-white dark:bg-[#131313] border dark:border-gray-700  p-4 rounded-lg'>
                            <h5>Order Summary</h5>
                            <span className='flex justify-between w-full items-center'><p>Dataset Price:</p> <p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16}/> 43</p></span>
                            <span className='flex justify-between items-center'><p>Gas Fees:</p> <p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16} /> 0.5</p> </span>
                            <span className='flex justify-between items-center pt-3 border-t dark:border-t-gray-600'><p>Total:</p><p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16} />43.5</p></span>
                            <PrimaryBtn sparkelClass='hidden' className='w-full'>Send Request to All</PrimaryBtn>
                    </div>
            </div>

            <button onClick={() => setShowCheckOut(!ShowCheckOut)} className='absolute xl:hidden bottom-5 right-5 bg-orange-500 flex items-center justify-center p-3 rounded-full'><ShoppingCart/></button>

        </div>
        <div className='flex items-center 2xl:justify-center w-full'>
        <CardsWithCategory categories={["Trending"]} Data={DatasetData}/>
        </div>
        </div> 

    </>
  )
}

export default CartPage
