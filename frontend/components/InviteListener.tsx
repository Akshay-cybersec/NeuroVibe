"use client";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useUser } from "@clerk/nextjs";

export function InviteListener({ onInvite }: { onInvite: (invite: any) => void }) {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const email = user.primaryEmailAddress.emailAddress;

    const unsub = onSnapshot(
      doc(db, "notifications", email),
      (snap) => {
        if (!snap.exists()) return;
        const pending = snap.data().requests?.find((r: any) => r.status === "pending");
        if (pending) onInvite(pending);
      }
    );

    return () => unsub();
  }, [user]);

  return null;
}
