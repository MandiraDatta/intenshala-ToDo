"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBrandPrisma } from "@tabler/icons-react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setIsLoading("google");
    setTimeout(() => {
      setIsLoading(null);
      router.push("/dashboard");
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsLoading("guest");
    setTimeout(() => {
      setIsLoading(null);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <main className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-center gap-6 p-10 sm:p-8 select-none">
      {/* 1. Flex Container (Top Header) */}
      <div className="flex items-center justify-center w-full max-w-[1200px] h-[24px] gap-[8px] select-none">
        <div className="p-[10px] rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
          <IconBrandPrisma className="w-6 h-6" />
        </div>
        <span className="font-bold text-gray-900 text-2xl tracking-tight">
          Pyramid
        </span>
      </div>

      {/* 2. Div Container (Middle Login Card) */}
      <div className="w-full max-w-[440px] bg-white rounded-3xl border border-neutral-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.012)] p-8 sm:p-10 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-[26px] font-bold text-neutral-900 tracking-tight mb-2">
          Let's get back on track
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-8 max-w-[290px] leading-relaxed">
          Enter your email below to login to your account.
        </p>

        {/* Action Buttons Container */}
        <div className="w-full flex flex-col gap-3">
          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading !== null}
            className="w-full py-3.5 px-6 bg-[#18181b] hover:bg-black text-white font-semibold text-sm rounded-full transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading === "guest" ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            Continue as Guest
          </button>

          {/* Login with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading !== null}
            className="w-full py-3.5 px-6 bg-white hover:bg-[#fafafa] border border-neutral-200 text-neutral-800 font-semibold text-sm rounded-full transition-all duration-150 shadow-xs hover:border-neutral-300 active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <svg className="animate-spin h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              /* Google Logo SVG */
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Login with Google
          </button>
        </div>
      </div>

      {/* 3. Flex Container (Bottom Footer) */}
      <div className="flex items-center justify-center w-full max-w-[1200px] select-none">
        <p className="text-center text-[11px] sm:text-xs text-neutral-400 max-w-[280px] leading-normal">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-neutral-600 transition-colors duration-150"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}