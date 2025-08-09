import { getData } from '@/lib/features/shared/actionUtils';
import { RadioGroup, Disclosure, TabGroup, TabPanels, TabPanel } from '@headlessui/react';

import { Product } from '@/types';
import React from 'react'

export default async function page({ params }: { params: Promise<{ productId: string }> }) {

    const { productId } = await params;

    const product: { success: boolean, result: Product } = await getData(`products/${productId}`);


    return (
        <div className="panel mt-4">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery */}
                    <TabGroup >
                        <div className="flex flex-col-reverse">
                            {/* Image selector */}
                            {/* <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                                <Tab.List className="grid grid-cols-4 gap-6">
                                    {product.images.map((image) => (
                                        <Tab
                                            key={image.id}
                                            className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className="sr-only">{image.name}</span>
                                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                                        <img src={image.src} alt="" className="h-full w-full object-cover object-center" />
                                                    </span>
                                                    <span
                                                        className={selected ? 'ring-indigo-500' : 'ring-transparent pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'}
                                                        aria-hidden="true"
                                                    />
                                                </>
                                            )}
                                        </Tab>
                                    ))}
                                </Tab.List>
                            </div> */}

                            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
                                {/* {product.images.map((image: any) => ( */}
                                <TabPanel>
                                    <img
                                        src='/assets/images/profile-pic.png'
                                        alt={product?.result.name}
                                        className="h-full w-full object-cover object-center sm:rounded-lg"
                                    />
                                </TabPanel>
                                {/* ))} */}
                            </TabPanels>
                        </div>
                    </TabGroup>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.result.name}</h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl tracking-tight text-gray-900">K{product?.result.price}</p>
                        </div>

                        {/* Reviews */}
                        {/* <div className="mt-3">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <StarIcon
                                            key={rating}
                                            className={classNames(
                                                product?.result..rating > rating ? 'text-indigo-500' : 'text-gray-300',
                                                'h-5 w-5 flex-shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <p className="sr-only">{product?.result..rating} out of 5 stars</p>
                            </div>
                        </div> */}

                        <div className="mt-6">
                            <h3 className="sr-only">Description</h3>
                            <div className="space-y-6 text-base text-gray-700">
                                <p>{product?.result.description}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="sr-only">Category</h3>
                            <div className="space-y-6 text-base text-gray-700">
                                <p>{product?.result.category}</p>
                            </div>
                        </div>



                        {/* <section aria-labelledby="details-heading" className="mt-12">
                            <h2 id="details-heading" className="sr-only">
                                Additional details
                            </h2>

                            <div className="divide-y divide-gray-200 border-t">
                                {product?.result..details.map((detail: any) => (
                                    <Disclosure as="div" key={detail.name}>
                                        {({ open }) => (
                                            <>
                                                <h3>
                                                    <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                                                        <span
                                                            className={open ? 'text-indigo-600' : 'text-gray-900 text-sm font-medium'}
                                                        >
                                                            {detail.name}
                                                        </span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon
                                                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                                    aria-hidden="true"
                                                                />
                                                            ) : (
                                                                <PlusIcon
                                                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                                                    <ul role="list">
                                                        {detail.items.map((item: any) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </div>
                        </section> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
