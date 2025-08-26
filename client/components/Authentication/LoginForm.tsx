
"use client";
import React from "react";
import Image from "next/image";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Google from "../assets/Google.svg";
import { useConnect, useAccount, useBalance, useDisconnect } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { Wallet } from "lucide-react";
import WalletGradient from '@/components/assets/Wallet.svg'
type LoginProp={
   isLoginMode?:boolean,
   toggleMode?:()=>void,
}

function LoginForm({isLoginMode,toggleMode}:LoginProp) {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
    chainId: polygonAmoy.id,
  });

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const router = require('next/navigation').useRouter();

  async function handleLogin() {
    if (!email || !password) return;
    try {
      setSubmitting(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');
      // Store token for subsequent requests if needed
      if (data?.token) localStorage.setItem('kns_token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

//take the first connector which has injected
  const connector = connectors[0];

  return (
   <>
   
          <div className={`w-full  transition-opacity duration-500 ${isLoginMode ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-[42px] text-center mb-5 font-bold font-bricola">
             Hey, Welcome Back Login To Key N Share And Get Started
            </h1>

            <div className="flex flex-col px-2 xl:px-4 w-full items-center justify-center gap-4">
              <span className="w-full text-center md:text-left">
                Don&apos;t have an account?{" "}
                <button 
                  onClick={toggleMode}
                  className="text-[#FF7A00] underline underline-offset-2 hover:text-[#ff8c1a] transition-colors"
                >
                  Sign Up
                </button>
              </span>

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

              <div className="flex w-full items-center justify-between">
                <label className="flex items-center gap-2 lg:text-lg">
                  <input
                    className="accent-orange-600 rounded-sm"
                    type="checkbox"
                  />
                  Remember me
                </label>
                <button className="text-[#FF7A00] underline underline-offset-2 hover:text-[#ff8c1a] transition-colors">
                  Forgot Password?
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 w-full items-center justify-center">
                <SecondaryBtn onClick={handleLogin} className="w-full">{submitting ? 'Logging in...' : 'Login'}</SecondaryBtn>
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

export default LoginForm
