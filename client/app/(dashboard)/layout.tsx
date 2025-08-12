import { ReactNode } from 'react'
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import DefaultLayout from '@/components/layout/DefaultLayout';


interface Props {
  readonly children: ReactNode;
}

export default async function layout({ children }: Props) {

  return (
    <SessionProvider>
      {/* <ContextProvider> */}
      <DefaultLayout>{children}</DefaultLayout>
      {/* </ContextProvider> */}
    </SessionProvider>
  )
}
