'use client'
import { selectIsDarkMode } from '@/lib/features/themeConfig/themeConfigSlice';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/app/icons';
import { deleteCoparate, deleteMultiCoparate } from '@/lib/features/coparate/coparateAPI';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import useDeleteToasts from '@/hooks/useDeleteToasts';
import { formatDate } from '@/utils/helperFunctions';
import { coloredToast } from '@/utils/sweetAlerts';
import { useState, useEffect, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Coparate } from '@/types/types';
import sortBy from 'lodash/sortBy';
import CoparateSearchInput from './CoparateSearchInput';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { fetchAllCoparateAsync, selectCoparates, selectCoparateValue, updateCoparates, updateCoparateState } from '@/lib/features/coparate/coparateSlice';

const IMG_URL = process.env.NEXT_PUBLIC_IMG_APIBASE_URL;


const CoparateListTable = () => {
    const { deleteToast, multiDeleteToast } = useDeleteToasts();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const router = useRouter()

    // session user info
    const { userInfo } = useCurrentUser();
    const userType = userInfo?.payload?.user_type;

    // queru params for pagination & search
    const page = (searchParams.get('page') || 1) as string;
    const pageSize = (searchParams.get('pageSize') || 10) as string;
    const search = (searchParams.get('search') || '') as string;

    const coparates = useAppSelector(selectCoparates);
    const isDark = useAppSelector(selectIsDarkMode);
    const value = useAppSelector(selectCoparateValue);
    
    useEffect(() => {
        dispatch(fetchAllCoparateAsync({page, pageSize, search }));
    }, [search, page, pageSize]);


    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [initialRecords, setInitialRecords] = useState(sortBy(coparates.results, 'first_name'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [date3, setDate3] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState<any>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'first_name',
        direction: 'asc',
    });


    useEffect(() => {
        setRecords(coparates.results);
        setInitialRecords(coparates.results);
    }, [coparates]);

    useEffect(() => {
        const [startDate, endDate] = date3 ? date3.map((date: string | number | Date) => new Date(date)) : [null, null];
        setInitialRecords(() => {
            return coparates.results?.filter((coparate: Coparate) => {
                const itemDate = new Date(coparate.created_at);
                const isInDateRange = startDate && endDate ? (itemDate >= startDate && itemDate <= endDate) : true;
                const matchesSearch = (
                    coparate.email.toLowerCase().includes(search.toLowerCase()) ||
                    coparate.exact_location.toLowerCase().includes(search.toLowerCase()) ||
                    coparate.mobile_number.toLowerCase().includes(search.toLowerCase()) ||
                    coparate.name.toLowerCase().includes(search.toLowerCase()) ||
                    coparate.province.toLowerCase().includes(search.toLowerCase())
                );
                return isInDateRange && matchesSearch;

            });
        });
    }, [activeFilter]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
       

    }, [sortStatus]);

    const deleteRow = async (id: any = null) => {

        const params = new URLSearchParams();

        if (id) {
            const deletionSuccess = await deleteToast(id, deleteCoparate, updateCoparates);
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
            const deletionSuccess = await multiDeleteToast(ids, deleteMultiCoparate, updateCoparates);
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
        <>
            {
                value === 'list' && <div className="panel mt-5 border-white-light px-0 dark:border-[#1b2e4b]">
                    <div className="invoice-table">
                        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
                            <div className="flex flex-wrap items-center justify-around gap-2 pl-3">
                                {selectedRecords.length >= 1 && <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
                                    <DeleteIcon />
                                    Delete
                                </button>}
                                {/* <TicketModal ticketModal={ticketModal} setTicketModal={setTicketModal} /> */}
                            </div>
                            <div className='flex justify-center items-center gap-4'>
                                <Flatpickr
                                    options={{
                                        mode: 'range',
                                        dateFormat: 'd-m-Y',
                                        position: 'auto right',
                                        onClose: (selectedDates, dateStr, instance) => {
                                            setDate3(selectedDates); // Assuming setDate3 is your state updater function
                                            setActiveFilter(!activeFilter)
                                        },

                                    }}
                                    // defaultValue={''}
                                    placeholder="Please select a date range..."
                                    className="form-input w-60"
                                    onChange={(date3: any) => setDate3(date3)}
                                />

                                <CoparateSearchInput search={search} />

                            </div>

                        </div>
                        <div className="pl-1 datatables pagination-padding">
                            <DataTable
                                className={`${isDark} table-hover whitespace-nowrap`}
                                records={records?.map((coparate, index) => ({
                                    ...coparate,
                                    serialNumber: index + 1,
                                }))}
                                columns={[
                                    // {
                                    //     accessor: 'id',
                                    //     sortable: true,
                                    //     render: ({ serialNumber }) => (
                                    //         <Link href="/apps/invoice/preview">
                                    //             <div className="font-semibold text-primary underline hover:no-underline">{`#${serialNumber}`}</div>
                                    //         </Link>
                                    //     ),
                                    // },
                                    {
                                        accessor: 'name',
                                        // sortable: true,
                                        render: ({ name }) => (
                                            <div className="flex items-center font-semibold">
                                                <div className="w-max rounded-full bg-white-dark/30 p-0.5 ltr:mr-2 rtl:ml-2">
                                                    {/* <Image
                                                        width={32}
                                                        height={32}
                                                        className="h-8 w-8 rounded-full object-cover"
                                                        src={profile_pic ? IMG_URL + profile_pic : '/assets/images/profile-pic.png'} alt="customer pic" /> */}
                                                </div>
                                                <div>{name}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'email',
                                        textAlignment: 'center',
                                        // sortable: true,
                                    },
                                    {
                                        accessor: 'exact_location',
                                        // sortable: true,
                                    },
                                    {
                                        accessor: 'courier',
                                        // sortable: true,
                                    },
                                    {
                                        accessor: 'mobile_number',
                                        // sortable: true,
                                    },
                                    {
                                        accessor: 'created_at',
                                        // sortable: true,
                                        render: ({ created_at }) => <span >{formatDate(created_at)}</span>
                                    },
                                    {
                                        accessor: 'action',
                                        title: 'Actions',
                                        sortable: false,
                                        textAlignment: 'center',
                                        render: (coparate) => (
                                            <div className="mx-auto flex w-max items-center gap-4">
                                                <button
                                                    className="flex hover:text-primary"
                                                    onClick={() => { router.push(`/coparate/action?s=r&userId=${coparate.id}`), dispatch(updateCoparateState(coparate)) }}
                                                >
                                                    <PreviewIcon />
                                                </button>
                                                {
                                                    userType === 'Admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => { router.push(`/coparate/action?s=e&userId=${coparate.id}`), dispatch(updateCoparateState(coparate)) }}
                                                                className="flex hover:text-info"
                                                            >
                                                                <EditIcon />
                                                            </button>
                                                            <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(coparate.id)}>
                                                                <DeleteIcon />
                                                            </button>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        ),
                                    },
                                ]}
                                highlightOnHover
                                totalRecords={coparates.count}
                                recordsPerPage={Number(pageSize)}
                                page={Number(page)}
                                onPageChange={(p) => router.push(`?${new URLSearchParams({ page: p.toString(), pageSize: pageSize.toString(), search: search.toString() })}`, { scroll: false })}
                                onRecordsPerPageChange={(ps) => router.push(`?${new URLSearchParams({ page: page.toString(), pageSize: ps.toString(), search: search.toString() })}`, { scroll: false })}
                                recordsPerPageOptions={PAGE_SIZES}
                                sortStatus={sortStatus}
                                onSortStatusChange={setSortStatus}
                                selectedRecords={selectedRecords}
                                onSelectedRecordsChange={setSelectedRecords}
                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                                rowClassName="cursor-pointer"
                                onRowClick={(coparate) => router.push(`/coparate/action?s=r&userId=${coparate.id}`)}
                            />
                        </div>
                    </div>
                </div >
            }
        </>

    );
};

export default CoparateListTable;