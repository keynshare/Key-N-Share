
"use client"

import React from 'react'
import { motion } from 'framer-motion'

// Define TypeScript interfaces for better type safety
interface PixelCanvasProps {
  gap?: number
  speed?: number
  colors?: string
  noFocus?: boolean
}

interface CardProps {
  icon: string
  label: string
  color: string
  canvasProps?: PixelCanvasProps
}


declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pixel-canvas': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}


const PixelCanvas: React.FC<PixelCanvasProps> = ({ 
  gap = 5, 
  speed = 30, 
  colors = "#e0f2fe, #7dd3fc, #0ea5e9", 
  noFocus = false 
}) => {
  return (
    <pixel-canvas 
      data-gap={gap} 
      data-speed={speed} 
      data-colors={colors}
      {...(noFocus ? { "data-no-focus": "" } : {})}
      className="absolute inset-0 size-full"
      style={{ position: 'absolute', width: '100%', height: '100%' }}
    />
  )
}

const PixelCards: React.FC<CardProps> = ({ 
  icon, 
  label, 
  color, 
  canvasProps = {} 
}) => {
  const hoverTransition = { 
    duration: 0.8, 
    ease: [0.5, 1, 0.89, 1] 
  }

  return (
    <div className='flex flex-col w-full gap-4 items-center justify-center'>
    <motion.div 
      className="light:border-gray-900 relative dark:border-gray-900 w-full group  isolate grid aspect-[4/5] select-none place-items-center overflow-hidden rounded-xl border transition-all duration-200 hover:text-black dark:hover:text-white sm:aspect-square md:aspect-[4/4]"
    >
      <PixelCanvas {...canvasProps} />
      
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,transparent_55%,#ffffff)] shadow-[-0.5cqi_0.5cqi_2.5cqi_inset_#f3f4f6] dark:bg-[radial-gradient(circle_at_bottom_left,transparent_55%,#101012)] dark:shadow-[-0.5cqi_0.5cqi_2.5cqi_inset_#09090b]"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0 }}
        transition={hoverTransition}
      />
      
      <motion.div
        className="absolute inset-0 m-auto w-38 aspect-square bg-[radial-gradient(circle,#f3f4f6,transparent_65%)] dark:bg-[radial-gradient(circle,#09090b,transparent_65%)]"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={hoverTransition}
      />
      
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 256 256"
        className="ease-[cubic-bezier(0.5,1,0.89,1)] relative z-10 h-auto w-[30%] text-gray-600 transition-all duration-300 group-hover:text-black dark:text-[#adadad] dark:group-hover:text-white sm:w-[40%] md:w-[35%] lg:w-[30%]"
        whileHover={{ 
          scale: 1.1,
          transition: hoverTransition 
        }}
      >
        <path d={icon} fill="currentColor" />
      </motion.svg>
      
      <span className="sr-only">{label}</span>
      
      
    </motion.div>
    <span className=" font-bricola font-bold text-center w-full whitespace-nowrap xl:text-xl   sm:text-base md:text-lg">
        {label}
      </span>
    </div>
  )
}

export default PixelCards;

