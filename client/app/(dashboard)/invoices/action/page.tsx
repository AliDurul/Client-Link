import InvoiceForm from '@/components/dashboard/invoice/InvoiceForm';
import KycForm from '@/components/dashboard/kyc/KycForm';
import { getData } from '@/lib/features/shared/actionUtils';
import { Invoice, PageSearchParams } from '@/types'
import React, { Suspense } from 'react'
import { success } from 'zod';

export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;

    const invoiceId = params.id || '';
    const isEdit = params.s === 'e';



    const [invoiceResult, customersResult, productsResult] = await Promise.all([
        isEdit && invoiceId ? getData(`invoices/${invoiceId}`) : Promise.resolve({ success: true, result: null }),
        getData('customers'),
        getData('products')
    ])


    const invoice = invoiceResult.success ? invoiceResult.result : null;
    const customers = customersResult.success ? customersResult.result : [];
    const products = productsResult.success ? productsResult.result : [];

    const error = !invoiceResult.success ? invoiceResult.message :
        !customersResult.success ? 'Failed to fetch customers' :
            !productsResult.success ? 'Failed to fetch products' : null;


    return (
        <InvoiceForm
            invoice={invoice}
            customers={customers}
            products={products}
            isEdit={isEdit}
            error={error}
        />
    )
}
