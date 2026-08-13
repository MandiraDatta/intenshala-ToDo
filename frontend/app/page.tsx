"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBrandPrisma } from "@tabler/icons-react";
import { RiGoogleFill } from "@remixicon/react";

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
    <main className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-center gap-[2.5rem] p-10 sm:p-8 select-none">
      {/* 1. Flex Container (Top Header) */}
      <div className="flex items-center justify-center w-full max-w-[75rem] h-[1.5rem] gap-[0.5rem] select-none">
        <div className="p-[0.25rem] rounded-md bg-black text-white flex items-center justify-center shadow-sm">
          <IconBrandPrisma className="w-[1rem] h-[1rem] opacity-100 rotate-0" />
        </div>
        <span className="font-semibold text-gray-900 text-sm tracking-normal">
          Pyramid
        </span>
      </div>

      {/* 2. Div Container (Middle Login Card) */}
      <div className="w-[24rem] h-[12.625rem] bg-white rounded-[2rem] border border-neutral-100/90 shadow-[0_0.5rem_1.875rem_rgb(0,0,0,0.012)] gap-[1.5rem] flex flex-col items-center text-center">
      <div className="w-[21rem] h-[2.8rem] pt-[0.8rem] flex flex-col items-center">
        <h1 className="text-2xl sm:text-[1.625rem] font-bold text-neutral-900 tracking-tight ">
          Let's get back on track
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500  leading-relaxed">
          Enter your email below to login to your account.
        </p>
        </div>

        {/* Action Buttons Container */}
        <div className="w-[21rem] flex flex-col gap-[0.7rem] p-7 items-center">
          {/* Continue as Guest Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading !== null}
            className="w-[21rem] h-[2.25rem] py-[0.5rem] px-[0.75rem] bg-[#171717] hover:bg-black text-white font-semibold text-sm rounded-full transition-all duration-150 shadow-sm active:scale-[0.99] flex items-center justify-center gap-[0.375rem] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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
            className="w-[21rem] h-[2.25rem] py-[0.5rem] px-[0.75rem] bg-white hover:bg-[#fafafa] border border-neutral-200 text-neutral-800 font-semibold text-sm rounded-full transition-all duration-150 shadow-xs hover:border-neutral-300 active:scale-[0.99] flex items-center justify-center gap-[0.375rem] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading === "google" ? (
              <svg className="animate-spin h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              /* Remix Icon / google-fill */
              <RiGoogleFill className="w-[1rem] h-[1rem] opacity-100 rotate-0" />
            )}
            Login with Google
          </button>
        </div>
      </div>

      {/* 3. Flex Container (Bottom Footer) */}
      <div className="flex items-center justify-center w-[24rem] h-[3rem] select-none">
        <p className="text-center text-[0.6875rem] sm:text-xs text-neutral-400 w-[13rem] h-[3rem] leading-normal">
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