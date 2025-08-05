'use client';
import { formatDate } from '@/lib/utility/functions';
import { Kyc, Pagination } from '@/types';
import { LuMousePointerClick } from "react-icons/lu";
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { use, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectIsDarkMode } from '@/lib/features/theme/themeSlice';
import { useRouter } from 'next/navigation';
import type { DataTableColumn, DataTableProps, DataTableSortStatus } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import SearchInput from '@/components/shared/SearchInput';
import { useUrlParams } from '@/hooks/useUrlParams';
import { setKyc } from '@/lib/features/kyc/kycSlice';
import { delKyc } from '@/lib/features/kyc/kycActions';

const PAGE_SIZES = [10, 20, 30, 50, 100]

const DEFAULT_SORT_STATUS: DataTableSortStatus = {
  columnAccessor: 'first_name',
  direction: 'asc',
} as const;

interface KycMainProps {
  customerPromise: Promise<Pagination<Kyc>>;
}

export default function KycMain({ customerPromise, }: KycMainProps) {
  const { userInfo } = useCurrentUser();
  const { updateUrlParams, getParam } = useUrlParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isDark = useAppSelector(selectIsDarkMode);



  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>(DEFAULT_SORT_STATUS);
  const [selectedRecords, setSelectedRecords] = useState<Kyc[]>([]);
  const page = getParam('p', '1');
  const pl = getParam('pl', '20');

  const customers = use(customerPromise);


  // Event handlers
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
  const handlePreview = (record: Kyc) => {
    router.push(`/kyc/action?s=r&id=${record._id}`);
  }

  const handleEdit = (recordId: number) => {
    // if (userInfo?.role !== 'admin') return;
    router.push(`/kyc/action?s=e&id=${recordId}`);
  }

  const handleDelete = async (recordId: number) => {
    // if (userInfo?.role !== 'admin') return;
    const res = await delKyc(recordId)
    console.log('delete response:', res);
  };


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
            <button type="button" className="flex hover:text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(record._id); }}>
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
      <div className='flex justify-between items-center md:flex-row md:items-center mb-3'>
        <div className="flex flex-wrap items-center justify-around gap-2 pl-3">
          {
            selectedRecords.length >= 1 &&
            <button type="button" className="btn btn-danger gap-2" >
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
