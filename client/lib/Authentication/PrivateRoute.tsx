"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/authentication");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen'>
        <span className='w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin'/>
        <p className='mt-4 text-gray-600'>Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>; 
};

export default PrivateRoute;
