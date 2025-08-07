'use client';
import SearchInput from '@/components/shared/SearchInput';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { delMultiKyc } from '@/lib/features/kyc/kycActions'; // TODO: Create proper invoice actions
import { formatDate } from '@/lib/utility/functions';
import { Invoice, Pagination } from '@/types';
import { DataTable, type DataTableColumn, type DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { use } from 'react';
import { LuMousePointerClick } from 'react-icons/lu';
import { useDataTable } from '@/hooks/useDataTable';
import Image from 'next/image';
import { delData, delMultiData } from '@/lib/features/shared/actionUtils';


interface InvoiceTableProps {
    invoicePromise: Promise<Pagination<Invoice>>;
}

export default function InvoiceTable({ invoicePromise }: InvoiceTableProps) {
    const invoices = use(invoicePromise);

    const {
        selectedRecords,
        userInfo,
        isPendingSingle,
        isPendingMulti,
        handleCreate,
        handleEdit,
        handlePreview,
        handleDelete,
        handleMultiDelete,
        getTableProps,
        getRowExpansionProps
    } = useDataTable<Invoice>({
        deleteAction: delData, // TODO: Create proper invoice actions
        deleteMultiAction: delMultiData, // TODO: Create proper invoice actions
    });


    // Data table 

    const renderActions: DataTableColumn<Invoice>['render'] = (record) => (
        <div className="mx-auto flex w-max items-center gap-4">
            <button
                onClick={(e) => { handlePreview(`invoices/${record._id}`, e); }}

                className="flex hover:text-primary">
                <PreviewIcon />
            </button>
            {
                userInfo?.role !== 'admin' && (
                    <>
                        <button className="flex hover:text-info"
                            onClick={(e) => { handleEdit(`/invoices/action/?s=e&id=${record._id}`, e); }}>
                            <EditIcon />
                        </button>
                        <button
                            type="button"
                            className="flex hover:text-danger"
                            disabled={isPendingSingle}
                            onClick={(e) => { handleDelete({ url: 'invoices', id: record._id }, e); }}>
                            <DeleteIcon />
                        </button>
                    </>
                )
            }
        </div>
    );

    const rowExpansion: DataTableProps<Invoice>['rowExpansion'] = {
        ...getRowExpansionProps(),
        content: ({ record }) => {
            const customer = typeof record.customer === 'object' ? record.customer : {};
            const { first_name, last_name, email, profile_pic } = customer as any;
            return (
                <div className='flex items-center gap-4 pl-12'>
                    <Image
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                        src={profile_pic ? profile_pic : '/assets/images/profile-pic.png'} alt="profile picture" />
                    <p >
                        {first_name} {last_name}, email is {email}.
                    </p>
                </div>
            );
        },
    };

    const columns: DataTableProps<Invoice>['columns'] = [
        {
            accessor: 'creator.first_name',
            title: 'Staff Name',
            sortable: true,
            render: ({ creator }) => `${creator?.full_name}`,
        },
        {
            accessor: 'customer.first_name',
            title: 'Customer Name',
            sortable: true,
            render: ({ customer }) => `${typeof customer === 'object' ? customer?.full_name : ''}`,
        },
        {
            accessor: 'createdAt',
            title: 'Created At',
            sortable: true,
            render: ({ createdAt }) => <span>{formatDate(createdAt ?? null)}</span>,
        },
        {
            accessor: 'due_date',
            sortable: true,
            render: ({ due_date }) => <span>{formatDate(due_date ?? null)}</span>,
        },

        {
            accessor: 'status',
            title: 'Status',
            sortable: true,
            render: ({ status }) => {
                return (
                    <span className={`badge badge-outline-${status === 'draft'
                        ? 'primary' : status === 'sent'
                            ? 'secondary' : status === 'paid'
                                ? 'success' : status === 'overdue'
                                    ? 'danger' : status === 'closed'
                                        ? 'danger' : status === 'refunded'
                                            ? 'danger' : ''}`}>{status}</span>
                )
            },
        },
        {
            accessor: 'actions',
            title: (
                <div className="flex items-center justify-center">
                    <LuMousePointerClick />
                </div>
            ),
            width: '0%',
            render: renderActions,
        },
    ];



    return (
        <>
            <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div className="ml-3 flex flex-wrap items-center gap-2">
                    {
                        selectedRecords.length >= 1 && (
                            <button type="button" className="btn btn-danger gap-2"
                                onClick={() => handleMultiDelete('invoices')} disabled={isPendingMulti}>
                                <DeleteIcon />
                                Delete
                            </button>
                        )
                    }
                    <button
                        onClick={() => handleCreate('/invoices/action/?s=c')}
                        className="btn btn-primary btn-sm  gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create new invoice
                    </button>
                </div>

                <SearchInput className='mr-3' />

            </div>

            <div className="datatables pagination-padding">
                <DataTable
                    {...getTableProps()}
                    rowExpansion={rowExpansion}
                    records={invoices?.result || []}
                    columns={columns}
                    totalRecords={invoices?.details.totalRecords || 0}
                    idAccessor="_id"
                />
            </div>

        </>
    )
}
