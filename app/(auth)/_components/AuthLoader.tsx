"use client";

import { verifyEmail } from "@/lib/features/auth/authAPI";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AuthLoader = () => {
  const searchParams = useSearchParams();
  const emailToken = searchParams.get("emailToken");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (emailToken) {
      setTimeout(() => {
        (async () => {
          try {
            await verifyEmail(emailToken);
            setIsLoading(false);
          } catch (error: any) {
            setIsLoading(false);
            alert(error.message);
          }
        })();
      }, 500);
    }
  }, [emailToken]);

  return (
    <div>
      {isLoading ? (
        <div>
          <span className="animate-spin border-4 border-success border-l-transparent rounded-full w-20 h-20 inline-block align-middle m-auto mb-3"></span>
          <p className="text-lg">VERIFYING...</p>
        </div>
      ) : (
        <div>
          <h4 className="mb-5 text-xl font-semibold text-primary sm:text-5xl">
            Your Email Verified !
          </h4>
          <button onClick={()=>router.replace('/login')} className="btn btn-primary mx-auto mt-10 w-max">
            You are authorized to login ! 👏🏻
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthLoader;
