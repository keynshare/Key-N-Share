

function SecondaryBtn({children,onClick}) {
  return (

    <button onClick={onClick} className="px-6 py-[10px] bg-[#101010] hover:bg-[#e4e4e4] text-white hover:text-[#101010] rounded-lg  font-semibold  transition-all duration-500 ">
        {children}
    </button>

  )
}

export default SecondaryBtn
