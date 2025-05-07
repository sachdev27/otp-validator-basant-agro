"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient"; // adjust path .s needed
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

const OtpInput = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        router.replace("/");
      } else {
        router.replace("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    let time: NodeJS.Timeout;
    if (resendCountdown > 0) {
      time = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(time);
  }, [resendCountdown]);

  const requestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setResendCountdown(60);
    setError("");
    setSuccess("");
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (error) {
        setError(error.message);
        setResendCountdown(0);
      } else {
        setOtpSent(true);
        setSuccess("OTP sent successfully");
      }
    });
  };

  useEffect(() => {
    if (otp.length === 6) verifyOtp();
  }, [otp]);

  const verifyOtp = async () => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });
      if (error) {
        setError("Invalid OTP. Please try again.");
      } else {
        setSuccess("OTP verified successfully");
        router.replace("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">OTP Login</h2>
        { !otpSent && (
          <form onSubmit={requestOtp} className="w-full flex flex-col items-center gap-2">
            <Input
              className="text-black w-full text-center py-3 text-lg rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="Enter your phone number"
              value={phoneNumber}
              type="tel"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Please enter your phone number to receive a verification code.
            </p>
          </form>
        )}
        { otpSent && (
          <InputOTP value={otp} onChange={setOtp} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        )}
        <Button
          disabled={!phoneNumber || isPending || resendCountdown > 0}
          onClick={requestOtp}
          className="mt-6 w-full py-3 text-lg rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold disabled:bg-gray-300 disabled:text-gray-500"
        >
          {resendCountdown > 0
            ? `Resend OTP in ${resendCountdown}`
            : isPending
            ? "Sending..."
            : "Send OTP"}
        </Button>
        <div className="text-center w-full mt-4 min-h-[24px]">
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
        </div>
        {isPending && (
          <div className="flex justify-center items-center mt-4">
            <span className="loader border-2 border-indigo-600 border-t-transparent rounded-full w-6 h-6 animate-spin"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
