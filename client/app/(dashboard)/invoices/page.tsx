import InvoiceTable from '@/components/dashboard/invoice/InvoiceTable';
import TopPageNavigation from '@/components/shared/TopPageNavigation';
import { getAllData } from '@/lib/features/shared/actionUtils';
import { PageSearchParams } from '@/types'
import React, { Suspense } from 'react'

export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;
    const query = params.q || '';
    const page = params.p || '1';
    const limit = params.pl || '20';
    const sortBy = params.sb || 'first_name';
    const sort = params.s || 'asc';

    const invoicePromise = getAllData({
        url: 'invoices/',
        searchQueries: { 'customer.first_name': query },
        customQuery: { page, limit },
        sortQueries: { [sortBy]: sort }
    });

    return (
        <>

            <div className="panel mt-5 border-white-light px-0 dark:border-[#1b2e4b]">

                {/* <ClientErrorBoundary> */}
                <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                    <InvoiceTable invoicePromise={invoicePromise} />
                </Suspense>
                {/* </ClientErrorBoundary> */}
            </div>

        </>
    )
}
