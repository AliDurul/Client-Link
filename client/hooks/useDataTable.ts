'use client';
import { useState, useEffect, startTransition, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUrlParams } from '@/hooks/useUrlParams';
import { selectIsDarkMode } from '@/lib/features/theme/themeSlice';
import { DataTableSortStatus } from 'mantine-datatable';
import toast from 'react-hot-toast';

export const PAGE_SIZES = [10, 20, 30, 50, 100];

interface UseDataTableConfig<T> {
    defaultSortAccessor?: string;
    defaultSortDirection?: 'asc' | 'desc';
    deleteAction?: (_: unknown, id: number) => Promise<any>;
    deleteMultiAction?: (_: unknown, ids: number[]) => Promise<any>;
    // editRoute?: string;
    // previewRoute?: string;
}

export function useDataTable<T extends { _id: number }>(config: UseDataTableConfig<T> = {}) {
    const {
        defaultSortAccessor = 'first_name',
        defaultSortDirection = 'asc',
        deleteAction,
        deleteMultiAction,
        // editRoute,
        // previewRoute,
    } = config;

    // Core hooks
    const { userInfo } = useCurrentUser();
    const { updateUrlParams, getParam } = useUrlParams();
    const router = useRouter();
    const isDark = useAppSelector(selectIsDarkMode);

    // State
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: defaultSortAccessor,
        direction: defaultSortDirection,
    });
    const [selectedRecords, setSelectedRecords] = useState<T[]>([]);
    const [expandedRecordIds, setExpandedRecordIds] = useState<unknown[]>([]);

    // URL params
    const page = getParam('p', '1');
    const pageLimit = getParam('pl', '20');

    // Action states (only if actions are provided)
    const [stateSingle, actionSingle, isPendingSingle] = useActionState(
        deleteAction || (async (_: unknown, __: any) => Promise.resolve(null)),
        null
    );
    const [stateMulti, actionMulti, isPendingMulti] = useActionState(
        deleteMultiAction || (async (_: unknown, __: any) => Promise.resolve(null)),
        null
    );

    // Pagination and sorting handlers
    const handleSortStatusChange = (status: DataTableSortStatus) => {
        setSortStatus(status);
        updateUrlParams({
            p: '1',
            sb: status.columnAccessor,
            s: status.direction,
        });
    };

    const handlePageChange = (newPage: number) => {
        updateUrlParams({ p: newPage.toString() });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        updateUrlParams({
            pl: newPageSize.toString(),
            p: '1',
        });
    };

    // Action handlers
    const handleEdit = (url: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        router.push(url);
    };

    const handlePreview = (url: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        router.push(url);
    };

    const handleDelete = async (recordId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!deleteAction) return;
        startTransition(() => {
            actionSingle(recordId);
        });
    };

    const handleMultiDelete = async () => {
        if (selectedRecords.length === 0 || !deleteMultiAction) return;
        const ids = selectedRecords.map(record => record._id);

        startTransition(() => {
            actionMulti(ids);
        });
    };

    // Effects for handling action results
    useEffect(() => {
        if (stateSingle) {
            toast[stateSingle?.success ? 'success' : 'error'](
                stateSingle?.message || 'Operation completed'
            );
        }
    }, [stateSingle]);

    useEffect(() => {
        if (stateMulti) {
            toast[stateMulti?.success ? 'success' : 'error'](
                stateMulti?.message || 'Operation completed'
            );
            if (stateMulti?.success) {
                setSelectedRecords([]);
            }
        }
    }, [stateMulti]);

    // Common table props
    const getTableProps = () => ({
        className: `${isDark} table-hover whitespace-nowrap`,
        minHeight: 400,
        withBorder: false,
        highlightOnHover: true,
        recordsPerPage: pageLimit ? parseInt(pageLimit, 10) : 20,
        page: page ? parseInt(page, 10) : 1,
        fontSize: 'sm' as const,
        onPageChange: handlePageChange,
        onRecordsPerPageChange: handlePageSizeChange,
        recordsPerPageOptions: PAGE_SIZES,
        sortStatus,
        onSortStatusChange: handleSortStatusChange,
        selectedRecords,
        onSelectedRecordsChange: setSelectedRecords,
        paginationText: ({ from, to, totalRecords }: { from: number; to: number; totalRecords: number }) =>
            `Showing ${from} to ${to} of ${totalRecords} entries`,
    });

    // Row expansion helper
    const getRowExpansionProps = () => ({
        allowMultiple: true,
        expanded: {
            recordIds: expandedRecordIds,
            onRecordIdsChange: setExpandedRecordIds,
        },
    });

    return {
        // State
        selectedRecords,
        setSelectedRecords,
        expandedRecordIds,
        setExpandedRecordIds,
        sortStatus,
        setSortStatus,

        // Computed values
        page: page ? parseInt(page, 10) : 1,
        pageLimit: pageLimit ? parseInt(pageLimit, 10) : 20,
        userInfo,
        isDark,

        // Loading states
        isPendingSingle,
        isPendingMulti,

        // Handlers
        handleSortStatusChange,
        handlePageChange,
        handlePageSizeChange,
        handleEdit,
        handlePreview,
        handleDelete,
        handleMultiDelete,

        // Utilities
        getTableProps,
        getRowExpansionProps,
        PAGE_SIZES,
    };
}
