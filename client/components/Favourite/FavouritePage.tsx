"use client"
import React,{ useState, useEffect,useMemo } from 'react'
import CheckOutDatasetCard from '../SharedComponents/DatasetCompo/CheckOutDatasetCard'
import DatasetData from '@/components/assets/dataset.json'
import Breadcrumb from '../SharedComponents/Breadcrumb/Breadcrumb'
import CardsWithCategory from '../Dashboard/CardsWithCategory'
import { favoriteApi, FavoriteItem } from '@/lib/api/FavoriteApi'
import { useAuth } from '@/lib/Authentication/AuthContext'
import { AxiosError } from 'axios'
import { useNotifications } from '@/lib/notification-context'
import {datasetApi, DatasetCatalogueData} from '@/lib/api/DatasetApi'
import CheckOutDatasetCardSkeleton from '@/components/Skeletons/Dataset/CheckOutDatasetCardSkeleton'
import PrimaryBtn from '../SharedComponents/Btns/PrimaryBtn'

function FavouritePage() {

    const { isAuthenticated, token, userId } = useAuth()
    const [errorFav, setErrorFav] = useState<string | null>(null);
    const [DatasetData, setDatasetData] = useState<DatasetCatalogueData[]>([])
    const { notify, reportError} = useNotifications()
    const [favItems, setFavItems] = useState<FavoriteItem[]>([])
      const [isLoading, setIsLoading] = useState(true)
  
const breadcrumbItems = [
    { label: "Catalogue", href: "/catalogue" },
    { label: "Favourite", isActive: true }
];

  useEffect(() => {
    fetchDatasets()
    fetchFavoriteItems()
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


  const fetchFavoriteItems = async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await favoriteApi.getFavorites(token,userId || undefined)
      setFavItems(response.items || [])
      
    } catch (error: unknown) {
      console.error('Error fetching favorite items:', error)
      if (error instanceof AxiosError) {
        setErrorFav(error.response?.data?.message || error.message || 'Error fetching favorite items')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const NoFavItems = () => (
    <div className="flex flex-col justify-center items-center w-full py-10">
      <p className="text-xl mb-10 text-gray-500 dark:text-gray-200">No favorite items yet.</p>
      <PrimaryBtn sparkelClass='hidden' Href='/catalogue'>Browse Datasets</PrimaryBtn>
    </div>
  );

  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col justify-center items-center w-full py-10 ">
      <p className="text-xl mb-10 text-red-500 dark:text-red-400">{message}</p>
      <PrimaryBtn sparkelClass='hidden' Href='/catalogue'>Browse Datasets</PrimaryBtn>
    </div>
  );
  
  const handleRemoveFromCart = async (datasetId: string) => {
    if (!token) return
    
    try {
      await favoriteApi.removeFromFavorites(datasetId, token)
      notify({ message: 'Item removed from favorites', type: 'success' })
      // Refresh favorites after removal
      fetchFavoriteItems()
    } catch (error: unknown) {
      console.error('Error removing item from favorites:', error)
      if (error instanceof AxiosError) {
        reportError(error.response?.data?.message || error.message || 'Failed to remove item from favorites')
      } else {
        reportError('Failed to remove item from favorites')
      }
    }
  }

  return (
    <>
      <div className=' px-3 md:px-5 mb-5 lg:px-10 xl:px-16 2xl:px-20'>  
        <Breadcrumb items={breadcrumbItems} />
        <div className='w-full col-span-full xl:col-span-3 flex xl:flex-col justify-center xl:justify-start mt-4 max-h-screen overflow-y-auto xl:flex-nowrap flex-wrap gap-5 p-4 '>
            {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <CheckOutDatasetCardSkeleton key={index} />
                ))
            ) : errorFav ? (
                <ErrorDisplay message={errorFav} />
            ) : favItems.length === 0 ? (
                <NoFavItems />
            ) : (
                favItems.map((data,index)=>( 
                <React.Fragment key={data._id || index}>
                <CheckOutDatasetCard 
                Data={{
                id: data._id,
                Title: data.title,
               Description: data.description,
                Type: data.extension,
                Price: data.price,
                Tags: data.tags,
                size: data.fileSize,
                Image: data.coverImageUrl || '/Thumbnail.svg',
                uploadDate: data.createdAt,
                Rating: data.averageRating  
               }} 
               variant="cart"
               onRemove={() => handleRemoveFromCart(data._id)}  />
              </React.Fragment>
                ))


            )}

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

export default FavouritePage
