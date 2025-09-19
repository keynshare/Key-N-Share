import React from 'react'
import DatasetCard from '../SharedComponents/DatasetCompo/DatasetCard'

type Data = {
    _id?: string;
    Image?: string;
    coverImageUrl?: string;
    Title?: string;
    title?: string;
    Description?: string;
    description?: string;
    Type?: string;
    tags?: string[];
    Price?: number | string;
    price?: number;
    fileSize?: string;
    downloads?: number;
    views?: number;
    averageRating?: number;
    name?: string;
    role?: string;
}

type CardsWithCategoryProp={
    categories:string[],
    Data:Data[]
}


function CardsWithCategory({categories,Data}:CardsWithCategoryProp) {
    
  return (
   <>
   
    {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full overflow-hidden h-fit gap-5 items-start justify-start"
                >
                  <h2 className="text-[25px] font-semibold font-bricola ">
                    {category}
                  </h2>
                  <div className="flex h-fit w-full overflow-x-auto scrollHidden  justify-start gap-4 items-center pb-4">
                    {Data.map((item, index) => (
                      <DatasetCard key={item._id || index} Data={item} />
                    ))}
                  </div>
                </div>
              ))}

   </>
  )
}

export default CardsWithCategory
