import InvoiceReadPreviewBtns from '@/components/dashboard/invoice/InvoiceReadPreviewBtns';
import TopPageNavigation from '@/components/shared/TopPageNavigation';
import { getData } from '@/lib/features/shared/actionUtils';
import { formatDate } from '@/lib/utility/functions';
import { Invoice, InvoiceItem, PageParams } from '@/types'
import Image from 'next/image';
import React from 'react'

export default async function page({ params }: { params: Promise<{ invoiceId: string }> }) {

    const { invoiceId } = await params;

    const invoice: { success: boolean, result: Invoice } = await getData({ url: 'invoices', id: invoiceId });

    const columns = [
        {
            key: 'id',
            label: 'Id',
        },
        {
            key: 'title',
            label: 'Product Names',
        },
        {
            key: 'quantity',
            label: 'QTY',
        },
        {
            key: 'price',
            label: 'PRICE',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'discounts',
            label: 'DISCOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
        {
            key: 'total_price',
            label: 'AMOUNT',
            class: 'ltr:text-right rtl:text-left',
        },
    ];

    return (
        <div className="flex flex-col space-y-5">
            <TopPageNavigation />

            <div>
                <InvoiceReadPreviewBtns invoice={invoice?.result} />
                <div className="panel printBody">
                    <div className="flex flex-wrap justify-between gap-4 px-4">
                        <div className="text-2xl font-semibold uppercase">Invoice</div>
                        <div className="shrink-0">
                            <Image src="/assets/images/logo.png" className="ltr:ml-auto rtl:mr-auto" alt="Campony logo" width={120} height={120} />
                        </div>
                    </div>
                    <div className="px-4 ltr:text-right rtl:text-left">
                        <div className="mt-6 space-y-1 text-white-dark">
                            <div>3nd Floor,Finance House, Hero's Place, Lusaka, Zambia</div>
                            <div>clientLinko@gmail.com</div>
                            <div>+260 (970) 732-4567</div>
                        </div>
                    </div>
                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                    <div className="flex flex-col flex-wrap justify-between gap-4 lg:flex-row">
                        <div className="flex-1">
                            <div className="space-y-1 text-white-dark">
                                <div>Issue For:</div>
                                <div className="font-semibold text-black dark:text-white">{invoice?.result?.customer?.full_name}</div>
                                {/* <div>{invoice?.result?.customer?.location}</div> */}
                                <div>{invoice?.result?.customer?.email}</div>
                                <div>{invoice?.result?.customer?.phone_number}</div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Invoice :</div>
                                    <div>#8701</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Issue Date :</div>
                                    <div>{formatDate(invoice?.result?.createdAt)}</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Due Date :</div>
                                    <div>{formatDate(invoice?.result?.due_date)}</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Order ID :</div>
                                    <div>#OD-85794</div>
                                </div>
                                <div className="flex w-full items-center justify-between">
                                    <div className="text-white-dark">Shipment ID :</div>
                                    <div>#SHP-8594</div>
                                </div>
                            </div>
                            <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Payment Type:</div>
                                    <div className="whitespace-nowrap">{invoice?.result?.payment_type}</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Account Number:</div>
                                    <div>1234567890</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">SWIFT Code:</div>
                                    <div>S58K796</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">IBAN:</div>
                                    <div>L5698445485</div>
                                </div>
                                <div className="mb-2 flex w-full items-center justify-between">
                                    <div className="text-white-dark">Country:</div>
                                    <div>Zambia / Lusaka</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        invoice?.result?.additional_note && (
                            <div className='mt-3'>
                                <div className='text-center' >Additional Notes</div>
                                <p className="text-white-dark">{invoice?.result.additional_note}</p>
                            </div>
                        )

                    }
                    <div className="table-responsive mt-6">
                        <table className="table-striped">
                            <thead>
                                <tr>
                                    {columns.map((column, i) => {
                                        return (
                                            <th key={i} className={column?.class}>
                                                {column.label}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {invoice?.result?.invoice_items?.map((item: InvoiceItem, i: number) => {
                                    return (
                                        <tr key={i}>
                                            <td >{item?.product._id.toString().slice(0, 5)}..</td>
                                            <td>{item.product?.name}</td>
                                            <td>{item.quantity}</td>
                                            <td className="ltr:text-right rtl:text-left">{item.unit_price}</td>
                                            <td className="ltr:text-right rtl:text-left">$10</td>
                                            <td className="ltr:text-right rtl:text-left">${item.total_price}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
                        <div></div>
                        <div className="space-y-2 ltr:text-right rtl:text-left">
                            {/* <div className="flex items-center">
                                <div className="flex-1">Subtotal</div>
                                <div className="w-[37%]">$3255</div>
                            </div> */}
                            <div className="flex items-center">
                                <div className="flex-1">Tax</div>
                                <div className="w-[37%]">%{invoice?.result.tax}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">Shipping Rate</div>
                                <div className="w-[37%]">${invoice?.result.shipping_cost}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">Discount</div>
                                <div className="w-[37%]">${invoice?.result.discount}</div>
                            </div>
                            <div className="flex items-center text-lg font-semibold">
                                <div className="flex-1">Grand Total</div>
                                <div className="w-[37%]">${invoice?.result?.total_amount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
