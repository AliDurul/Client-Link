'use client';
import { formatDate, formUrlQuery } from '@/lib/utility/functions';
import { Kyc, Pagination } from '@/types';
import { LuMousePointerClick } from "react-icons/lu";
// import { DataTable, type DataTableColumn, type DataTableProps, type DataTableSortStatus } from 'mantine-datatable';
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { use, useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsDarkMode } from '@/lib/features/theme/themeSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable, DataTableColumn, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import SearchInput from '@/components/shared/SearchInput';
import { useUrlParams } from '@/hooks/useUrlParams';



// Move outside component to prevent recreation
const PAGE_SIZES = [10, 20, 30, 50, 100]

const DEFAULT_SORT_STATUS: DataTableSortStatus = {
  columnAccessor: 'first_name',
  direction: 'asc',
} as const;

interface KycMainProps {
  customerPromise: Promise<Pagination<Kyc>>;
}

export default function KycMain({ customerPromise, }: KycMainProps) {
  const currentUser = useCurrentUser();
  const { updateUrlParams, getParam } = useUrlParams();
  const router = useRouter();
  const isDark = useAppSelector(selectIsDarkMode);


  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>(DEFAULT_SORT_STATUS);
  const [selectedRecords, setSelectedRecords] = useState<Kyc[]>([]);


  const customers = use(customerPromise);


  // URL parameters with memoization
  const page = getParam('p', '1');
  const pl = getParam('pl', '20');


  // Event handlers with useCallback
  const handleSortStatusChange = (status: DataTableSortStatus) => {
    setSortStatus(status);
    updateUrlParams({
      p: '1',
      sb: status.columnAccessor,
      s: status.direction
    });
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() });
  }

  const handlePageSizeChange = (newPageSize: number) => {
    updateUrlParams({
      pl: newPageSize.toString(),
      page: '1'
    });
  }


  // Action handlers
  const handlePreview = (recordId: string, record: Kyc) => {
    router.push(`/kyc/action?s=r&userId=${recordId}`);
  }

  const handleEdit = (recordId: string, record: Kyc) => {
    if (currentUser?.userInfo?.role !== 'admin') return;
    router.push(`/kyc/action?s=e&userId=${recordId}`);
  }

  const handleDelete = (recordId: string) => {
    if (currentUser?.userInfo?.role !== 'admin') return;
    console.log('Delete record:', recordId);
  };


  const renderActions: DataTableColumn<Kyc>['render'] = (record) => (
    <div className="mx-auto flex w-max items-center gap-4">
      <button
        className="flex hover:text-primary"
      // onClick={() => { router.push(`/kyc/action?s=r&userId=${kyc.id}`), dispatch(updateKycState(kyc)) }}
      >
        <PreviewIcon />
      </button>
      {
        currentUser?.userInfo?.role === 'admin' && (
          <>
            <button
              // onClick={() => { router.push(`/kyc/action?s=e&userId=${kyc.id}`), dispatch(updateKycState(kyc)) }}
              className="flex hover:text-info"
            >
              <EditIcon />
            </button>
            <button type="button" className="flex hover:text-danger"
            // onClick={(e) => deleteRow(kyc.id)}
            >
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
          His office address is {address.street}, {address.city}, {address.state}.
        </p>
      </div>
    ),
  };

  const columns: DataTableProps<Kyc>['columns'] = [
    {
      accessor: 'name',
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
      <div className='flex justify-end items-center gap-4 mb-2'>
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
