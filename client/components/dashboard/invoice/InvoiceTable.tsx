'use client';
import SearchInput from '@/components/shared/SearchInput';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUrlParams } from '@/hooks/useUrlParams';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { delKyc, delMultiKyc } from '@/lib/features/kyc/kycActions';
import { selectIsDarkMode } from '@/lib/features/theme/themeSlice';
import { useAppSelector } from '@/lib/hooks';
import { formatDate } from '@/lib/utility/functions';
import { Invoice, Pagination } from '@/types';
import { DataTable, type DataTableColumn, type DataTableProps, type DataTableSortStatus } from 'mantine-datatable';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, use, useActionState, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuMousePointerClick } from 'react-icons/lu';


const PAGE_SIZES = [10, 20, 30, 50, 100]

const DEFAULT_SORT_STATUS: DataTableSortStatus = {
    columnAccessor: 'first_name',
    direction: 'asc',
} as const;

interface InvoiceTableProps {
    invoicePromise: Promise<Pagination<Invoice>>;
}

export default function InvoiceTable({ invoicePromise }: InvoiceTableProps) {
    const { userInfo } = useCurrentUser();
    const { updateUrlParams, getParam } = useUrlParams();
    const router = useRouter();
    const isDark = useAppSelector(selectIsDarkMode);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>(DEFAULT_SORT_STATUS);
    const [selectedRecords, setSelectedRecords] = useState<Invoice[]>([]);
    const page = getParam('p', '1');
    const pl = getParam('pl', '20');

    const invoices = use(invoicePromise);


    // Paginatin and sorting
    const handleSortStatusChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        updateUrlParams({
            p: '1',
            sb: status.columnAccessor,
            s: status.direction
        });
    }

    const handlePageChange = (newPage: number) => {
        updateUrlParams({ p: newPage.toString() });
    }

    const handlePageSizeChange = (newPageSize: number) => {
        updateUrlParams({
            pl: newPageSize.toString(),
            p: '1'
        });
    }


    //! Action handlers
    const [stateSing, actionSing, isPendingSing] = useActionState(delKyc, null);
    const [stateMulti, actionMulti, isPendingMulti] = useActionState(delMultiKyc, null);

    const handlePreview = (record: Invoice) => {
        router.push(`/invoice/action?s=r&id=${record._id}`);
    }

    const handleEdit = (recordId: number) => {
        // if (userInfo?.role !== 'admin') return;
        router.push(`/invoice/action?s=e&id=${recordId}`);
    }

    const handleDelete = async (recordId: number) => {
        // if (userInfo?.role !== 'admin') return;
        startTransition(() => {
            actionSing(recordId)
        });
    };

    useEffect(() => {
        if (stateSing) {
            toast[stateSing?.success ? 'success' : 'error'](stateSing?.message || 'Operation completed');
        }
    }, [stateSing]);

    const handleMultiDelete = async () => {
        if (selectedRecords.length === 0) return;
        const ids = selectedRecords.map(record => record._id);

        startTransition(() => {
            actionMulti(ids)
        });
    }

    useEffect(() => {
        if (stateMulti) {
            toast[stateMulti?.success ? 'success' : 'error'](stateMulti?.message || 'Operation completed');
            if (stateMulti?.success) {
                setSelectedRecords([]);
            }
        }
    }, [stateMulti]);


    // Data table 

    const renderActions: DataTableColumn<Invoice>['render'] = (record) => (
        <div className="mx-auto flex w-max items-center gap-4">
            <Link href={`/invoices/${record._id}`}  className="flex hover:text-primary">
                <PreviewIcon />
            </Link>
            {
                userInfo?.role !== 'admin' && (
                    <>
                        <button className="flex hover:text-info" onClick={(e) => { e.stopPropagation(); handleEdit(record._id); }}>
                            <EditIcon />
                        </button>
                        <button type="button" className="flex hover:text-danger" disabled={isPendingSing} onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}>
                            <DeleteIcon />
                        </button>
                    </>
                )
            }
        </div>
    );

    // const rowExpansion: DataTableProps<Invoice>['rowExpansion'] = {
    //     allowMultiple: true,
    //     content: ({ record: { full_name, assigned_agent, address, profile_pic, phone_number } }) => (
    //         <div className='flex items-center gap-4'>
    //             <Image
    //                 width={32}
    //                 height={32}
    //                 className="h-8 w-8 rounded-full object-cover"
    //                 src={profile_pic ? profile_pic : '/assets/images/profile-pic.png'} alt="profile picture" />
    //             <p >
    //                 {full_name}, phone number is {phone_number} and assigned agent is {assigned_agent}.
    //                 <br />
    //                 His office address is {address?.street}, {address?.city}, {address?.state}.
    //             </p>
    //         </div>
    //     ),
    // };

    const columns: DataTableProps<Invoice>['columns'] = [
        {
            accessor: 'creator.first_name',
            title: 'Staff Name',
            sortable: true,
            render: ({ creator }) => `${creator.full_name}`,
        },
        {
            accessor: 'customer.first_name',
            title: 'Customer Name',
            sortable: true,
            render: ({ customer }) => `${customer.full_name}`,
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
                        selectedRecords.length >= 1 && <button type="button" className="btn btn-danger  gap-2"
                        // onClick={() => deleteRow()}
                        >
                            <DeleteIcon />
                            Delete
                        </button>
                    }
                    <button
                        // onClick={() => { router.push(`/invoices/action`), dispatch(updateInvoiceState(null)) }}
                        className="btn btn-primary btn-sm  gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New
                    </button>
                </div>

                <SearchInput className='mr-3' />

            </div>

            <div className="datatables pagination-padding">
                <DataTable
                    className={`${isDark} table-hover whitespace-nowrap`}
                    // rowExpansion={rowExpansion}
                    minHeight={400}
                    records={invoices?.result || []}
                    withBorder={false}
                    columns={columns}
                    highlightOnHover
                    totalRecords={invoices?.details.totalRecords || 0}
                    recordsPerPage={pl ? parseInt(pl, 10) : 20}
                    page={page ? parseInt(page, 10) : 1}
                    fontSize="sm"
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handlePageSizeChange}
                    recordsPerPageOptions={PAGE_SIZES}
                    sortStatus={sortStatus}
                    onSortStatusChange={handleSortStatusChange}
                    selectedRecords={selectedRecords}
                    onSelectedRecordsChange={setSelectedRecords}
                    paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>

        </>
    )
}
