"use client";

import { RewardsScreen } from "@/components/screens/rewards-screen";
import { useRouter } from "next/navigation";

export default function RewardsPage() {
  const router = useRouter();
  return <RewardsScreen onBack={() => router.push("/dashboard")} />;
}
