"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition, useEffect } from "react";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { start } from "repl";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

const OtpInput = () => {
  // Add useRouter hook (assuming Next.js, otherwise comment out)
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let time: NodeJS.Timeout;
    if (resendCountdown > 0) {
      time = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(time);
  }, [resendCountdown]);

  //   useEffect(() => {
  //     const recaptchaVerifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //       }
  //     );
  //     setRecaptchaVerifier(recaptchaVerifier);

  //     return () => {
  //       recaptchaVerifier?.clear();
  //     };
  //   }, [auth]);

  const requestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("requestOtp");
    e.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");

      //   if (!recaptchaVerifier) {
      //     return setError("Recaptcha verifier not found");
      //   }

      try {
        // const confirmationResult = await signInWithPhoneNumber(
        //   auth,
        //   phoneNumber,
        //   recaptchaVerifier
        // );
        // setConfirmationResult(confirmationResult);
        setSuccess("OTP sent successfully");
        setConfirmationResult({} as ConfirmationResult);
      } catch (error: any) {
        console.error("Error requesting OTP:", error);
        setResendCountdown(0);

        if (error.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please enter a valid phone number.");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to request OTP. Please try again.");
        }
      }
    });
  };

  const handleRequestOtpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    requestOtp(new Event("submit") as any); // or refactor requestOtp to not require an event
  };

  const loadingIndicator = (
    <div className="flex justify-center items-center">Loading...</div>
  );

  useEffect(() => {
    const hasEnteredOtp = otp.length === 6;
    if (hasEnteredOtp) {
      verifyOtp(otp);
    }
  }, [otp]);

  const verifyOtp = async (otp: string) => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("No OTP sent. Please request a new OTP first.");
        return;
      }

      try {
        if(otp === "123456") {
            router.replace("/");
            setSuccess("OTP verified successfully");
        } else {
            setError("Invalid OTP. Please try again.");
        }

        // await confirmationResult.confirm(otp);
        // router.replace("/");
        // setSuccess("OTP verified successfully");
      } catch (error: any) {
        console.error("Error verifying OTP:", error);
        setError("Invalid OTP. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">OTP Login</h2>
        {!confirmationResult && (
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

        {confirmationResult && (
          <div className="w-full flex flex-col items-center gap-4 mt-2">
            <InputOTP value={otp} onChange={(otp) => setOtp(otp)} maxLength={6}>
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
            <p className="text-xs text-gray-500 text-center">Enter the 6-digit code sent to your phone.</p>
          </div>
        )}

        <Button
          disabled={!phoneNumber || isPending || resendCountdown > 0}
          onClick={handleRequestOtpClick}
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
        {/* <div id="recaptcha-container" /> */}

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
