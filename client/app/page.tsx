import Image from "next/image";
import styles from "./page.module.css";
import HeroSection from '@/components/LandingPage/HeroSection'
import Tutorial from '@/components/LandingPage/Tutorial'
import Footer from '../components/SharedComponents/Footer'
export default function Home() {
  return (
  
         <>
         <HeroSection/>
         <Tutorial/>
         <Footer/>
         </>
  );
}
