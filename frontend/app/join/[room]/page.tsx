"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JoinRoom({ params }: any) {
  const router = useRouter();
  const roomCode = params.room.toUpperCase();

  useEffect(() => {
    router.push(`/dashboard?room=${roomCode}&role=receiver`);
  }, []);

  return null;
}
