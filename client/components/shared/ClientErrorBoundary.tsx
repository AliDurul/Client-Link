'use client';

import { Component, ReactNode } from 'react';
// import { Alert, Button, Stack, Text } from '@mantine/core';
// import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ClientErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('KYC Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex h-full items-center justify-center p-4">
                    Failed to load KYC data. Please try refreshing the page.
                </div>
            );
        }

        return this.props.children;
    }
}