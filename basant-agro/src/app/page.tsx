"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, FileText, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";

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
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center">
        <CheckCircle2 className="text-green-500 mb-2" size={48} />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
          Verification Successful
        </h1>
        <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
          Access your package details and connect with us
        </p>
        <Button
          className="w-full mb-4 text-base font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: "#2563eb", color: "#fff" }}
        >
          <FileText className="size-5" /> View Package Details (PDF)
        </Button>
        <div className="flex w-full gap-3">
          <Button
            className="w-1/2 bg-green-500 hover:bg-green-600 text-white text-base font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: "#22c55e" }}
          >
            <MessageCircle className="size-5" /> WhatsApp
          </Button>
          <Button
            className="w-1/2 bg-gray-800 hover:bg-gray-900 text-white text-base font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: "#23272f" }}
          >
            <Phone className="size-5" /> Call Us
          </Button>
        </div>
      </div>
    </div>
  );
}
