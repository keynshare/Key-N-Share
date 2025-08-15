import Sparkel from '@/components/assets/glitter-button-effect.svg'
import clsx from 'clsx'
import Image from "next/image"

type PropTypes={
    children:React.ReactNode,
    onClick?:React.MouseEventHandler<HTMLButtonElement>,
    className?:string
    sparkelClass?:string
}

function PrimaryBtn({children,onClick,sparkelClass,className}:PropTypes) {
  return (
    <button onClick={onClick} className={clsx( className ,"relative group w-fit h-fit")}> 
<div className="inline-block relative w-full z-10 rounded-lg p-[3px] [background:linear-gradient(105deg,#1070FF_0%,#BA8CFF_17%,rgba(167,108,255,0.8)_30%,#FFBEE6_40%,#FF9C4B_75%,#FFC18E_83%,#FF7A00_100%)]  hover:bg-white text-black  ">
  <div className="text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[7px] group-hover:bg-white dark:group-hover:bg-[#131313] dark:hover:text-white text-[#292929] rounded-md transition-all duration-500 font-semibold w-full h-full">
   {children}
  </div>
  
</div>
<div className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 rounded-2xl transition-all w-[93%] h-[40px] sm:h-[50px] duration-500 bg-[#EDEDED] dark:bg-[#292929] "/>
<Image src={Sparkel} className={clsx(sparkelClass ,"absolute  top-[-10px] left-[-10px] max-w-[126%]  w-[186px] transition-all duration-500 group-hover:scale-0 ")} alt="" />
</button>  
  )
}

export default PrimaryBtn
