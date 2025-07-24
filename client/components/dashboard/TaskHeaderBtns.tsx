'use client';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utility/functions';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function TaskHeaderBtns() {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');

    useEffect(() => {

        const delayBounceFn = setTimeout(() => {

            let newUrl = '';

            if (query) {
                newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'query',
                    value: query
                });
            } else {
                newUrl = removeKeysFromQuery({
                    params: searchParams.toString(),
                    keysToRemove: ['query']
                });
            }

            router.push(newUrl, { scroll: false });
        }, 500);


        return () => clearTimeout(delayBounceFn)

    }, [query, searchParams, router])


    return (
        <div className='flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center'>
            <div className="flex items-center ltr:mr-3 rtl:ml-3">
                <button
                    type="button" className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                    // onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
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
                        // onKeyUp={() => searchTasks()}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5"></circle>
                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            {/* <div className="flex flex-1 items-center justify-center sm:flex-auto sm:justify-end">
                <p className="ltr:mr-3 rtl:ml-3">{pager.startIndex + 1 + '-' + (pager.endIndex + 1) + ' of ' + filteredTasks.length}</p>
                <button
                    type="button"
                    disabled={pager.currentPage === 1}
                    className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                    onClick={() => {
                        pager.currentPage--;
                        searchTasks(false);
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr:rotate-180">
                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button
                    type="button"
                    disabled={pager.currentPage === pager.totalPages}
                    className="rounded-md bg-[#f4f4f4] p-1 enabled:hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30"
                    onClick={() => {
                        pager.currentPage++;
                        searchTasks(false);
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div> */}
        </div>
    )
}
