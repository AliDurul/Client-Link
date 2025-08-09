'use client';
import { Product } from '@/types';
import React from 'react'
import ProductGridBtn from './ProductGridBtn';

export default function ProductGrid({ products }: { products: Product[] }) {
    return (
        <div className="mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product: Product) => {
                return (
                    <div className={`relative overflow-hidden rounded-md bg-white text-center shadow-lg ${product.is_active ? 'shadow-green-300' : 'shadow-red-300'}  dark:bg-[#1c232f] group transition`} key={product._id}>
                        <div className={`relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]`}>
                            <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-4 ">
                                <img className="mx-auto max-h-40 w-4/5 object-contain group-hover:scale-110 transition duration-300" src='/assets/images/profile-pic.png' alt="product" />
                            </div>
                            <div className="relative mt-3 px-6 pb-5">
                                <div className="text-xl">{product?.name}</div>
                                <div className="text-white-dark">{product?.category}</div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex-auto">
                                        <div className="text-info">43343</div>
                                        <div>Sold Times</div>
                                    </div>
                                    <div className="flex-auto">
                                        <div className="text-info">66</div>
                                        <div>Issueed</div>
                                    </div>
                                    <div className="flex-auto">
                                        <div className="text-info">K{product.price}</div>
                                        <div>Price</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ProductGridBtn product={product} />
                    </div>
                );
            })}

        </div>
    )
}
