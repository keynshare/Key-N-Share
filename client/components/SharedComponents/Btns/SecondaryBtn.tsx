import clsx from 'clsx'
import Link from 'next/link'

type PropTypes={
    children:React.ReactNode,
    onClick?:React.MouseEventHandler<HTMLButtonElement>,
    className?:string,
    Href?:string
}


function SecondaryBtn({children,onClick,className,Href}:PropTypes) {
  return (
<>

{Href ?
    <Link href={Href} className={clsx(className,"text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[10px] bg-[#101010] dark:bg-[#242424] hover:bg-[#e4e4e4] dark:hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </Link>
    :
    <button onClick={onClick} className={clsx(className,"text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[10px] bg-[#101010] dark:bg-[#1b1b1b] hover:bg-[#e4e4e4] dark:hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </button>
}
</>
  )
}

export default SecondaryBtn
