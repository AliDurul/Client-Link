import TicketReview from '@/components/dashboard/ticket/TicketReview';
import { getData } from '@/lib/features/shared/actionUtils';
import { Ticket } from '@/types';
import Link from 'next/link';
import React from 'react'

export default async function page({ params }: { params: Promise<{ ticketId: string }> }) {

    const { ticketId } = await params;

    const ticket: { success: boolean, result: Ticket } = await getData(`tickets/${ticketId}`);
    console.log(ticket);

    return (
        <div className="mt-5 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-none lg:grid-rows-1">
            <TicketReview ticket={ticket.result} />
            {/* <TicketEscForm /> */}
            {/* <TicketLatestActivity /> */}
            <div className="panel sm:col-span-2 sm:row-start-2 lg:col-span-2 lg:row-start-2">
                <div className="mb-5 flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Recent Orders</h5>
                </div>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th className="ltr:rounded-l-md rtl:rounded-r-md">Agents</th>
                                <th>Product</th>
                                <th>Invoice</th>
                                <th>Price</th>
                                <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="min-w-[150px] text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-6.jpeg" alt="avatar" />
                                        <span className="whitespace-nowrap">Luke Ivory</span>
                                    </div>
                                </td>
                                <td className="text-primary">Uba kiddies saving </td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                        <span className="whitespace-nowrap">Andy King</span>
                                    </div>
                                </td>
                                <td className="text-info">Nike Sport</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#76894</Link>
                                </td>
                                <td>$126.04</td>
                                <td>
                                    <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-8.jpeg" alt="avatar" />
                                        <span className="whitespace-nowrap">Laurie Fox</span>
                                    </div>
                                </td>
                                <td className="text-warning">SME Domiciliary</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#66894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-9.jpeg" alt="avatar" />
                                        <span className="whitespace-nowrap">Ryan Collins</span>
                                    </div>
                                </td>
                                <td className="text-danger">UBA SME</td>
                                <td>
                                    <button type="button">#75844</button>
                                </td>
                                <td>$110.00</td>
                                <td>
                                    <span className="badge bg-secondary shadow-md dark:group-hover:bg-transparent">Pending</span>
                                </td>
                            </tr>
                            <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                                <td className="text-black dark:text-white">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/profile-10.jpeg" alt="avatar" />
                                        <span className="whitespace-nowrap">Irene Collins</span>
                                    </div>
                                </td>
                                <td className="text-secondary">UBA SME</td>
                                <td>
                                    <Link href="/apps/invoice/preview">#46894</Link>
                                </td>
                                <td>$56.07</td>
                                <td>
                                    <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
            <div className="panel sm:col-span-1 sm:row-start-2 lg:col-span-1 lg:row-start-2">
                <div className="flex items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Sales By Category</h5>
                </div>
                <div>
                    <div className="rounded-lg bg-white dark:bg-black min-h-80">
                        {/* {isMounted ? (
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} width={'100%'} />
                            ) : (
                                <div className="grid min-h-[325px] place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="inline-flex h-5 w-5 animate-spin rounded-full  border-2 border-black !border-l-transparent dark:border-white"></span>
                                </div>
                            )} */}
                    </div>
                </div>
            </div>
        </div>
    )
}
