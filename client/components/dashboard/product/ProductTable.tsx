'use client';
import { useDataTable } from '@/hooks/useDataTable';
import { delData, delMultiData } from '@/lib/features/shared/actionUtils';
import { Pagination, Product } from '@/types';
import { DataTable, DataTableColumn, DataTableProps } from 'mantine-datatable';
import { LuMousePointerClick } from 'react-icons/lu';
import React, { use } from 'react'
import { DeleteIcon, EditIcon, PreviewIcon } from '@/icons';
import { truncateText } from '@/lib/utility/functions';
import { selectProductModal, setProduct, setProductModal } from '@/lib/features/products/productSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import ProductModal from './ProductModal';

interface ProductTableProps {
    products: Pagination<Product>;
}

export default function ProductTable({ products }: ProductTableProps) {

    const dispatch = useAppDispatch();


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
    } = useDataTable<Product>({
        deleteAction: delData,
        deleteMultiAction: delMultiData,
    });




    // Data table 

    const renderActions: DataTableColumn<Product>['render'] = (record) => (
        <div className="mx-auto flex w-max items-center gap-4">
            <button
                onClick={(e) => { handlePreview(`products/${record._id}`, e); }}

                className="flex hover:text-primary">
                <PreviewIcon />
            </button>
            {
                userInfo?.role !== 'admin' && (
                    <>
                        <button className="flex hover:text-info"
                            onClick={() => { dispatch(setProductModal(true)); dispatch(setProduct(record)) }}>
                            <EditIcon />
                        </button>
                        <button
                            type="button"
                            className="flex hover:text-danger"
                            disabled={isPendingSingle}
                            onClick={(e) => { handleDelete({ url: 'products', id: record._id }, e); }}>
                            <DeleteIcon />
                        </button>
                    </>
                )
            }
        </div>
    );

    const columns: DataTableProps<Product>['columns'] = [
        {
            accessor: 'name',
            title: 'Product Name',
            sortable: true,
            render: ({ name }) => `${name}`,
        },
        {
            accessor: 'is_active',
            title: 'Is Public',
            sortable: true,
            render: ({ is_active }) => <span className={`badge ${is_active ? 'bg-success' : 'bg-dark'}`}>{is_active ? 'Yes' : 'No'}</span>,
        },
        {
            accessor: 'description',
            sortable: true,
            render: ({ description }) => <span>{truncateText(description, 10)}</span>,
        },
        {
            accessor: 'category',
            sortable: true,
            render: ({ category }) => <span>{category}</span>,
        },

        {
            accessor: 'price',
            sortable: true,
            render: ({ price }) => <span>{price}</span>,
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
        <div className="panel datatables pagination-padding">
            <DataTable
                {...getTableProps()}
                // rowExpansion={rowExpansion}
                records={products?.result || []}
                columns={columns}
                totalRecords={products?.details.totalRecords || 0}
                idAccessor="_id"
            />
          
        </div>
    )
}
