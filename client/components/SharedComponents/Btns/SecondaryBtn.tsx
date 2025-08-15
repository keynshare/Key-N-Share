import clsx from 'clsx'

type PropTypes={
    children:React.ReactNode,
    onClick?:React.MouseEventHandler<HTMLButtonElement>,
    className?:string
}


function SecondaryBtn({children,onClick,className}:PropTypes) {
  return (

    <button onClick={onClick} className={clsx(className,"text-sm flex items-center justify-center gap-2 sm:text-base px-6 py-[10px] bg-[#101010] hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </button>

  )
}

export default SecondaryBtn
