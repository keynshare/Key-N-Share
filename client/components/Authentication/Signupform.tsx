import React from 'react'
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Image from 'next/image';
import Google from "../assets/Google.svg";
import { useConnect, useAccount, useBalance, useDisconnect } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { Wallet } from "lucide-react";
import WalletGradient from '@/components/assets/Wallet.svg'

type SignupProp={
   isLoginMode?:boolean,
   toggleMode?:()=>void,
}
function Signupform({isLoginMode,toggleMode}:SignupProp) {

 const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: polygonAmoy.id,
  });

//take the first connector
  const connector = connectors[0];

  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const router = require('next/navigation').useRouter();

  async function handleRegister() {
    if (!firstName || !email || !password || password !== confirmPassword) {
      alert('Please fill all fields and ensure passwords match');
      return;
    }

    if (!termsAccepted) {
      alert('You must accept the terms and conditions to register');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/register` || 'http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          email, 
          password, 
          termsAccepted, 
          rememberMe 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Registration failed');
      if (data?.token) localStorage.setItem('kns_token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
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

            <div className="flex flex-col px-2 xl:px-4 w-full items-center justify-center gap-4">
              <span className="w-full text-center md:text-left">
                Already have an account?{" "}
                <button 
                  onClick={toggleMode}
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
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="password"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
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

          <label className="flex items-center gap-2 lg:text-lg">
            <input
              className="accent-orange-600 rounded-sm"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me for 1 month
          </label>

              <div className="flex flex-col lg:flex-row gap-3 w-full items-center justify-center">
                <SecondaryBtn onClick={handleRegister} className="w-full">{submitting ? 'Creating Account...' : 'Create Account'}</SecondaryBtn>
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
              onClick={() => connector && connect({ connector })}
              disabled={isPending}
              sparkelClass="hidden " className="w-full"

              Hovered={isConnected}
            >
             {!isConnected ? <Wallet size={22}/> : <Image src={WalletGradient} width={24} alt="wallet svg" />} {isConnected ? balance?.formatted : "Connect Wallet"}  
            </PrimaryBtn>
        
           <SecondaryBtn
                onClick={() => disconnect()}
                className="w-full bg-gray-200 !text-black dark:!text-white dark:hover:!text-black dark:hover:bg-gray-400 hover:!text-white hover:bg-[#c2c2c2] dark:bg-[#3f3f3f]"
              >
                Disconnect Wallet
              </SecondaryBtn>
              </div>
            </div>
          </div>
   
   </>
  )
}

export default Signupform
