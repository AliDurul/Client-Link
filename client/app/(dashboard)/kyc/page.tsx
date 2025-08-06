import KycHeaderBtns from "@/components/dashboard/kyc/KycHeaderBtns";
import KycTable from "@/components/dashboard/kyc/KycTable";
import { ClientErrorBoundary } from "@/components/shared/ClientErrorBoundary";
import TopPageNavigation from "@/components/shared/TopPageNavigation";
import { getAllData } from "@/lib/features/shared/actionUtils";
import { PageSearchParams } from "@/types";
import { Suspense } from "react";



export default async function page({ searchParams }: PageSearchParams) {


    const params = await searchParams;
    const query = params.q || '';
    const page = params.p || '1';
    const limit = params.pl || '20';
    const sortBy = params.sb || 'first_name';
    const sort = params.s || 'asc';

    const customerPromise = getAllData({
        url: 'customers/',
        searchQueries: { 'first_name': query },
        customQuery: { page, limit },
        sortQueries: { [sortBy]: sort }
    });



    return (
        <>
            {/* <TopPageNavigation /> */}

            <div className="flex justify-end mt-3">
                <div className="flex gap-3">
                    <KycHeaderBtns />
                </div>
            </div>
            
            <div className="panel mt-5 border-white-light px-0 dark:border-[#1b2e4b]">

                {/* <ClientErrorBoundary> */}
                    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                        <KycTable customerPromise={customerPromise} />
                    </Suspense>
                {/* </ClientErrorBoundary> */}
            </div>

        </>
    )
}
