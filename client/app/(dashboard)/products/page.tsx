import ProductDisplay from '@/components/dashboard/product/ProductDisplay';
import ProductHeaderBtns from '@/components/dashboard/product/ProductHeaderBtns';
import { getAllData } from '@/lib/features/shared/actionUtils';
import { PageSearchParams } from '@/types'
import React from 'react'

export default async function page({ searchParams }: PageSearchParams) {

    const params = await searchParams;
    const query = params.q || '';
    const page = params.p || '1';
    const limit = params.pl || '20';
    const sortBy = params.sb || 'first_name';
    const sort = params.s || 'asc';

    const products = await getAllData({
        url: 'products/',
        searchQueries: { 'name': query },
        customQuery: { page, limit },
        sortQueries: { [sortBy]: sort }
    });



    return (
        <div>
            <ProductHeaderBtns />

            <ProductDisplay products={products} />
        </div>
    )
}
