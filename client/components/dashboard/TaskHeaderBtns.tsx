'use client';
import { selectIsShowTaskMenu, setIsShowTaskMenu } from '@/lib/features/task/taskSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utility/functions';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

interface Pages {
    previous: boolean;
    current: number;
    next: number;
    total: number;
}

interface TaskDetails {
    limit: number;
    page: number;
    totalRecords: number;
    pages: Pages | false;
}

export default function TaskHeaderBtns({ details }: { details: TaskDetails }) {
    const router = useRouter();
    const isShowTaskMenu = useAppSelector(selectIsShowTaskMenu);
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const [query, setQuery] = useState('');

    // Initialize query state from URL params
    useEffect(() => {
        const urlQuery = searchParams.get('query') || '';
        setQuery(urlQuery);
    }, []); // Only run on mount


    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            let newUrl = '';

            if (query) {
                // Remove page when searching to start from page 1
                const paramsWithoutPage = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['page']
                });

                newUrl = formUrlQuery({
                    params: paramsWithoutPage,
                    key: 'query',
                    value: query
                });
            } else {
                // Only remove query and page if query is actually empty
                // and there was a query in the URL before
                if (searchParams.get('query')) {
                    newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['query', 'page']
                    });
                } else {
                    return; // Don't update URL if there's no query to remove
                }
            }

            router.replace(newUrl, { scroll: false });
        }, 500);

        return () => clearTimeout(delayBounceFn);

    }, [query]); // Only depend on query changes, not searchParams


    const getPaginationText = (details: TaskDetails | undefined) => {
        if (!details || details.totalRecords === 0) {
            return '0-0 of 0';
        }

        const startRecord = Math.max(1, (details.page - 1) * details.limit + 1);
        const endRecord = Math.min(details.page * details.limit, details.totalRecords);

        return `${startRecord}-${endRecord} of ${details.totalRecords}`;
    };

    // Type guard function
    const hasValidPagination = (pages: Pages | boolean | undefined): pages is Pages => {
        return pages !== undefined && pages !== false && typeof pages === 'object';
    };

    const handlePreviousPage = () => {
        if (!hasValidPagination(details?.pages) || details.pages.current <= 1) {
            return;
        }

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: (details.pages.current - 1).toString()
        });

        router.replace(newUrl, { scroll: false });
    };

    const handleNextPage = () => {
        if (!hasValidPagination(details?.pages) || details.pages.current >= details.pages.total) {
            return;
        }

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: (details.pages.current + 1).toString()
        });

        router.replace(newUrl, { scroll: false });
    };

    // Simplified button conditions
    const isPreviousDisabled = !hasValidPagination(details?.pages) || details.pages.current <= 1;
    const isNextDisabled = !hasValidPagination(details?.pages) || details.pages.current >= details.pages.total;

    return (
        <div className='flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center'>
            <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button
                    type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                    onClick={() => dispatch(setIsShowTaskMenu(!isShowTaskMenu))}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
                <div className="group relative flex-1">
                    <input
                        type="text"
                        className="peer form-input ltr:!pr-10 rtl:!pl-10"
                        placeholder="Search Task..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                <p className="ltr:mr-3 rtl:ml-3">
                    {getPaginationText(details)}
                </p>
                <button
                    type="button"
                    disabled={isPreviousDisabled}
                    className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                    onClick={handlePreviousPage}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:rotate-180">
                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    type="button"
                    disabled={isNextDisabled}
                    className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                    onClick={handleNextPage}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div >
    )
}
