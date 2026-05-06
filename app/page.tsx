"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import DesktopShell from "@/components/os/DesktopShell";
import MobilePortfolio from "@/components/mobile/MobilePortfolio";
import BootScreen from "@/components/os/BootScreen";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [booted, setBooted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    // Always show boot screen on every page load / refresh
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return isMobile ? <MobilePortfolio /> : <DesktopShell />;
}
