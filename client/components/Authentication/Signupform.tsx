"use client";
import React,{useState} from 'react'
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Image from 'next/image';
import Google from "../assets/Google.svg";
import {walletConnection} from "@/lib/Authentication/walletConnection";
import { Wallet } from "lucide-react";
import WalletGradient from '@/components/assets/Wallet.svg';
import {useRouter} from 'next/navigation';
import axios from "axios";
import Cookies from "js-cookie";
import { useNotifications } from "@/lib/notification-context";

type SignupProp={
   isLoginMode?:boolean,
   toggleMode?:(value?:boolean)=>void,
}
function Signupform({isLoginMode,toggleMode}:SignupProp) {

const { isConnected, balance, isPending, connectWallet, disconnectWallet } = walletConnection();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { notify, reportError } = useNotifications();

  async function handleRegister() {
   
    if (!firstName || !email || !password || !confirmPassword || !termsAccepted) return;
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify({ type: "warning", message: "Please enter a valid email address" });
      return;
    }
    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)){
      notify({ type: "warning", message: "Password must be 8+ chars with letters & numbers" });
      return;
    }
    if(password !== confirmPassword){
      notify({ type: "warning", message: "Password and confirm password do not match" });
      return;
    }
    if(!termsAccepted){
      notify({ type: "warning", message: "Please accept the terms and conditions to register" });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/register` || 'http://localhost:4000/api/auth/register', {
        firstName,
        email,
        password,
        confirmPassword,
        termsAccepted,
        remeberMe: false
      });
      
      if (res.data?.token) { 
        Cookies.set("kns_token", res.data.token, { expires: 7 })
        Cookies.set("Email", res.data.user.email, { expires: 7 })
      }
       notify({ type: "success", message: "Registration successful!" });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      reportError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
   
  }

  return (
   <>
   
          <div className={`w-full transition-opacity duration-500 ${isLoginMode ? 'opacity-0 hidden' : 'opacity-100'}`}>
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-[42px] text-center mb-5 font-bold font-bricola">
              Create An Account And Get Started With Key N Share
            </h1>

            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="flex flex-col px-2 xl:px-4 w-full items-center justify-center gap-4">
              <span className="w-full text-center md:text-left">
                Already have an account?{" "}
                <button 
                  onClick={()=>toggleMode && toggleMode(true)}
                  className="text-[#FF7A00] underline underline-offset-2 hover:text-[#ff8c1a] transition-colors"
                >
                  Login
                </button>
              </span>

              <input
                className="w-full bg-gray-200/55 p-3 dark:bg-[#141414] rounded-md"
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                required
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="password"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
              />

               <label className="relative flex-1 items-center justify-start w-full py-4 pl-1 gap-2 max-h-3 flex" >
            <input
              className=" w-fit border p-1 rounded-lg"
              required
              id="t&c"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span >
              I agree with{' '}
              <a href="/terms-and-conditions" target="_blank" className="hover:underline cursor-pointer text-[#ff9900]">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" target="_blank" className="hover:underline cursor-pointer text-[#ff9900]">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* <label className="flex items-center gap-2 lg:text-lg">
            <input
              className="accent-orange-600 rounded-sm"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me for 1 month
          </label> */}

              <div className="flex flex-col lg:flex-row gap-3 w-full items-center justify-center">
                <SecondaryBtn Type="submit" className="w-full">{submitting ? 'Creating Account...' : 'Create Account'}</SecondaryBtn>
                <SecondaryBtn className="w-full bg-slate-200 dark:bg-[#1f1f1f] dark:hover:bg-[#333333] dark:!text-white !text-black hover:bg-slate-300/95">
                  <Image src={Google} className="w-5" alt="google logo" />
                  Continue with Google
                </SecondaryBtn>
              </div>

              <span className="text-[#A1A1A1] font-medium gap-2 w-full flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#A1A1A1]"></div>
                <span className="whitespace-nowrap">Setup your wallet</span>
                <div className="w-full h-[1px] bg-[#A1A1A1]"></div>
              </span>

              <div className="flex flex-col lg:flex-row gap-3 w-full items-center justify-center">
                 <PrimaryBtn
              onClick={connectWallet}
              disabled={isPending}
              sparkelClass="hidden " className="w-full"

              Hovered={isConnected}
            >
             {!isConnected ? <Wallet size={22}/> : <Image src={WalletGradient} width={24} alt="wallet svg" />} {isConnected ? balance : "Connect Wallet"}  
            </PrimaryBtn>
        
           <SecondaryBtn
                onClick={disconnectWallet}
                className="w-full bg-gray-200 !text-black dark:!text-white dark:hover:!text-black dark:hover:bg-gray-400 hover:!text-white hover:bg-[#c2c2c2] dark:bg-[#3f3f3f]"
              >
                Disconnect Wallet
              </SecondaryBtn>
              </div>
            </form>
          </div>
   
   </>
  )
}

export default Signupform
