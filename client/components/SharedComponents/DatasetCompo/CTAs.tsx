
import { LucideShoppingCart,Heart } from "lucide-react"
function CTAs() {
  return (
   <>
   
        <div className="flex rounded-lg bg-white dark:bg-[#131313] dark:border-gray-800 border shadow-lg flex-col  py-2 "> 
                <button className="flex gap-2 hover:bg-gray-200 p-3 dark:hover:bg-[#272727] whitespace-nowrap ">
                    <LucideShoppingCart size={20}/> Add to Cart
                </button>
                <button className="flex gap-2 p-3 hover:bg-gray-200 dark:hover:bg-[#272727] whitespace-nowrap ">
                    <Heart size={20}/> Mark as Favourite
                </button>
               
               
        </div>

   </>
  )
}

export default CTAs
