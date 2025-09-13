import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import User from "@/components/assets/User.svg";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Matic from "@/components/assets/Matic"
import timeAgo from "@/components/SharedComponents/DatasetCompo/timeAgo"
import { useAuth } from "@/lib/Authentication/AuthContext"
import { cartApi } from "@/lib/api/CartApi"
import { favoriteApi } from "@/lib/api/FavoriteApi"
import { useState } from "react"
import {useNotifications} from "@/lib/notification-context"
import {AxiosError} from "axios"

type Dataset = {
  id?: string;
  Rating?:number
  userRating?:number
  Image?: string;
  Title?: string;
  Description?: string;
  Type?: string;
  Price?: number | string;
  Size?: string;
  Extention?: string;
  Tags?: string[];
  CoverImage?: string;
  Name?: string;
  Time?: string;
  UserImage?: string;
};

export default function Header({ id, userRating=4, Rating=0, Size='0 mb', Extention='CSV', Price='46', Tags=[ "Arts and Entertainment", "Music", "Data Science", "Computer Science" ], CoverImage="/Thumbnail.svg", Title="Top Spotify Listening History Songs in Countries", Name='Mohammad Sumbul', Time='', UserImage=User.src}:Dataset) {
  const { token } = useAuth()
  const {notify} = useNotifications()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  
  const handleAddToCart = async () => {
   
    
    if (!id) {
      console.error('Dataset ID is missing')
      return
    }
    
    try {
      setIsAddingToCart(true)
      await cartApi.addToCart(id, token || '')
      notify({message: 'Dataset added to cart', type: 'success'})
    } catch (error: unknown) {
      console.error('Error adding to cart:', error)
      if (error instanceof AxiosError) {
        notify({message: error.response?.data?.message || error.message || 'Failed to add dataset to cart', type: 'error'})
      } else {
        notify({message: 'Failed to add dataset to cart', type: 'error'})
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToFavorites = async () => {
    if (!id) {
      console.error('Dataset ID is missing')
      return
    }

    try {
      setIsAddingToFavorites(true)
      await favoriteApi.addToFavorites(id, token || '')
      notify({message: 'Dataset added to favorites', type: 'success'})
    } catch (error: unknown) {
      console.error('Error adding to favorites:', error)
      if (error instanceof AxiosError) {
        notify({message: error.response?.data?.message || error.message || 'Failed to add dataset to favorites', type: 'error'})
      } else {
        notify({message: 'Failed to add dataset to favorites', type: 'error'})
      }
    } finally {
      setIsAddingToFavorites(false)
    }
  }

  return (
    <>
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="lg:col-span-2 relative overflow-hidden rounded-xl border dark:border-2 border-gray-200 dark:border-gray-400">
        <img
          src={CoverImage}
          alt={Title}
          width={1600}
          height={900}
          className="w-full h-auto"
        />
      </div>
    
    </div>
    <div className="space-y-4 pb-6">
      <h1 className="text-3xl md:text-4xl font-bold font-bricola leading-tight">
        {Title}
      </h1>
       
       <div className="flex items-start gap-3">
                <Image src={UserImage} alt={Name} width={50} height={50} className="rounded-full" />
                <div className="flex flex-col">
                  <span className=" font-medium">{Name}</span>
                  <span className="inline-flex items-center gap-1"><Star size={18} className="text-yellow-500"/>{userRating}</span>
                </div>
        </div>

      <div className="flex flex-wrap items-center gap-2  text-gray-500">
        <span>Uploaded {timeAgo(Time)}</span>
        <span>•</span>
        <span>{Size}</span>
        <span>•</span>
        <span>{Extention}</span>
        <span>•</span>
        <span className="flex items-center justify-center gap-1"><Star size={18} className="text-yellow-500"/><span>{Rating}</span></span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 rounded-md border dark:border-gray-700">
            {tag}
          </span>
        ))}
      </div>

        <div className="flex flex-wrap justify-start items-center gap-4">

            <span className="flex items-center gap-2">
            <Matic size={32} /> 
            <h6 className="text-[42px]  ">{Price} </h6>
            </span>

             <button 
            className="shadow-md flex items-center justify-center w-12 h-12 border dark:border-gray-600 rounded-full transition-all duration-500"
              onClick={handleAddToFavorites}
              disabled={isAddingToFavorites}
            >
               {isAddingToFavorites ? <div className="p-2 rounded-full border-2 border-r-gray-200 border-orange-400 animate-spin "></div> : <Heart size={20} />}
            </button>

            <SecondaryBtn 
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            > 
              <ShoppingCart size={20} /> {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </SecondaryBtn>
           
            <PrimaryBtn >Buy Now</PrimaryBtn>
        </div>

    </div>
    </>
  );
}