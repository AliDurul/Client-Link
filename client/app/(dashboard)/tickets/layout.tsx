import TopPageNavigation from '@/components/shared/TopPageNavigation'
import React from 'react'

export default function TicketLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopPageNavigation />
            {children}
        </>
    )
}
