"use client"
import React, { useState, useEffect } from 'react'
import CheckOutDatasetCard from '../SharedComponents/DatasetCompo/CheckOutDatasetCard'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
import CardsWithCategory from '../Dashboard/CardsWithCategory'
import PrimaryBtn from '../SharedComponents/Btns/PrimaryBtn'
import Matic from '../assets/Matic'
import { ShoppingCart } from 'lucide-react'
import clsx from 'clsx'
import { cartApi, CartItem } from '@/lib/api/CartApi'
import { useAuth } from '@/lib/Authentication/AuthContext'
import CheckOutDatasetCardSkeleton from '@/components/Skeletons/Dataset/CheckOutDatasetCardSkeleton'
import {datasetApi, DatasetCatalogueData} from '@/lib/api/DatasetApi'
import { AxiosError } from 'axios'
import { useNotifications } from '@/lib/notification-context'

function CartPage({userId}: {userId?: string}) {
  const [showCheckOut, setShowCheckOut] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)
  const { isAuthenticated, token } = useAuth()
 const [errorCart, setErrorCart] = useState<string | null>(null);
  const [DatasetData, setDatasetData] = useState<DatasetCatalogueData[]>([])
  const { notify, reportError} = useNotifications()
  const breadcrumbItems = [
    { label: "Catalogue", href: "/catalogue" },
    { label: "Cart", isActive: true }
  ];
  
  useEffect(() => {
    fetchDatasets()
    fetchCartItems()
  }, [isAuthenticated, token])
  
  const fetchDatasets = async () => {
    try {
      const response = await datasetApi.getDatasets( 1,6,token || undefined);
      setDatasetData(response.data || []);
    } catch (error: unknown) {
      console.error('Error fetching datasets:', error);
      return;
    }
  };


  const fetchCartItems = async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await cartApi.getCart(token,userId)
      setCartItems(response.items || [])
      
      // Calculate total price
      const total = (response.items || []).reduce((sum, item) => sum + (item.price || 0), 0)
      setTotalPrice(total)
    } catch (error: unknown) {
      console.error('Error fetching cart items:', error)
      if (error instanceof AxiosError) {
        setErrorCart(error.response?.data?.message || error.message || 'Error fetching cart items')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRemoveFromCart = async (datasetId: string) => {
    if (!token) return
    
    try {
      await cartApi.removeFromCart(datasetId, token)
      notify({ message: 'Item removed from cart', type: 'success' })
      // Refresh cart after removal
      fetchCartItems()
    } catch (error: unknown) {
      console.error('Error removing item from cart:', error)
      if (error instanceof AxiosError) {
        reportError(error.response?.data?.message || error.message || 'Failed to remove item from cart')
      } else {
        reportError('Failed to remove item from cart')
      }
    }
  }

  return (
    <>
      <div className=' px-3 md:px-5 mb-5 overflow-x-hidden lg:px-10 xl:px-16 2xl:px-20'>  
        <Breadcrumb items={breadcrumbItems} />
        <div className='grid grid-cols-1 lg:grid-cols-4 pb-10  mt-4 flex-wrap gap-5 items-start justify-center w-full '>
            
            <div className='w-full col-span-full xl:col-span-3 flex xl:flex-col justify-center xl:justify-start mt-4 max-h-screen overflow-y-auto xl:flex-nowrap flex-wrap gap-5 p-4 '>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <CheckOutDatasetCardSkeleton key={index} />
                  ))
                ) : errorCart ? (
                  <div className="flex flex-col justify-center items-center w-full py-10 ">
                    <p className="text-xl mb-10 text-red-500">{errorCart}</p>
                    <PrimaryBtn sparkelClass='hidden' Href='/catalogue'>Browse Datasets</PrimaryBtn>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <React.Fragment key={item._id || index}>
                      <CheckOutDatasetCard 
                        Data={{
                          id: item._id,
                          Title: item.title,
                          Description: item.description,
                          Type: item.extension,
                          Price: item.price,
                          Tags: item.tags,
                          Image: item.coverImageUrl || '/Thumbnail.svg',
                          size: item.fileSize,
                          uploadDate: item.createdAt,
                          Rating: item.averageRating 
                        }} 
                        variant="cart"
                        onRemove={() => handleRemoveFromCart(item._id)}
                      />
                    </React.Fragment>
                  ))
                )}
            </div>
            <div  className={clsx( showCheckOut ? 'translate-x-0' : 'translate-x-[100vw] xl:translate-x-0 ',' z-50 fixed min-w-[300px] max-w-[300px] transition-all duration-500 right-4  xl:right-auto top-20 xl:col-span-1 xl:sticky ')}>
                    <div className='  flex flex-col gap-4  bg-white dark:bg-[#131313] border dark:border-gray-700  p-4 rounded-lg'>
                            <h5>Order Summary</h5>
                            <span className='flex justify-between w-full items-center'><p>Dataset Price:</p> <p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16}/> {totalPrice}</p></span>
                            <span className='flex justify-between items-center'><p>Gas Fees:</p> <p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16} /> 0.5</p> </span>
                            <span className='flex justify-between items-center pt-3 border-t dark:border-t-gray-600'><p>Total:</p><p className='flex items-center justify-center flex-nowrap gap-1'><Matic size={16} />{(totalPrice + 0.5).toFixed(2)}</p></span>
                            <PrimaryBtn 
                              sparkelClass='hidden' 
                              className='w-full' 
                              disabled={cartItems.length === 0}
                              onClick={() => cartItems.length > 0 }
                            >
                              {cartItems.length > 0 ? 'Send Request to All' : 'Cart is Empty'}
                            </PrimaryBtn>
                    </div>
            </div>

            <button onClick={() => setShowCheckOut(!showCheckOut)} className='fixed z-50 xl:hidden bottom-5 right-5 bg-orange-500 flex items-center justify-center p-3 rounded-full'><ShoppingCart/></button>

        </div>
        <div className='flex items-center 2xl:justify-center w-full'>
        {DatasetData.length === 0 ?
        <div>
         
        </div> :
        <CardsWithCategory categories={["Recommended"]} Data={DatasetData}/>
      }
        </div>
        </div> 

    </>
  )
}

export default CartPage
