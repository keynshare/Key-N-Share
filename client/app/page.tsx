
import HeroSection from '@/components/LandingPage/HeroSection'
import Tutorial from '@/components/LandingPage/Tutorial'
import Footer from '../components/SharedComponents/Footer'
import FAQSection  from '@/components/SharedComponents/FAQ/FAQSection'
import { faqData } from '@/components/SharedComponents/FAQ/FAQData'
export default function Home() {
  return (
  
         <>
         <HeroSection/>
         <Tutorial/>
         <FAQSection 
           faqs={faqData}
         />
         <Footer/>
         </>
  );
}
