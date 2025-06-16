import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

export const metadata: Metadata = { title: "Verify Email", description: "Verify Email" };

const AuthLoader = dynamic(() => import("@/app/(auth)/_components/AuthLoader"), {
  ssr: false,
});

const VerifyEmailPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/assets/images/map.svg')] bg-cover bg-center dark:bg-[url('/assets/images/map-dark.svg')]">
      <div className="p-5 text-center font-semibold">
        <AuthLoader />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
