import { Suspense } from "react";
import Home from "../page";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFCFD] dark:bg-[#0A0A0A]" />}>
      <Home />
    </Suspense>
  );
}
