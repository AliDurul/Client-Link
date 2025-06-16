import React, { ReactNode } from 'react'

interface Props {
    readonly children: ReactNode;
}

export default function CoparateLayout({ children }: Props) {
    return (
        <div>{children}</div>
    )
}
