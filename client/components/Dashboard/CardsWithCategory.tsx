import React from 'react'
import DatasetCard from '../SharedComponents/DatasetCompo/DatasetCard'

type Data = {
    id?:number,
 Image?: string;
  Title?: string;
  Description?: string;
  Type?: string;
  Price?: number | string;
  Tags?: string[];
}

type CardsWithCategoryProp={
    categories:string[],
    Data:Data
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
                    {Data.map((item) => (
                      <DatasetCard key={item.id} Data={item} />
                    ))}
                  </div>
                </div>
              ))}

   </>
  )
}

export default CardsWithCategory
