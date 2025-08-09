'use client';
import { useUrlParams } from '@/hooks/useUrlParams'
import { Product } from '@/types'
import React from 'react'
import ProductTable from './ProductTable';
import ProductGrid from './ProductGrid';
import { useAppSelector } from '@/lib/hooks';
import { selectProductModal } from '@/lib/features/products/productSlice';
import ProductModal from './ProductModal';

export default function ProductDisplay({ products }: { products: any }) {

    const isOpen = useAppSelector(selectProductModal);

    const { getParam } = useUrlParams()
    const uiType = getParam('ui') || 'grid';

    return (
        <>
            {uiType === 'list' ?
                <ProductTable products={products} /> :
                <ProductGrid products={products.result} />
            }
            {isOpen && <ProductModal />}
        </>
    )
}
