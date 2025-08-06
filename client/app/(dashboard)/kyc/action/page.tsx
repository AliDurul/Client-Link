import KycForm from '@/components/dashboard/kyc/KycForm';
import TopPageNavigation from '@/components/shared/TopPageNavigation';
import { getData } from '@/lib/features/shared/actionUtils';
import { Kyc, PageSearchParams } from '@/types';
import { Suspense } from 'react';



export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;

    const userId = (params.id || '');
    const readOnly = params.s === 'r';
    const isEdit = params.s === 'e';

    let kyc: Kyc | null = null;
    let error = null;

    if ((readOnly || isEdit)) {
        try {
            const data = await getData(`customers/${userId}`);
            if (data.success) {
                kyc = data.result;
            } else {
                error = data.message;
            }
        } catch (error) {
            console.error('Error fetching KYC:', error);
            error = 'Failed to fetch KYC details';
        }
    }


    return (
        <KycForm kyc={kyc} readOnly={readOnly} isEdit={isEdit} error={error} />
    )
}
