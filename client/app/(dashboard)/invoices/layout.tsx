import TopPageNavigation from '@/components/shared/TopPageNavigation';
import React, { ReactNode } from 'react'

interface Props {
    readonly children: ReactNode;
}

export default function InvoiceLayout({ children }: Props) {
    return (
        <>
            <TopPageNavigation />

            {children}
        </>
    )
}
