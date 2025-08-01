import clsx from 'clsx'


function SecondaryBtn({children,onClick,className}) {
  return (

    <button onClick={onClick} className={clsx(className,"text-sm sm:text-base px-6 py-[10px] bg-[#101010] hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-700 ")}>
        {children}
    </button>

  )
}

export default SecondaryBtn
