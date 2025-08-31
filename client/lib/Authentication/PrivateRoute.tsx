
"use client";

import { useAuth } from "@/lib/Authentication/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/authentication");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <div className='flex flex-col items-center justify-center w-full h-screen'>
        <span className='w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin'/>
        <p className='mt-4 text-gray-600'>Authenticating...</p>
      </div> 
  return <>{children}</>;
}
