import React from 'react'

function NumberCard({Num=0,Title='Demo Title'}:{Num:number,Title:string}) {
  return (
   <>
   
   <div className='bg-white dark:bg-[#131313] w-[210px] border-2 dark:border-gray-600 rounded-lg p-3 flex flex-col items-start justify-center gap-3 '>

        <h3 className='font-bricola font-semibold text-xl max-w-[50%] '>{Title}</h3>
        <h2 className='font-semibold text-4xl font-bricola'>{Num}</h2>
   </div>
   
   </>
  )
}

export default NumberCard
