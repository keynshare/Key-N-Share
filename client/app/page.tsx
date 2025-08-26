
import HeroSection from '@/components/LandingPage/HeroSection'
import Tutorial from '@/components/LandingPage/Tutorial'
import FAQSection  from '@/components/SharedComponents/FAQ/FAQSection'
import { faqData } from '@/components/SharedComponents/FAQ/FAQData'
import Features from '@/components/LandingPage/Features'
export default function Home() {
  return (
  
         <>
        
         <HeroSection/>
         <Features/>
         <Tutorial/>
       
         <FAQSection 
           faqs={faqData}
         />
        
         </>
  );
}
