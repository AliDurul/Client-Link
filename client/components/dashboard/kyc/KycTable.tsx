'use client';
import { formatDate } from '@/lib/utility/functions';
import { Kyc, Pagination } from '@/types';
import { LuMousePointerClick } from "react-icons/lu";
import Image from 'next/image';
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { use } from 'react';
import type { DataTableColumn, DataTableProps } from 'mantine-datatable';
import { DataTable } from 'mantine-datatable';
import SearchInput from '@/components/shared/SearchInput';
import { delKyc, delMultiKyc } from '@/lib/features/kyc/kycActions';
import { useDataTable } from '@/hooks/useDataTable';

interface KycMainProps {
  customerPromise: Promise<Pagination<Kyc>>;
}

export default function KycTable({ customerPromise, }: KycMainProps) {
  const customers = use(customerPromise);

  const {
    selectedRecords,
    userInfo,
    isPendingSingle,
    isPendingMulti,
    handleEdit,
    handlePreview,
    handleDelete,
    handleMultiDelete,
    getTableProps,
    getRowExpansionProps,
  } = useDataTable<Kyc>({
    deleteAction: delKyc,
    deleteMultiAction: delMultiKyc,
  });


  // Data table 

  const renderActions: DataTableColumn<Kyc>['render'] = (record) => (
    <div className="mx-auto flex w-max items-center gap-4">
      <button
        className="flex hover:text-primary"
        onClick={(e) => { handlePreview(`/kyc/action/?s=r&id=${record._id}`, e); }}
      >
        <PreviewIcon />
      </button>
      {
        userInfo?.role !== 'admin' && (
          <>
            <button
              className="flex hover:text-info"
              onClick={(e) => { handleEdit(`/kyc/action/?s=e&id=${record._id}`, e); }}
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="flex hover:text-danger"
              disabled={isPendingSingle}
              onClick={(e) => { handleDelete(record._id, e); }}>
              <DeleteIcon />
            </button>
          </>
        )
      }
    </div>
  );

  const rowExpansion: DataTableProps<Kyc>['rowExpansion'] = {
    ...getRowExpansionProps(),
    content: ({ record: { full_name, assigned_agent, address, profile_pic, phone_number } }) => (
      <div className='flex items-center gap-4'>
        <Image
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
          src={profile_pic ? profile_pic : '/assets/images/profile-pic.png'} alt="profile picture" />
        <p>
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
            <button
              type="button"
              className="btn btn-danger gap-2"
              onClick={handleMultiDelete} disabled={isPendingMulti}
            >
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
        {...getTableProps()}
        rowExpansion={rowExpansion}
        records={customers?.result || []}
        columns={columns}
        totalRecords={customers?.details.totalRecords || 0}
        idAccessor="_id"
      />
    </div>
  )
}
