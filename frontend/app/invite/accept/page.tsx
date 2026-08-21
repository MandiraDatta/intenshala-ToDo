"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { inviteService } from "@/services/invite.service";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth.service";
import { CheckCircle2, AlertCircle, Building, Loader2 } from "lucide-react";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { refreshWorkspaces, setActiveWorkspace } = useWorkspace();
  const { user, refreshUser } = useUser();

  const handleLogout = async () => {
    authService.logout();
    await refreshUser();
    router.push("/");
  };

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  const autoAccept = searchParams.get("autoAccept");
  const [hasAutoAccepted, setHasAutoAccepted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided.");
      setLoading(false);
      return;
    }

    inviteService
      .getInvite(token)
      .then((data) => {
        setInviteData(data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Invalid or expired invitation token.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);
    try {
      const res = await inviteService.acceptInvite(token);
      setSuccess(true);
      if (res.workspace?.id) {
        localStorage.setItem("active_workspace_id", res.workspace.id);
      }
      await refreshWorkspaces();
      setTimeout(() => {
        if (inviteData?.projectId) {
          router.push(`/dashboard?projectId=${inviteData.projectId}`);
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  useEffect(() => {
    if (autoAccept === "true" && user && inviteData && !hasAutoAccepted && !loading) {
      const targetEmail = (inviteData?.email || "").toLowerCase().trim();
      const userEmail = (user?.email || "").toLowerCase().trim();
      const username = (user?.username || "").toLowerCase().trim();

      const isMatch =
        !targetEmail ||
        userEmail === targetEmail ||
        username === targetEmail ||
        userEmail.includes(targetEmail) ||
        targetEmail.includes(userEmail);

      if (isMatch) {
        setHasAutoAccepted(true);
        handleAccept();
      }
    }
  }, [autoAccept, user, inviteData, hasAutoAccepted, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-medium">Validating invitation link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#171717] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl shadow-xl p-6 flex flex-col items-center text-center gap-5">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Building className="w-6 h-6" />
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-[#171717] dark:text-[#F5F5F5]">
              Invitation Error
            </h1>
            <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-base font-bold text-[#171717] dark:text-[#F5F5F5]">
              Welcome to {inviteData?.workspace?.name}!
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Redirecting you to your dashboard...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-base font-bold text-[#171717] dark:text-[#F5F5F5]">
              Workspace Invitation
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] max-w-xs">
              <strong>{inviteData?.invitedBy?.fullName || inviteData?.invitedBy?.username}</strong> invited you to join <strong>{inviteData?.workspace?.name}</strong>.
            </p>

            <div className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#333333] rounded-xl p-3 my-2 flex items-center justify-between text-xs">
              <span className="text-[#737373] dark:text-[#A3A3A3]">Workspace:</span>
              <span className="font-semibold text-[#171717] dark:text-[#F5F5F5]">
                {inviteData?.workspace?.name}
              </span>
            </div>

            {user ? (
              <div className="w-full mt-2 flex flex-col gap-3">
                <div className="text-[11px] bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/50 text-left">
                  You are currently logged in as <strong>{user.email}</strong>. 
                  {inviteData?.email && user.email !== inviteData.email && (
                    <span className="text-amber-600 dark:text-amber-500 block mt-1 font-medium">
                      Note: This invite was sent to {inviteData.email}. Make sure you want to accept with your current account.
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full py-2.5 bg-[#171717] dark:bg-[#F5F5F5] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining Workspace...</span>
                    </>
                  ) : (
                    <span>Accept as {user.fullName || user.username}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Log out and switch account
                </button>
              </div>
            ) : (
              <div className="w-full mt-2 flex flex-col gap-3">
                <div className="text-[11px] bg-neutral-100 dark:bg-[#262626] text-neutral-600 dark:text-neutral-400 p-2.5 rounded-lg text-left">
                  You need to be logged in to accept this invitation.
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/?redirect=${encodeURIComponent(`/invite/accept?token=${token}&autoAccept=true`)}`)}
                  className="w-full py-2.5 bg-[#171717] dark:bg-[#F5F5F5] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Log in or Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}
