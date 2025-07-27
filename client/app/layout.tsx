import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
import 'react-perfect-scrollbar/dist/css/styles.css';
import "./globals.css";
import { SessionToast } from "@/components/auth/SessionToast";

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
          <SessionToast />
        </body>
      </StoreProvider>
    </html>
  );
}
