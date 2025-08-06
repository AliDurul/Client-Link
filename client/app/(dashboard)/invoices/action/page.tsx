import InvoiceForm from '@/components/dashboard/invoice/InvoiceForm';
import KycForm from '@/components/dashboard/kyc/KycForm';
import { getData } from '@/lib/features/shared/actionUtils';
import { Invoice, PageSearchParams } from '@/types'
import React, { Suspense } from 'react'

export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;

    const invoiceId = params.id || '';
    const isEdit = params.s === 'e';

    let invoice: Invoice | null = null;
    let error = null;

    if (isEdit && invoiceId) {
        try {
            const data = await getData(`invoices/${invoiceId}`);
            if (data.success) {
                invoice = data.result;
            } else {
                error = data.message;
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
            error = 'Failed to fetch invoice details';
        }
    }

    return (
        <InvoiceForm invoice={invoice} error={error} />
    )
}
