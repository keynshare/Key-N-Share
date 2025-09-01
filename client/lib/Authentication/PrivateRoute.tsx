"use client";

import { useAuth } from "@/lib/Authentication/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;

    if (pathname === "/authentication" && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    if (!isAuthenticated && pathname !== "/authentication") {
      router.replace("/authentication");
    }
  }, [isAuthenticated, isInitialized, router, pathname]);

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen'>
        <span className='w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin'/>
        <p className='mt-4 text-gray-600'>Authenticating...</p>
      </div>
    );
  }

  return <>{children}</>;
}
