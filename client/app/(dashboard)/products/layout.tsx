import TopPageNavigation from '@/components/shared/TopPageNavigation'
import React from 'react'

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <TopPageNavigation />
            {children}
        </div>
    )
}
