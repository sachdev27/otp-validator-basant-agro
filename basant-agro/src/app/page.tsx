"use client";

import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  return <main className="text-center">Welcome to Basant Agro</main>;
}
