
import { LucideShoppingCart,Heart } from "lucide-react"
function CTAs() {
  return (
   <>
   
        <div className="flex absolute left-0 top-5 rounded-lg bg-white border shadow-lg flex-col  py-2 "> 
                <button className="flex gap-2 hover:bg-gray-200 p-3 whitespace-nowrap ">
                    <LucideShoppingCart size={20}/> Add to Cart
                </button>
                <button className="flex gap-2 p-3 hover:bg-gray-200 whitespace-nowrap ">
                    <Heart size={20}/> Mark as Favourite
                </button>
               
               
        </div>

   </>
  )
}

export default CTAs
