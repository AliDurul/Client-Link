import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { StoreProvider } from "./StoreProvider";
import 'react-perfect-scrollbar/dist/css/styles.css';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Client Link Login",
  description: "Client Link Login page",
};

export const experimental_ppr = true

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${inter.className} font-nunito`}>{children}</body>
      </StoreProvider>
    </html>
  );
}
