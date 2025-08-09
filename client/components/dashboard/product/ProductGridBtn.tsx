'use client';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons'
import { selectProductModal, setProduct, setProductModal } from '@/lib/features/products/productSlice';
import { delData } from '@/lib/features/shared/actionUtils';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function ProductGridBtn({ product }: { product: Product }) {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(selectProductModal)


    const handleReview = async (id: string) => {
        // dispatch(updateProductState(product))
        router.push(`/products/${id}`)
    }

    const handleDelete = async (id: string) => {
        try {
            await delData(null, { url: 'products', id });
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }


    const handleEdit = async (product: Product) => {
        dispatch(setProduct(product))
        dispatch(setProductModal(true))
    }

    return (

        <div className="absolute top-10 -right-11 group-hover:right-0  p-2 flex flex-col items-center justify-center gap-y-4 opacity-0 group-hover:opacity-100 transition-all duration-300 dark:text-white">
            <button className='flex justify-center items-center  w-10 h-w-10 bg hover:text-red-700' onClick={() => handleDelete(product._id)}>
                <DeleteIcon />
            </button>
            <button className="flex justify-center items-center  w-10 h-w-10 hover:text-primary" onClick={() => handleReview(product._id)}>
                <PreviewIcon />
            </button>
            <button className="flex justify-center items-center  w-10 h-w-10 hover:text-primary" onClick={() => handleEdit(product)}>
                <EditIcon />
            </button>
        </div>

    )
}
