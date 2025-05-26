"use client"

import { Web3Provider } from "@/components/web3-provider";
import { XMTPProvider } from "@/context/xmtp-context";
import { UserProvider } from "@/context/user-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { DarkModeStyles } from "@/components/dark-mode-styles";
import { ToastProvider } from "@/components/ui/toast";
import { useEffect, useState } from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show a simple layout during hydration
    return (
      <>
        <DarkModeStyles />
        <div className="flex min-h-screen flex-col">
          <div className="h-16 border-b"></div> {/* Navbar placeholder */}
          <main className="flex-1">{children}</main>
          <div className="h-16 border-t"></div> {/* Footer placeholder */}
        </div>
      </>
    );
  }

  return (
    <>
      <DarkModeStyles />
      <ToastProvider>
        <Web3Provider>
          <XMTPProvider>
            <UserProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </UserProvider>
          </XMTPProvider>
        </Web3Provider>
      </ToastProvider>
    </>
  );
}
