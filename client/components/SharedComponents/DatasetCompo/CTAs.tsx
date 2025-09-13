"use client"
import { LucideShoppingCart, Heart } from "lucide-react"
import { useAuth } from "@/lib/Authentication/AuthContext"
import { cartApi } from "@/lib/api/CartApi"
import {favoriteApi} from "@/lib/api/FavoriteApi"
import { useState } from "react"
import { useNotifications } from "@/lib/notification-context"
import { AxiosError } from "axios"

type CTAsProps = {
  datasetId: string
  
}

function CTAs({ datasetId }: CTAsProps) {
  const { token } = useAuth()
  const {notify,reportError} = useNotifications()
  
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false)
  return (
   <>
   
        <div className="flex rounded-lg bg-white dark:bg-[#131313] dark:border-gray-800 border shadow-lg flex-col  py-2 "> 
                <button 
                  className="flex gap-2 hover:bg-gray-200 p-3 dark:hover:bg-[#272727] whitespace-nowrap"
                  disabled={isAddingToCart}
                  onClick={async () => {    
                    try {
                      setIsAddingToCart(true)
                      await cartApi.addToCart(datasetId, token || '')
                      notify({message: 'Dataset added to cart', type: 'success'})
                    } catch (error: unknown) {
                      console.error('Error adding to cart:', error)
                      if (error instanceof AxiosError) {
                        reportError(error.response?.data?.message || error.message || 'Failed to add dataset to cart')
                      } else {
                        reportError('Failed to add dataset to cart')
                      }
                    } finally {
                      setIsAddingToCart(false)
                    }
                  }}
                >
                    <LucideShoppingCart size={20}/> {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                 onClick={async () => {    
                    try {
                      setIsAddingToFavorites(true)
                      await favoriteApi.addToFavorites(datasetId, token || '')
                      notify({message: 'Dataset added to favorites', type: 'success'})
                    } catch (error: unknown) {
                      console.error('Error adding to favorites:', error)
                      if (error instanceof AxiosError) {
                        reportError(error.response?.data?.message || error.message || 'Failed to add dataset to favorites')
                      } else {
                        reportError('Failed to add dataset to favorites')
                      }
                    } finally {
                      setIsAddingToFavorites(false)
                    }
                  }} 
                className="flex gap-2 p-3 hover:bg-gray-200 dark:hover:bg-[#272727] whitespace-nowrap ">
                    <Heart size={20}/> {isAddingToFavorites ? 'Adding...' :'Mark as Favourite'}
                </button>
               
               
        </div>

   </>
  )
}

export default CTAs
