import KycForm from '@/components/dashboard/kyc/KycForm';
import TopPageNavigation from '@/components/shared/TopPageNavigation';
import { getKyc } from '@/lib/features/kyc/kycActions';
import { PageSearchParams } from '@/types';
import { Suspense } from 'react';



export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;

    const userId = (params.id || '');
    const readOnly = params.s === 'r';
    const isEdit = params.s === 'e';

    const kycPromise = getKyc(userId)


    return (
        <>
            <TopPageNavigation />

            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                <KycForm kycPromise={kycPromise} readOnly={readOnly} isEdit={isEdit} />
            </Suspense>


        </>
    )
}
