'use client';
import SearchInput from '@/components/shared/SearchInput';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { delMultiKyc } from '@/lib/features/kyc/kycActions'; // TODO: Create proper invoice actions
import { formatDate, truncateText } from '@/lib/utility/functions';
import { Ticket, Pagination } from '@/types';
import { DataTable, type DataTableColumn, type DataTableProps } from 'mantine-datatable';
import Link from 'next/link';
import { use } from 'react';
import { LuMousePointerClick } from 'react-icons/lu';
import { useDataTable } from '@/hooks/useDataTable';
import Image from 'next/image';
import { delData, delMultiData } from '@/lib/features/shared/actionUtils';


interface TicketTableProps {
    tickets: Pagination<Ticket>
}

export default function TicketTable({ tickets }: TicketTableProps) {

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
    } = useDataTable<Ticket>({
        deleteAction: delData,
        deleteMultiAction: delMultiData,
    });


    // Data table 

    const renderActions: DataTableColumn<Ticket>['render'] = (record) => (
        <div className="mx-auto flex w-max items-center gap-4">
            <button
                onClick={(e) => { handlePreview(`tickets/${record._id}`, e); }}

                className="flex hover:text-primary">
                <PreviewIcon />
            </button>
            {
                userInfo?.role !== 'admin' && (
                    <>
                        <button className="flex hover:text-info"
                            onClick={(e) => { handleEdit(`/tickets/action/?s=e&id=${record._id}`, e); }}>
                            <EditIcon />
                        </button>
                        <button
                            type="button"
                            className="flex hover:text-danger"
                            disabled={isPendingSingle}
                            onClick={(e) => { handleDelete({ url: 'tickets', id: record._id }, e); }}>
                            <DeleteIcon />
                        </button>
                    </>
                )
            }
        </div>
    );

    const rowExpansion: DataTableProps<Ticket>['rowExpansion'] = {
        ...getRowExpansionProps(),
        content: ({ record }) => {
            return (
                <div className='flex items-center gap-4 pl-12'>
                    <Image
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                        src={record?.customer?.profile_pic ? record.customer.profile_pic : '/assets/images/profile-pic.png'} alt="profile picture" />
                    <p >
                        {record?.customer?.first_name} {record?.customer?.last_name}, email is {record?.customer?.email}.
                    </p>
                </div>
            );
        },
    };

    const columns: DataTableProps<Ticket>['columns'] = [
        {
            accessor: 'assigned_agent.full_name',
            title: 'Assigned Agent',
            sortable: true,
            render: ({ assigned_agent }) => `${assigned_agent?.full_name}`,
        },
        {
            accessor: 'customer.first_name',
            title: 'Customer Name',
            sortable: true,
            render: ({ customer }) => `${customer?.full_name}`,
        },
        {
            accessor: 'title',
            sortable: true,
        },
        {
            accessor: 'description',
            sortable: true,
            render: ({ description }) => `${truncateText(description, 70)}`,
        },
        {
            accessor: 'category',
            sortable: true,
            render: ({ category }) => `${category?.name}`,
        },
        {
            accessor: 'createdAt',
            sortable: true,
            render: ({ createdAt }) => <span>{formatDate(createdAt ?? null)}</span>,
        },

        {
            accessor: 'status',
            sortable: true,
            render: ({ status }) => <span className={`badge badge-outline-${status === 'pending' ? 'dark'
                : status === 'active' ? 'secondary'
                    : status === 'resolved' ? 'success'
                        : status === 'cancelled' ? 'warning'
                            : status === 'escalated' ? 'danger' : ''}`}>{status}</span>,
        },
        {
            accessor: 'priority',
            sortable: true,
            render: ({ priority }) => <span className={`badge badge-outline-${priority === 'critical' ? 'danger'
                : priority === 'high' ? 'warning'
                : priority === 'medium' ? 'secondary'
                    : priority === 'low' ? 'dark' : ''}`}>{priority}</span>,
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
                                onClick={() => handleMultiDelete('tickets')} disabled={isPendingMulti}>
                                <DeleteIcon />
                                Delete
                            </button>
                        )
                    }
                    <button
                        onClick={() => handleCreate('/tickets/action/?s=c')}
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
                    records={tickets?.result || []}
                    columns={columns}
                    totalRecords={tickets?.details.totalRecords || 0}
                    idAccessor="_id"
                />
            </div>

        </>
    )
}
