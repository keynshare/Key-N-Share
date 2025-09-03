import clsx from 'clsx'
import Link from 'next/link'

type PropTypes={
    children:React.ReactNode,
    onClick?:React.MouseEventHandler<HTMLButtonElement>,
    className?:string,
    Href?:string,
    Type?: "button" | "submit" | "reset",
    Title?: string,
    disabled?: boolean
}


function SecondaryBtn({children,onClick,className,Href,Type,Title,disabled}:PropTypes) {
  return (
<>

{Href ?
    <Link href={Href} title={Title ? Title : ''} className={clsx(className,"text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[10px] bg-[#101010] dark:bg-[#242424] hover:bg-[#e4e4e4] dark:hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </Link>
    :
    <button title={Title ? Title : ''} disabled={disabled} type={Type ? Type : 'button' } onClick={onClick} className={clsx(className,"text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[10px] bg-[#101010] dark:bg-[#1b1b1b] hover:bg-[#e4e4e4] dark:hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </button>
}
</>
  )
}

export default SecondaryBtn
