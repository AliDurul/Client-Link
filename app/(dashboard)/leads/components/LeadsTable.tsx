'use client';

import React, { useEffect, useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/app/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllLeadsAsync, selectLeadModal, selectLeadStates, setLeadModal, updateLeads, updateLeadState } from '@/lib/features/leads/leadSlice';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { selectIsDarkMode } from '@/lib/features/themeConfig/themeConfigSlice';
import { coloredToast } from '@/utils/sweetAlerts';
import Image from 'next/image';
import { formatDate, truncateText } from '@/utils/helperFunctions';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { deleteLead, deleteMultiLead } from '@/lib/features/leads/leadAPI';
import Search from '@/app/components/common/Search';
import { ELeadStatus, EPipelineStage, ILead } from '@/types/types';
import dynamic from 'next/dynamic';
const LeadModal = dynamic(() => import('@/app/(dashboard)/leads/components/LeadModal'));

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;

export default function LeadsTable() {

    // custom hook
    const { deleteToast, multiDeleteToast } = useDeleteToasts();
    const searchParams = useSearchParams();
    const { userInfo } = useCurrentUser();
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Selectors
    const { error, status, leads } = useAppSelector(selectLeadStates);
    const isDark = useAppSelector(selectIsDarkMode)
    const ticketModal = useAppSelector(selectLeadModal);


    // variables
    const page = (searchParams.get('page') || 1) as string;
    const pageSize = (searchParams.get('pageSize') || 10) as string;
    const search = (searchParams.get('search') || '') as string;
    const userType = userInfo?.payload?.user_type;
    const initialValues: ILead = {
        // id: 0,
        source: '',
        owner: '',
        name: '',
        source_link: '',
        courier: 'No', // Ensure this is typed correctly
        mobile_number: '',
        email: '',
        province: '',
        town: '',
        exact_location: '',
        pipeline_stage: EPipelineStage.Qualification,
        deal_value: "",
        probability: "",
        expected_revenue: "",
        follow_up_date: new Date(),
        close_date: null,
        status: ELeadStatus.Open,
        comments: '',
    };

    // States
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [initialRecords, setInitialRecords] = useState(sortBy(leads?.results, 'id'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });


    // Use Effects

    useEffect(() => {
        dispatch(fetchAllLeadsAsync({ page, pageSize, search }));
    }, []);

    useEffect(() => {
        if (error) coloredToast('danger', error);
    }, [error]);

    useEffect(() => {
        setRecords(leads?.results);
        setInitialRecords(leads?.results);
    }, [leads?.results]);

    useEffect(() => {

        const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
        if (search) {
            params.append('search', search.toString());
        }
        router.push(`?${params.toString()}`, { scroll: false });

        dispatch(fetchAllLeadsAsync({ page, pageSize, search }));
    }, [page, pageSize, search]);

    useEffect(() => {
        setInitialRecords(() => {
            return leads?.results?.filter((item: ILead) => {
                return (
                    item?.owner?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.name?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.mobile_number?.toLowerCase().includes(search.toLowerCase()) ||
                    item?.email?.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
    }, [sortStatus]);


    // Functions
    const deleteRow = async (id: any = null) => {

        const params = new URLSearchParams();

        if (id) {
            const deletionSuccess = await deleteToast(id, deleteLead, updateLeads);

            if (deletionSuccess) {
                setSelectedRecords([]);

                params.append("page", "1");
                params.append("pageSize", "10");
                params.append("search", "");
                router.push(`?${params.toString()}`, { scroll: false });
            }
        } else {
            let selectedRows = selectedRecords || [];
            if (selectedRows?.length === 0) {
                coloredToast("warning", "Select items to delete!");
                return;
            }
            const ids = selectedRows?.map((d: any) => { return d.id; });
            const deletionSuccess = await multiDeleteToast(ids, deleteMultiLead, updateLeads);

            if (deletionSuccess) {
                setSelectedRecords([]);

                params.append("page", "1");
                params.append("pageSize", "10");
                params.append("search", "");
                router.push(`?${params.toString()}`, { scroll: false });
            }
        }

    };

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b] mt-7">
            <div className="lead-table">
                <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        {
                            selectedRecords.length >= 1 && <button type="button" className="btn btn-danger  gap-2" onClick={() => deleteRow()}>
                                <DeleteIcon />
                                Delete
                            </button>
                        }
                        <button
                            className="btn btn-primary btn-sm  gap-2"
                            onClick={() => {
                                dispatch(setLeadModal(true))
                                dispatch(updateLeadState(initialValues))
                            }}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add New
                        </button>

                        {
                            ticketModal && <LeadModal />
                        }

                    </div>

                    <Search search={search} />

                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={records?.map((lead, index) => ({
                            ...lead,
                            serialNumber: index + 1,
                        }))}
                        columns={[
                            {
                                accessor: 'Name',
                                sortable: true,
                                render: ({ name, id }) => (
                                    <div className="flex items-center font-semibold">
                                        {/* <div className="w-max rounded-full bg-white-dark/20 p-1 ltr:mr-2 rtl:ml-2 ">
                                            <Image
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                                src={`${staff.profile_pic ? IMG_URL + staff?.profile_pic : '/assets/images/profile-pic.png'}`}
                                                alt="staff pic" />
                                        </div> */}
                                        <div>{name}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Owner',
                                sortable: true,
                                render: ({ owner, id }) => (
                                    <div className="flex items-center font-semibold">
                                        {/* <div className="w-max rounded-full bg-white-dark/30 p-1 ltr:mr-2 rtl:ml-2">
                                            <Image
                                                width={32}
                                                height={32}
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={customer.profile_pic ? IMG_URL + customer.profile_pic : '/assets/images/profile-pic.png'} alt="customer pic" />

                                        </div> */}
                                        <div>{owner}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'Source',
                                sortable: true,
                                render: ({ source }) => <span >{source}</span>
                            },
                            {
                                accessor: 'Source Link',
                                sortable: true,
                                render: ({ source_link }) => (
                                    <Link target='_blank' href={source_link && source_link.startsWith('http') ? source_link : '#'} className={`${source_link && source_link.startsWith('http') ? 'text-green-600' : 'text-gray-700'}`}>
                                        {source_link && source_link.startsWith('http') ? 'Go to link' : 'Not Provided'}
                                    </Link>
                                )
                            },
                            {
                                accessor: 'Email',
                                // sortable: true,
                                render: ({ email }) => <span >{email}</span>
                            },
                            {
                                accessor: 'Mobile Number',
                                // sortable: true,
                                render: ({ mobile_number }) => <span >{mobile_number}</span>
                            },
                            {
                                accessor: 'Province',
                                // sortable: true,
                                render: ({ province }) => <span >{province}</span>
                            },
                            {
                                accessor: 'Town',
                                // sortable: true,
                                render: ({ town }) => <span >{town}</span>
                            },
                            {
                                accessor: 'Exact Location',
                                // sortable: true,
                                render: ({ exact_location }) => <span >{truncateText(exact_location || '', 20)}</span>
                            },
                            {
                                accessor: 'pipeline stage',
                                sortable: true,
                                render: ({ pipeline_stage }) => (
                                    <span className={`badge 
                                        badge-outline-${pipeline_stage === 'Qualification' ? 'primary'
                                            : pipeline_stage === 'Proposal|Quotation' ? 'secondary'
                                                : pipeline_stage === 'Negotiation' ? 'warning'
                                                    : pipeline_stage === 'Pending Approval' ? 'info'
                                                        : pipeline_stage === 'Closed-Won' ? 'success'
                                                            : pipeline_stage === 'Closed-Lost' ? 'danger' : ''}`}>
                                        {pipeline_stage}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'Status',
                                sortable: true,
                                render: ({ status }) => (
                                    <span className={`badge 
                                        badge-outline-${status === 'Open' ? 'primary'
                                            : status === 'In Progress' ? 'secondary'
                                                : status === 'Closed-Won' ? 'success'
                                                    : status === 'Closed-Lost' ? 'danger' : ''}`}>
                                        {status}
                                    </span>
                                ),
                            },
                            {
                                accessor: 'Probability',
                                // sortable: true,
                                render: ({ probability }) => <span >{probability}</span>
                            },
                            {
                                accessor: 'Deal Value',
                                // sortable: true,
                                render: ({ deal_value }) => <span >{deal_value}</span>
                            },
                            {
                                accessor: 'Expected Revenue',
                                // sortable: true,
                                render: ({ expected_revenue }) => <span >{expected_revenue}</span>
                            },
                            {
                                accessor: 'Follow Up Date',
                                // sortable: true,
                                render: ({ follow_up_date }) => <span >{formatDate(follow_up_date)}</span>
                            },
                            {
                                accessor: 'Close Date',
                                // sortable: true,
                                render: ({ close_date }) => <span >{formatDate(close_date)}</span>
                            },
                            {
                                accessor: 'Comments',
                                // sortable: true,
                                render: ({ comments }) => <span >{truncateText(comments || '', 20)}</span>
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: (lead) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button
                                            onClick={() => {
                                                dispatch(setLeadModal(true))
                                                dispatch(updateLeadState(lead))
                                            }}
                                            className="flex hover:text-primary">
                                            <PreviewIcon />
                                        </button>
                                        {userType === 'Admin' &&
                                            <>
                                                <button
                                                    onClick={() => {
                                                        dispatch(setLeadModal(true))
                                                        dispatch(updateLeadState(lead))
                                                    }}
                                                    className="flex hover:text-info">
                                                    <EditIcon />
                                                </button>
                                                <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(lead?.id)}>
                                                    <DeleteIcon />
                                                </button>
                                            </>
                                        }
                                    </div>
                                ),
                            },
                        ]}
                        striped
                        highlightOnHover
                        totalRecords={leads?.count}
                        recordsPerPage={Number(pageSize)}
                        page={Number(page)}
                        onPageChange={(p) => router.push(`?${new URLSearchParams({ page: p.toString(), pageSize: pageSize.toString() })}`, { scroll: false })}
                        onRecordsPerPageChange={(ps) => router.push(`?${new URLSearchParams({ page: page.toString(), pageSize: ps.toString() })}`, { scroll: false })}
                        recordsPerPageOptions={PAGE_SIZES}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    // rowClassName="cursor-pointer"
                    // onRowClick={(lead) => router.push(`/lead/${lead?.id}`)}
                    />
                </div>
            </div>
        </div >
    )
}
