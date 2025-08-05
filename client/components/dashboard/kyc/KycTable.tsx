'use client';
import { formatDate } from '@/lib/utility/functions';
import { Kyc, Pagination } from '@/types';
import { LuMousePointerClick } from "react-icons/lu";
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { startTransition, use, useActionState, useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsDarkMode } from '@/lib/features/theme/themeSlice';
import { useRouter } from 'next/navigation';
import type { DataTableColumn, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import SearchInput from '@/components/shared/SearchInput';
import { useUrlParams } from '@/hooks/useUrlParams';
import { delKyc, delMultiKyc } from '@/lib/features/kyc/kycActions';
import toast from 'react-hot-toast';

const PAGE_SIZES = [10, 20, 30, 50, 100]

const DEFAULT_SORT_STATUS: DataTableSortStatus = {
  columnAccessor: 'first_name',
  direction: 'asc',
} as const;

interface KycMainProps {
  customerPromise: Promise<Pagination<Kyc>>;
}

export default function KycTable({ customerPromise, }: KycMainProps) {
  const { userInfo } = useCurrentUser();
  const { updateUrlParams, getParam } = useUrlParams();
  const router = useRouter();
  const isDark = useAppSelector(selectIsDarkMode);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>(DEFAULT_SORT_STATUS);
  const [selectedRecords, setSelectedRecords] = useState<Kyc[]>([]);
  const page = getParam('p', '1');
  const pl = getParam('pl', '20');

  const customers = use(customerPromise);


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


  // Action handlers
  const [stateSing, actionSing, isPendingSing] = useActionState(delKyc, null);
  const [stateMulti, actionMulti, isPendingMulti] = useActionState(delMultiKyc, null);

  const handlePreview = (record: Kyc) => {
    router.push(`/kyc/action?s=r&id=${record._id}`);
  }

  const handleEdit = (recordId: number) => {
    // if (userInfo?.role !== 'admin') return;
    router.push(`/kyc/action?s=e&id=${recordId}`);
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

  const renderActions: DataTableColumn<Kyc>['render'] = (record) => (
    <div className="mx-auto flex w-max items-center gap-4">
      <button className="flex hover:text-primary" onClick={(e) => { e.stopPropagation(); handlePreview(record); }}>
        <PreviewIcon />
      </button>
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

  const rowExpansion: DataTableProps<Kyc>['rowExpansion'] = {
    allowMultiple: true,
    content: ({ record: { full_name, assigned_agent, address, profile_pic, phone_number } }) => (
      <div className='flex items-center gap-4'>
        <Image
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          src={profile_pic ? profile_pic : '/assets/images/profile-pic.png'} alt="profile picture" />
        <p >
          {full_name}, phone number is {phone_number} and assigned agent is {assigned_agent}.
          <br />
          His office address is {address?.street}, {address?.city}, {address?.state}.
        </p>
      </div>
    ),
  };

  const columns: DataTableProps<Kyc>['columns'] = [
    {
      accessor: 'first_name',
      title: 'Full Name',
      sortable: true,
      render: ({ full_name }) => `${full_name}`,
    },
    {
      accessor: 'email',
      sortable: true,
    },
    {
      accessor: 'address.country',
      title: 'Country',
      sortable: true,
    },
    {
      accessor: 'dob',
      title: 'Date of Birth',
      render: ({ dob }) => <span >{formatDate(dob ?? null)}</span>,
      sortable: true,
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

    <div className="pl-1 datatables pagination-padding">
      {/* Loading Overlay */}
      {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Processing...</p>
        </div>
      </div> */}


      <div className='flex justify-between items-center md:flex-row md:items-center mb-3'>
        <div className="flex flex-wrap items-center justify-around gap-2 pl-3">
          {
            selectedRecords.length >= 1 &&
            <button type="button" className="btn btn-danger gap-2" onClick={handleMultiDelete} disabled={isPendingMulti} >
              <DeleteIcon />
              Delete
            </button>
          }
          {/* <TicketModal ticketModal={ticketModal} setTicketModal={setTicketModal} /> */}
        </div>
        {/* <Flatpickr
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
        /> */}

        <SearchInput />

      </div>
      <DataTable
        className={`${isDark} table-hover whitespace-nowrap`}
        rowExpansion={rowExpansion}
        minHeight={400}
        records={customers?.result || []}
        withBorder={false}
        columns={columns}
        highlightOnHover
        totalRecords={customers?.details.totalRecords || 0}
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
  )
}
