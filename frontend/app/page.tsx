"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBrandPrisma } from "@tabler/icons-react";
import { RiGoogleFill } from "@remixicon/react";
import { authService } from "@/services/auth.service";
import { useUser } from "@/context/UserContext";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function Home() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const { refreshWorkspaces } = useWorkspace();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<"guest" | "email">("guest");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGuestLogin = async () => {
    setIsLoading("guest");
    setErrorMsg("");
    try {
      // Register or login guest user in NestJS backend
      const guestEmail = `guest_${Math.floor(Math.random() * 10000)}@pyramid.app`;
      const res = await authService.register({
        email: guestEmail,
        password: "GuestPassword123!",
        fullName: "Guest User",
        username: `guest_${Math.floor(Math.random() * 10000)}`,
      });
      await refreshUser();
      await refreshWorkspaces();
      router.push("/dashboard");
    } catch (e: any) {
      // If registration fails, fallback to demo login
      try {
        await authService.login({
          email: "demo@pyramid.app",
          password: "DemoPassword123!",
        });
        await refreshUser();
        await refreshWorkspaces();
        router.push("/dashboard");
      } catch (loginErr: any) {
        setErrorMsg("Failed to initialize session with server.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading("email");
    setErrorMsg("");
    try {
      if (isRegister) {
        await authService.register({
          email,
          password,
          fullName: fullName || email.split("@")[0],
          username: email.split("@")[0],
        });
      } else {
        await authService.login({ email, password });
      }
      await refreshUser();
      await refreshWorkspaces();
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Authentication failed. Check your credentials.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-center gap-[2rem] p-6 sm:p-8 select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-center w-full max-w-[75rem] h-[1.5rem] gap-[0.5rem] select-none">
        <div className="p-[0.25rem] rounded-md bg-black text-white flex items-center justify-center shadow-sm">
          <IconBrandPrisma className="w-[1rem] h-[1rem] opacity-100 rotate-0" />
        </div>
        <span className="font-semibold text-gray-900 text-sm tracking-normal">
          Pyramid
        </span>
      </div>

      {/* 2. Middle Login Card */}
      <div className="w-[24rem] min-h-[14rem] bg-white rounded-[2rem] border border-neutral-100/90 shadow-[0_0.5rem_1.875rem_rgb(0,0,0,0.012)] p-7 flex flex-col items-center text-center gap-4">
        <div className="w-full flex flex-col items-center">
          <h1 className="text-xl sm:text-[1.5rem] font-bold text-neutral-900 tracking-tight">
            {isRegister ? "Create an Account" : "Let's get back on track"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
            {isRegister ? "Sign up to start organizing projects." : "Enter your email below to log in."}
          </p>
        </div>

        {errorMsg && (
          <div className="w-full p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {mode === "email" ? (
          <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-2.5">
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-[2.25rem] px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none focus:border-black"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[2.25rem] px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none focus:border-black"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[2.25rem] px-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={isLoading !== null}
              className="w-full h-[2.25rem] bg-[#171717] hover:bg-black text-white font-semibold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading === "email" && (
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>{isRegister ? "Sign Up" : "Log In"}</span>
            </button>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="underline hover:text-neutral-800 cursor-pointer"
              >
                {isRegister ? "Already have an account? Log In" : "Need an account? Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setMode("guest")}
                className="underline hover:text-neutral-800 cursor-pointer"
              >
                Back to options
              </button>
            </div>
          </form>
        ) : (
          /* Action Buttons Container */
          <div className="w-full flex flex-col gap-2.5 items-center">
            {/* Continue as Guest Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading !== null}
              className="w-full h-[2.25rem] px-[0.75rem] bg-[#171717] hover:bg-black text-white font-semibold text-xs rounded-full transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading === "guest" && (
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span>Continue as Guest</span>
            </button>

            {/* Login with Email Button */}
            <button
              type="button"
              onClick={() => setMode("email")}
              disabled={isLoading !== null}
              className="w-full h-[2.25rem] px-[0.75rem] bg-white hover:bg-[#fafafa] border border-neutral-200 text-neutral-800 font-semibold text-xs rounded-full transition-all shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RiGoogleFill className="w-[1rem] h-[1rem]" />
              <span>Login with Email / Password</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Footer */}
      <div className="flex items-center justify-center w-[24rem] select-none">
        <p className="text-center text-[0.6875rem] sm:text-xs text-neutral-400 leading-normal">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2 hover:text-neutral-600 transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}