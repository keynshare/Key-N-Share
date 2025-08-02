"use client"
import {forwardRef, useState,useEffect, useRef} from 'react'
import BeamAnimation from '../Animations/BeamAnimation'
import { Particles } from '../Animations/Particles'

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ")


const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex items-center cursor-pointer justify-center rounded-full transition-colors duration-500 border-2 border-[#686868] hover:border-cyan-300 bg-[#CFCFCF]/15 hover:bg-cyan-300/30 backdrop-blur-3xl shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          "w-12 h-12 p-2 sm:w-10 sm:h-10 sm:p-2.5 md:w-16 md:h-16 md:p-3", 
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = "Circle"





const Icons = {
  image1: () => (
   <svg width="52" height="45" viewBox="0 0 52 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M38.6154 31.6913L50.7125 24.7328C51.3537 24.3632 51.75 23.6778 51.75 22.9421V9.02512C51.75 8.28944 51.3537 7.604 50.7125 7.23436L38.6154 0.275883C37.9742 -0.093753 37.1781 -0.0901643 36.5404 0.275883L24.4434 7.23436C23.8021 7.604 23.4059 8.28944 23.4059 9.02512V33.8948L14.9221 38.7718L6.43828 33.8948V24.1371L14.9221 19.2601L20.5167 22.4791V15.9334L15.9596 13.31C15.6462 13.1306 15.2859 13.0337 14.9221 13.0337C14.5582 13.0337 14.198 13.1306 13.8846 13.31L1.78751 20.2685C1.14627 20.6381 0.75 21.3236 0.75 22.0593V35.9762C0.75 36.7119 1.14627 37.3973 1.78751 37.767L13.8846 44.7255C14.5258 45.0915 15.3183 45.0915 15.9596 44.7255L28.0566 37.767C28.6979 37.3973 29.0941 36.7119 29.0941 35.9762V11.1066L29.2454 11.0204L37.5743 6.22953L46.0581 11.1066V20.8642L37.5743 25.7413L31.9869 22.5294V29.0752L36.5368 31.6913C37.1781 32.0574 37.9742 32.0574 38.6118 31.6913H38.6154Z" fill="url(#paint0_linear_84_53)"/>
<defs>
<linearGradient id="paint0_linear_84_53" x1="0.584286" y1="37.3399" x2="49.465" y2="8.85907" gradientUnits="userSpaceOnUse">
<stop stop-color="#A726C1"/>
<stop offset="0.88" stop-color="#803BDF"/>
<stop offset="1" stop-color="#7B3FE4"/>
</linearGradient>
</defs>
</svg>

  ),
  image2: () => (
   <svg width="39" height="39" className='p-[2.3px]' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V11.375L24.375 3.25H9.75C8.88805 3.25 8.0614 3.59241 7.4519 4.2019C6.84241 4.8114 6.5 5.63805 6.5 6.5V8.125M22.75 3.25V9.75C22.75 10.612 23.0924 11.4386 23.7019 12.0481C24.3114 12.6576 25.138 13 26 13H32.5M13 21.125V17.875C13 17.013 12.6576 16.1864 12.0481 15.5769C11.4386 14.9674 10.612 14.625 9.75 14.625C8.88805 14.625 8.0614 14.9674 7.4519 15.5769C6.84241 16.1864 6.5 17.013 6.5 17.875V21.125M4.875 21.125H14.625C15.5225 21.125 16.25 21.8525 16.25 22.75V27.625C16.25 28.5225 15.5225 29.25 14.625 29.25H4.875C3.97754 29.25 3.25 28.5225 3.25 27.625V22.75C3.25 21.8525 3.97754 21.125 4.875 21.125Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  ),
  image3: () => (
    <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.2499 0L3.49695 10.25V30.75L21.2499 41L39.0029 30.75V10.25L21.2499 0ZM19.4169 2.46854H19.4186C19.9475 2.85892 20.5875 3.06956 21.2448 3.06956C21.9021 3.06956 22.5422 2.85892 23.071 2.46854L35.9416 9.89979C35.9158 10.1285 35.9158 10.3595 35.9416 10.5883L23.0693 18.0195C22.5406 17.6295 21.9009 17.4191 21.244 17.4191C20.587 17.4191 19.9473 17.6295 19.4186 18.0195L6.54461 10.5883C6.57033 10.3601 6.57033 10.1297 6.54461 9.9015L19.4169 2.46854ZM37.1784 12.6417C37.3647 12.7783 37.5645 12.8928 37.7747 12.985V27.8475C37.172 28.1104 36.6695 28.5595 36.3408 29.1289C36.0121 29.6983 35.8746 30.3581 35.9484 31.0114L23.0762 38.4426C22.8908 38.3068 22.6908 38.1922 22.4799 38.101L22.4646 23.3188C23.0672 23.0563 23.5699 22.6076 23.8989 22.0385C24.2278 21.4694 24.3658 20.8099 24.2925 20.1566L37.1784 12.6417ZM5.32145 12.7237L18.1937 20.1549C18.1199 20.8082 18.2574 21.468 18.5861 22.0374C18.9148 22.6068 19.4173 23.0559 20.0199 23.3188V38.1813C19.8081 38.2735 19.6099 38.3897 19.4237 38.5263L6.55145 31.0951C6.62527 30.4418 6.48775 29.782 6.15908 29.2126C5.8304 28.6432 5.32788 28.1941 4.72524 27.9313V13.0688C4.93655 12.9759 5.13534 12.8602 5.32145 12.7237Z" fill="#00D0FF"/>
</svg>

  ),

  image5: () => (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
        fill="#000"
      />
    </svg>
  ),
  image6: () => (
   <svg width="65" height="71" viewBox="0 0 65 71" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.416 9.62183C20.9156 5.13403 28.8589 3.23821 36.6846 4.30737L30.7979 11.6716C24.7137 12.0866 19.0132 14.794 14.8477 19.2478C10.6823 23.7015 8.36183 29.5697 8.35449 35.6677C8.36137 40.7101 9.94979 45.6242 12.8965 49.7166C15.8433 53.8087 20.0006 56.8734 24.7812 58.4792L22.5371 65.7371C15.0319 63.2761 8.71788 58.0978 4.83594 51.2195C0.954034 44.3411 -0.214986 36.2589 1.55762 28.5623C3.33022 20.8656 7.91645 14.1097 14.416 9.62183Z" fill="white"/>
<path d="M14.416 9.62183C20.9156 5.13403 28.8589 3.23821 36.6846 4.30737L30.7979 11.6716C24.7137 12.0866 19.0132 14.794 14.8477 19.2478C10.6823 23.7015 8.36183 29.5697 8.35449 35.6677C8.36137 40.7101 9.94979 45.6242 12.8965 49.7166C15.8433 53.8087 20.0006 56.8734 24.7812 58.4792L22.5371 65.7371C15.0319 63.2761 8.71788 58.0978 4.83594 51.2195C0.954034 44.3411 -0.214986 36.2589 1.55762 28.5623C3.33022 20.8656 7.91645 14.1097 14.416 9.62183Z" stroke="#575757"/>
<path d="M42.2529 5.53101C49.8141 7.9514 56.189 13.1248 60.1143 20.0251C64.0393 26.9256 65.2276 35.0494 63.4434 42.7849C61.6591 50.5206 57.0332 57.3031 50.4824 61.7878C43.9316 66.2723 35.9345 68.131 28.0771 66.9958L33.9111 59.6814C39.5105 59.3662 44.8233 57.1052 48.9316 53.2888C53.0402 49.4719 55.6862 44.3401 56.4121 38.78C57.1377 33.2195 55.8975 27.5798 52.9062 22.8367C49.9153 18.0936 45.3608 14.5449 40.0303 12.8035L42.2529 5.53101Z" fill="white"/>
<path d="M42.2529 5.53101C49.8141 7.9514 56.189 13.1248 60.1143 20.0251C64.0393 26.9256 65.2276 35.0494 63.4434 42.7849C61.6591 50.5206 57.0332 57.3031 50.4824 61.7878C43.9316 66.2723 35.9345 68.131 28.0771 66.9958L33.9111 59.6814C39.5105 59.3662 44.8233 57.1052 48.9316 53.2888C53.0402 49.4719 55.6862 44.3401 56.4121 38.78C57.1377 33.2195 55.8975 27.5798 52.9062 22.8367C49.9153 18.0936 45.3608 14.5449 40.0303 12.8035L42.2529 5.53101Z" stroke="#575757"/>
<path d="M33.2285 28.7305L41.6113 29.7607L47.5791 39.6211L22.6992 70.8301L31.54 42.2334L23.1562 41.2031L17.1885 31.3467L41.8574 0.5L33.2285 28.7305Z" fill="#FF7A00"/>
<path d="M33.2285 28.7305L41.6113 29.7607L47.5791 39.6211L22.6992 70.8301L31.54 42.2334L23.1562 41.2031L17.1885 31.3467L41.8574 0.5L33.2285 28.7305Z" stroke="#575757"/>
</svg>


  ),
  image7: () => (
   <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.5834 43.75V39.5833C39.5834 37.3732 38.7055 35.2536 37.1426 33.6908C35.5798 32.128 33.4602 31.25 31.2501 31.25H18.7501C16.5399 31.25 14.4203 32.128 12.8575 33.6908C11.2947 35.2536 10.4167 37.3732 10.4167 39.5833V43.75M33.3334 14.5833C33.3334 19.1857 29.6025 22.9167 25.0001 22.9167C20.3977 22.9167 16.6668 19.1857 16.6668 14.5833C16.6668 9.98096 20.3977 6.25 25.0001 6.25C29.6025 6.25 33.3334 9.98096 33.3334 14.5833Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  ),
}


 interface DiagramProp {
  className?: string
  icons?: typeof Icons
  beamColor?: string
  beamSpeed?: number
}

export const Diagram: React.FC<DiagramProp> = ({
  className,
  icons = Icons,
 
  beamSpeed = 9,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
   const [particleCount, setParticleCount] = useState<number>(200)
  
  useEffect(() => {
  
    const updateParticleCount = () => {
      if (window.innerWidth < 640) { 
        setParticleCount(100)
      } else if (window.innerWidth < 1024) { 
        setParticleCount(200)
      } else {
        setParticleCount(800)
      }
    }

    updateParticleCount()

    window.addEventListener('resize', updateParticleCount)
    return () => window.removeEventListener('resize', updateParticleCount)
  }, [])

  return (
   <>
   

    <div
      className={cn(
        "relative flex w-full  mx-auto items-center -translate-y-6 justify-center bg-black overflow-hidden rounded-lg border bg-background",
        "p-4 sm:p-6 md:p-10 md:shadow-xl", 
        className,
      )}
      ref={containerRef}
    >
        <Particles
          className="absolute inset-0"
        quantity={particleCount}
        ease={30}
        color='#67e8f9'
        size={0.5}
        refresh/>

      <div className="flex h-full w-full flex-row items-stretch justify-between max-w-3xl">
        <div className="flex flex-col justify-center gap-10 md:gap-24">
          <Circle ref={div1Ref}>{icons.image1()}</Circle>
          <Circle ref={div2Ref}>{icons.image2()}</Circle>
          <Circle ref={div3Ref}>{icons.image3()}</Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle
            ref={div4Ref}
            className="w-10 h-10 sm:w-12 sm:h-12 md:p-4 md:w-20 md:h-20 border-[3px]" 
          >
            {icons.image6()}
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div5Ref}>{icons.image7()}</Circle>
        </div>
      </div>

      <BeamAnimation
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        duration={beamSpeed}
        gradientStartColor='#FFC300'
        gradientStopColor='#A100FF '
      />
      <BeamAnimation
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        duration={beamSpeed}
    gradientStartColor='#FFC300'
        gradientStopColor='#A100FF '
      />
      <BeamAnimation
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        duration={beamSpeed}
        gradientStartColor='#FFC300'
        gradientStopColor='#A100FF '
      />
    
      <BeamAnimation
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div5Ref}
        duration={beamSpeed}
        gradientStartColor='#FFC300'
        gradientStopColor='#A100FF '
      />
    </div>

   </>
  )
}

export default Diagram;
