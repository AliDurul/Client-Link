'use client';
import InputBox from '@/components/shared/InputBox';
import { productCrUpAction } from '@/lib/features/products/productAction';
import { selectProduct, selectProductModal, setProductModal } from '@/lib/features/products/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Product, ProductDefaultParams } from '@/types';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import React, { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast';


export default function ProductModal() {
    const dispatch = useAppDispatch()

    const productModal = useAppSelector(selectProductModal);
    const product = useAppSelector(selectProduct)

    const [state, action, isPending] = useActionState(productCrUpAction, null);


    const getStringValue = (value: FormDataEntryValue | null | undefined): string => {
        if (value === null || value === undefined) return '';
        if (value instanceof File) return '';
        return String(value);
    };

    const getNumberValue = (value: number | FormDataEntryValue | null | undefined): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (value instanceof File) return 0;
        return Number(value) || 0;
    };

    const initialValues = product ? {
        _id: product._id || '',
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        is_active: product.is_active || true,
        // category: product?.category || '',
        // stock_quantity: product.stock_quantity || 0,
    } : {
        _id: '',
        name: getStringValue(state?.inputs?.name),
        price: getNumberValue(state?.inputs?.price),
        description: getStringValue(state?.inputs?.description),
        is_active: true,
        // category: getStringValue(state?.inputs?.category),
        // stock_quantity: getNumberValue(state?.inputs?.stock_quantity),
    };



    useEffect(() => {
        if (!state?.message) return;


        toast[state.success ? 'success' : 'error'](state.message || 'Operation completed successfully');
        if (state.success) {
            dispatch(setProductModal(false));
        }

    }, [state]);


    return (
        <Dialog as="div" open={productModal} onClose={() => dispatch(setProductModal(false))} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center px-4 py-8">

                    <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                        <button
                            type="button"
                            onClick={() => dispatch(setProductModal(false))}
                            className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                            {initialValues?._id ? 'Edit Product' : 'Add Product'}
                        </div>
                        <form className='p-5 space-y-4' action={action}>
                            <input type="text" name='id' defaultValue={initialValues?._id} hidden />

                            <InputBox
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter Name"
                                className="form-input"
                                label='Name'
                                value={initialValues?.name}
                                errors={state?.errors?.name}
                            />


                            <InputBox
                                id="price"
                                name="price"
                                type="number"
                                placeholder="Enter Price"
                                className="form-input"
                                label='Price'
                                value={initialValues?.price}
                                errors={state?.errors?.price}
                            />



                            <InputBox
                                id="description"
                                name="description"
                                type="text"
                                placeholder="Enter Description"
                                className="form-input"
                                label='Description'
                                value={initialValues?.description}
                                errors={state?.errors?.description}
                            />

                            <div className="mt-8 flex items-center justify-end">
                                <button type="button" className="btn btn-outline-danger" onClick={() => dispatch(setProductModal(false))}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                    {
                                        isPending
                                            ? 'Saving..'
                                            : initialValues._id ? 'Update' : 'Add'
                                    }
                                </button>
                            </div>
                        </form>
                    </DialogPanel>

                </div>
            </div>
        </Dialog>
    )
}
