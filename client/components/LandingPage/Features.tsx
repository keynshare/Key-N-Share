"use client"
import { useEffect, useState, useRef } from 'react'
import PixelCards from './PixelCards'

export default function Features() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    
    if (document.querySelector('script[src="/Animations/pixel.js"]')) {
      setIsScriptLoaded(true)
      return
    }

  
    const script = document.createElement('script')
    script.src = '/Animations/pixel.js'
    script.async = true
    
    script.onload = () => setIsScriptLoaded(true)
    script.onerror = () => console.error('Failed to load pixel canvas script')
    
    document.body.appendChild(script)
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px'
      }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isMounted])

  const cardConfigurations = [
    {
      icon: "M222,40V80a6,6,0,0,1-12,0V46H176a6,6,0,0,1,0-12h40A6,6,0,0,1,222,40ZM80,210H46V176a6,6,0,0,0-12,0v40a6,6,0,0,0,6,6H80a6,6,0,0,0,0-12Zm136-40a6,6,0,0,0-6,6v34H176a6,6,0,0,0,0,12h40a6,6,0,0,0,6-6V176A6,6,0,0,0,216,170ZM40,86a6,6,0,0,0,6-6V46H80a6,6,0,0,0,0-12H40a6,6,0,0,0-6,6V80A6,6,0,0,0,40,86ZM80,74h96a6,6,0,0,1,6,6v96a6,6,0,0,1-6,6H80a6,6,0,0,1-6-6V80A6,6,0,0,1,80,74Zm6,96h84V86H86Z",
      label: "Full Traceability",
      color:"#4287f5",
      canvasProps: { gap: 6, speed: 25,colors: "#4287f5, #5c9bff, #89c2ff",noFocus: true}
    },
    {
      icon: "M188.24,164.24a6,6,0,0,1-8.48,0L158,142.49V208a6,6,0,0,1-12,0V142.49l-21.76,21.75a6,6,0,0,1-8.48-8.48l32-32a6,6,0,0,1,8.48,0l32,32A6,6,0,0,1,188.24,164.24ZM160,42A86.1,86.1,0,0,0,82.43,90.88,62,62,0,1,0,72,214h40a6,6,0,0,0,0-12H72a50,50,0,0,1,0-100,50.68,50.68,0,0,1,5.91.36A85.54,85.54,0,0,0,74,128a6,6,0,0,0,12,0,74,74,0,1,1,103.6,67.85,6,6,0,0,0,4.8,11A86,86,0,0,0,160,42Z",
      label: "Secure Upload",
      color: "#e0f2fe",
      canvasProps: { gap: 6, speed: 25,  colors: "#f3e8ff, #c084fc, #9333ea",noFocus: true }
    },
    {
      icon: "M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42ZM168.56,203.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66,113.09,113.09,0,0,1-25.56-29.45L128,127.32l66.12,46.29A113.09,113.09,0,0,1,168.56,203.06ZM210,112c0,18.75-3.44,35.75-10.28,50.88l-68.28-47.8a6,6,0,0,0-6.88,0l-68.28,47.8C49.44,147.75,46,130.75,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z",
      label: "End to End Encryption",
      color: "#fef08a",
      canvasProps: { gap: 6, speed: 20, colors: "#8DFF58, #2BFF00, #006813",noFocus: true }
    },
    {
      icon: "M221.68,106.08a6,6,0,0,0-4.92,6.91A91.66,91.66,0,0,1,218,128a89.65,89.65,0,0,1-24.49,61.64,77.53,77.53,0,0,0-40-31.38,46,46,0,1,0-51,0,77.53,77.53,0,0,0-40,31.38A89.95,89.95,0,0,1,128,38a91.57,91.57,0,0,1,15,1.24,6,6,0,1,0,2-11.83,101.9,101.9,0,1,0,83.6,83.6A6,6,0,0,0,221.68,106.08ZM94,120a34,34,0,1,1,34,34A34,34,0,0,1,94,120ZM71.44,198a66,66,0,0,1,113.12,0,89.8,89.8,0,0,1-113.12,0ZM236.24,44.24l-32,32a6,6,0,0,1-8.48,0l-16-16a6,6,0,0,1,8.48-8.48L200,63.51l27.76-27.75a6,6,0,0,1,8.48,8.48Z",
      label: "Ownership Protection",
      color: "#fecdd3",
      canvasProps: { gap: 6, speed: 80, colors: "#fecdd3, #e11d48, #e11d48", noFocus: true }
    }
  ]

  return (
    <div ref={sectionRef} className='flex flex-col gap-2 xl:px-12 pt-20 relative'>
     
      <div className={`relative z-10 transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <h2 className="text-xl md:text-3xl lg:text-[42px] text-center font-bold font-bricola mb-4">
          Your Data. Your Rules. Our Technology.
        </h2>   
      </div>

      <main className="m-auto grid min-h-[320px] w-full max-w-5xl grid-cols-1 gap-8 bg-background p-4 dark:bg-background sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {isMounted && isScriptLoaded && cardConfigurations.map((cardConfig,index) => (
         
              <PixelCards 
              key={index}
                icon={cardConfig.icon}
                label={cardConfig.label}
                color={cardConfig.color}
                canvasProps={cardConfig.canvasProps}
              />
         
        ))}
      </main>
    </div>
  )
}


