import { ReactNode } from 'react'
import { SessionProvider } from "next-auth/react";
import DefaultLayout from '@/components/layout/DefaultLayout';


interface Props {
  readonly children: ReactNode;
}

export default async function layout({ children }: Props) {
  return (
    <SessionProvider >
      <DefaultLayout>{children}</DefaultLayout>
    </SessionProvider>
  )
}
