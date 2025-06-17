"use client";

import { SessionProvider } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function CartPersistence() {
  const { data: session, status } = useSession();
  const loadFromDatabase = useCartStore((state) => state.loadFromDatabase);

  useEffect(() => {
    if (session?.user && status === "authenticated") {
      loadFromDatabase();
    }
  }, [session, status, loadFromDatabase]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartPersistence />
      {children}
    </SessionProvider>
  );
}
