"use client"
import {forwardRef, useState,useEffect, useRef} from 'react'
import BeamAnimation from '../Animations/BeamAnimation'
import { Particles } from '../Animations/Particles'

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ")


const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode; forceHover?: boolean; Tooltip?: string }>(
  ({ className, children, forceHover,Tooltip }, ref) => {
    return (
      <div
        ref={ref}
        title={Tooltip}
        className={cn(
          "z-10 flex items-center cursor-pointer justify-center rounded-full transition-colors hover:shadow-[0px_1px_10px_0px_rgba(94,191,255,1.00)] duration-500 border-2 border-[#686868] hover:border-[#80b4fa] bg-[#CFCFCF]/15 hover:bg-[#0d182b] backdrop-blur-3xl shadow-[0_4px_20px_-12px_#ffff]",
          "w-12 h-12 p-2 sm:w-10 sm:h-10 sm:p-2.5 md:w-16 md:h-16 md:p-3",
          className,
          forceHover ? "!border-[#5ebfff] !shadow-[0px_1px_10px_0px_rgba(94,191,255,1.00)] !bg-[#0d182b] " : undefined
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
<stop stopColor="#A726C1"/>
<stop offset="0.88" stopColor="#803BDF"/>
<stop offset="1" stopColor="#7B3FE4"/>
</linearGradient>
</defs>
</svg>

  ),
  image2: () => (
   <svg width="39" height="39" className='p-[2.3px]' viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V11.375L24.375 3.25H9.75C8.88805 3.25 8.0614 3.59241 7.4519 4.2019C6.84241 4.8114 6.5 5.63805 6.5 6.5V8.125M22.75 3.25V9.75C22.75 10.612 23.0924 11.4386 23.7019 12.0481C24.3114 12.6576 25.138 13 26 13H32.5M13 21.125V17.875C13 17.013 12.6576 16.1864 12.0481 15.5769C11.4386 14.9674 10.612 14.625 9.75 14.625C8.88805 14.625 8.0614 14.9674 7.4519 15.5769C6.84241 16.1864 6.5 17.013 6.5 17.875V21.125M4.875 21.125H14.625C15.5225 21.125 16.25 21.8525 16.25 22.75V27.625C16.25 28.5225 15.5225 29.25 14.625 29.25H4.875C3.97754 29.25 3.25 28.5225 3.25 27.625V22.75C3.25 21.8525 3.97754 21.125 4.875 21.125Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

  ),
  image3: () => (
    <svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.2499 0L3.49695 10.25V30.75L21.2499 41L39.0029 30.75V10.25L21.2499 0ZM19.4169 2.46854H19.4186C19.9475 2.85892 20.5875 3.06956 21.2448 3.06956C21.9021 3.06956 22.5422 2.85892 23.071 2.46854L35.9416 9.89979C35.9158 10.1285 35.9158 10.3595 35.9416 10.5883L23.0693 18.0195C22.5406 17.6295 21.9009 17.4191 21.244 17.4191C20.587 17.4191 19.9473 17.6295 19.4186 18.0195L6.54461 10.5883C6.57033 10.3601 6.57033 10.1297 6.54461 9.9015L19.4169 2.46854ZM37.1784 12.6417C37.3647 12.7783 37.5645 12.8928 37.7747 12.985V27.8475C37.172 28.1104 36.6695 28.5595 36.3408 29.1289C36.0121 29.6983 35.8746 30.3581 35.9484 31.0114L23.0762 38.4426C22.8908 38.3068 22.6908 38.1922 22.4799 38.101L22.4646 23.3188C23.0672 23.0563 23.5699 22.6076 23.8989 22.0385C24.2278 21.4694 24.3658 20.8099 24.2925 20.1566L37.1784 12.6417ZM5.32145 12.7237L18.1937 20.1549C18.1199 20.8082 18.2574 21.468 18.5861 22.0374C18.9148 22.6068 19.4173 23.0559 20.0199 23.3188V38.1813C19.8081 38.2735 19.6099 38.3897 19.4237 38.5263L6.55145 31.0951C6.62527 30.4418 6.48775 29.782 6.15908 29.2126C5.8304 28.6432 5.32788 28.1941 4.72524 27.9313V13.0688C4.93655 12.9759 5.13534 12.8602 5.32145 12.7237Z" fill="#00D0FF"/>
</svg>

  ),

 
  image6: () => (
    <svg width="141" height="103" viewBox="0 0 141 103" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.701493 14.2069V0H47V47.3305C47 47.8444 47.3895 48.2747 47.9009 48.3256L88.0072 52.3181C89.6145 52.4781 91.117 53.189 92.2599 54.3304L141 103H92.9582C91.3785 103 89.8626 102.377 88.7393 101.266L0.701493 14.2069Z" fill="url(#paint0_linear_513_32)"/>
    <path d="M90.4925 35.5172L56.1194 0H123.463L90.4925 35.5172Z" fill="url(#paint1_linear_513_32)"/>
    <path d="M1.40299 103L0 46.8828L56.1194 103H1.40299Z" fill="url(#paint2_linear_513_32)"/>
    <defs>
    <linearGradient id="paint0_linear_513_32" x1="70.5" y1="-3.94029e-06" x2="-26.1289" y2="187.698" gradientUnits="userSpaceOnUse">
    <stop offset="0.0769231" stopColor="#E5E5E5"/>
    <stop offset="0.552885" stopColor="#1070FF"/>
    </linearGradient>
    <linearGradient id="paint1_linear_513_32" x1="70.5" y1="-3.94029e-06" x2="-26.1289" y2="187.698" gradientUnits="userSpaceOnUse">
    <stop offset="0.0769231" stopColor="#E5E5E5"/>
    <stop offset="0.552885" stopColor="#1070FF"/>
    </linearGradient>
    <linearGradient id="paint2_linear_513_32" x1="70.5" y1="-3.94029e-06" x2="-26.1289" y2="187.698" gradientUnits="userSpaceOnUse">
    <stop offset="0.0769231" stopColor="#E5E5E5"/>
    <stop offset="0.552885" stopColor="#1070FF"/>
    </linearGradient>
    </defs>
    </svg>
    
    


  ),
  image7: () => (
   <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.5834 43.75V39.5833C39.5834 37.3732 38.7055 35.2536 37.1426 33.6908C35.5798 32.128 33.4602 31.25 31.2501 31.25H18.7501C16.5399 31.25 14.4203 32.128 12.8575 33.6908C11.2947 35.2536 10.4167 37.3732 10.4167 39.5833V43.75M33.3334 14.5833C33.3334 19.1857 29.6025 22.9167 25.0001 22.9167C20.3977 22.9167 16.6668 19.1857 16.6668 14.5833C16.6668 9.98096 20.3977 6.25 25.0001 6.25C29.6025 6.25 33.3334 9.98096 33.3334 14.5833Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
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
  beamSpeed = 6,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const [particleCount, setParticleCount] = useState<number>(200)
  const [forceHover, setForceHover] = useState([false, false, false, false, false]);

  useEffect(() => {
    const updateParticleCount = () => {
      if (window.innerWidth < 640) { 
        setParticleCount(150)
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

  useEffect(() => {
    // Trigger hover for all circles
    setForceHover([true, true, true, true, true]);
    const hoverDuration = 2000; // ms
    const intervalDuration = (beamSpeed ?? 9) * 1000; // ms

    const interval = setInterval(() => {
      setForceHover([true, true, true, true, true]);
      setTimeout(() => setForceHover([false, false, false, false, false]), hoverDuration);
    }, intervalDuration);

    // Initial trigger
    const initialTimeout = setTimeout(() => setForceHover([false, false, false, false, false]), hoverDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [beamSpeed]);

  return (
    <>
      <div
        className={cn(
          "relative flex w-full  mx-auto items-center -translate-y-6 justify-center bg-black overflow-hidden   bg-background",
          "p-4 sm:p-6 md:p-10 md:shadow-xl", 
          className,
        )}
        ref={containerRef}
      >
              <div className='absolute bottom-0 z-[-1] h-[460px] w-screen overflow-hidden  before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#48b6ff90,transparent_90%)] before:opacity-30 after:absolute'>

        <Particles
          className="absolute  inset-0"
          quantity={particleCount}
          ease={30}
         
          size={0.5}
          refresh/>
          </div>
        <div className="flex h-full w-full flex-row items-stretch justify-between max-w-3xl">
          <div className="flex flex-col justify-center gap-10 md:gap-24">
            <Circle Tooltip="Polygon Block Chain" ref={div1Ref} forceHover={forceHover[0]}>{icons.image1()}</Circle>
            <Circle Tooltip='Encrypted File' ref={div2Ref} forceHover={forceHover[1]}>{icons.image2()}</Circle>
            <Circle Tooltip='IPFS' ref={div3Ref} forceHover={forceHover[2]}>{icons.image3()}</Circle>
          </div>
          <div className="flex flex-col justify-center">
            <Circle
            Tooltip='Combine'
              ref={div4Ref}
              className="w-10 h-10 sm:w-12 sm:h-12 md:p-4 md:w-20 md:h-20 "
              forceHover={forceHover[3]}
            >
              {icons.image6()}
            </Circle>
          </div>
          <div className="flex flex-col justify-center">
            <Circle Tooltip='YOU' ref={div5Ref} forceHover={forceHover[4]}>{icons.image7()}</Circle>
          </div>
        </div>
        <BeamAnimation
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={div4Ref}
          duration={beamSpeed}
          gradientStartColor="#FFC300"
          gradientStopColor="#A100FF"
          
        />
        <BeamAnimation
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={div4Ref}
          duration={beamSpeed}
          gradientStartColor="#FFC300"
          gradientStopColor="#A100FF"
          
        />
        <BeamAnimation
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={div4Ref}
          duration={beamSpeed}
          gradientStartColor="#FFC300"
          gradientStopColor="#A100FF"
         
        />
        <BeamAnimation
          containerRef={containerRef}
          fromRef={div4Ref}
          toRef={div5Ref}
          duration={beamSpeed}
          gradientStartColor="#FFC300"
          gradientStopColor="#A100FF"
         
        />
      </div>
    </>
  )
}

export default Diagram;
