import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import { Nunito } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
import { SessionToast } from "@/components/auth/SessionToast";
import { Suspense } from "react";
// import 'react-perfect-scrollbar/dist/css/styles.css';
import "./globals.css";


const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Client Link Login",
  description: "Client Link Login page",
};

export const experimental_ppr = true

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">

      <StoreProvider>
        <body className={`${nunito.variable} font-nunito`}>
          {children}
          <Suspense >
            <SessionToast />
            <Toaster />
          </Suspense>
        </body>
      </StoreProvider>
    </html>
  );
}
