import CircleBG from './CircleBG'
import Logo from '@/public/logo.svg'
import Image from 'next/image'
import PrimaryBtn from '../SharedComponents/PrimaryBtn'
import SecondaryBtn from '../SharedComponents/SecondaryBtn'
import Diagram from './Diagram'
function HeroSection() {
  return (
    <>
   <CircleBG/>

   <div className='flex flex-col z-50 relative items-center gap-9 justify-center h-screen md:h-[580px] xl:h-[700px] w-screen px-[5vw] '>

      <div className='flex justify-center items-center gap-3 [background:#192B42/25] backdrop-blur-xl shadow-[0_0_5px_0_#004CBE50_inset]  px-[15px] py-[5px]  rounded-full border-[0.75px] border-[rgba(25,43,66,0.25)]'>
        
        <Image src={Logo} alt='Key N Share' className="w-[18px] sm:w-[25px]" />
          <p className='text-[#004CBE] text-xs sm:text-base shiny-text'>  Discover. Download. Decrypt.</p>

      </div>


      <div className='flex flex-col items-center justify-center gap-3'>
        <h1 className='font-bricola font-extrabold sm:font-bold text-lg sm:text-3xl md:text-[31px] lg:text-[42px]  xl:text-5xl w-[320px] sm:w-3/4 text-center'>Own Your Data. Share It Securely. Get Paid Fairly.</h1>
        <p className='text-[#3F3F3F] text-center text-base md:text-lg'> Own, protect, and monetize your data in the Web3 era. </p>
      </div>

      <div className='flex flex-wrap items-center justify-center  gap-5'>
        <SecondaryBtn>Upload Datasets</SecondaryBtn>
        <PrimaryBtn sparkelClass='sm:!-top-3 -top-[15px]  w-[200px] ' className={'w-[156px] sm:w-fit'} >Get Started</PrimaryBtn>
      </div>

   </div>

   <Diagram/>
    
    </>
  )
}

export default HeroSection
