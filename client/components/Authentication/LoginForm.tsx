
import Image from "next/image";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import Google from "../assets/Google.svg";

type LoginProp={
   isLoginMode?:boolean,
   toggleMode?:()=>void,
}

function LoginForm({isLoginMode,toggleMode}:LoginProp) {
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
              />
              <input
                className="w-full bg-gray-200/55 dark:bg-[#141414] p-3 rounded-md"
                type="password"
                placeholder="Enter Password"
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
                <SecondaryBtn className="w-full">Login</SecondaryBtn>
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
                <PrimaryBtn sparkelClass="hidden " className="w-full">
                  Connect Wallet
                </PrimaryBtn>
                <SecondaryBtn className="w-full lg:w-[92%] bg-gray-200 dark:bg-[#3f3f3f] dark:hover:bg-[#575757] dark:!text-white !text-black hover:bg-slate-300/95">
                  Disconnect Wallet
                </SecondaryBtn>
              </div>
            </div>
          </div>

   </>
  )
}

export default LoginForm
