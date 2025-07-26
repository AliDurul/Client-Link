'use client';

import { CompletedIcon, HamburgerIcon, InboxIcon, InProgressIcon, PendingIcon, TrashIcon } from '@/icons/Task';
import { getCountDetail } from '@/lib/features/task/taskActions';
import { selectIsShowTaskMenu, setAddTaskModal, setIsShowTaskMenu } from '@/lib/features/task/taskSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utility/functions';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';
import useSWR from 'swr'

type StatusKey = 'all' | 'High' | 'In-Progress' | 'Pending' | 'Completed' | 'Cancelled';
interface IStatusBtn {
    key: StatusKey;
    label: string;
    icon: React.ReactNode;
    hideCount?: boolean;
}

const TaskSidebar = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const qStatus = searchParams.get('qs') || 'all';
    const qPriority = searchParams.get('qp') || '';
    const isShowTaskMenu = useAppSelector(selectIsShowTaskMenu);
    const dispatch = useAppDispatch();



    const { data: countData, isLoading } = useSWR('task-counts', getCountDetail);


    const countDetail = countData?.success ? countData.count.status : {
        all: 0,
        'In-Progress': 0,
        Pending: 0,
        Completed: 0,
        Cancelled: 0
    };


    const addEditTask = () => {
        dispatch(setAddTaskModal(true));
    };


    const handleStatusFilter = (newStatus: string) => {
        let newUrl = ''

        if (newStatus === 'all') {
            // Remove both 'qs' and 'page' when selecting 'all'
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['qs', 'page']
            });
        } else {
            // First remove page, then set new status
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['page']
            });

            newUrl = formUrlQuery({
                params: newUrl,
                key: 'qs',
                value: newStatus
            });
        }
        router.replace(newUrl, { scroll: false });
    };

    const handlePriorityFilter = (newPriority: string) => {
        const isSamePriority = qPriority === newPriority;
        let newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['page']
        });

        newUrl = formUrlQuery({
            params: newUrl,
            key: 'qp',
            value: isSamePriority ? null : newPriority
        });
        router.replace(newUrl, { scroll: false });

    };


    const tabChanged = () => {
        dispatch(setIsShowTaskMenu(false));
    };

    // Status buttons configuration
    const statusButtons: IStatusBtn[] = [
        {
            key: 'all',
            label: 'All',
            icon: <InboxIcon />,
        },
        {
            key: 'In-Progress',
            label: 'In Progress',
            icon: <InProgressIcon />,
        },
        {
            key: 'Pending',
            label: 'Pending',
            icon: <PendingIcon />,
        },
        {
            key: 'Completed',
            label: 'Done',
            icon: <CompletedIcon />,
        },
        {
            key: 'Cancelled',
            label: 'Trash',
            icon: <TrashIcon />,
            hideCount: true
        }
    ];

    // Priority buttons configuration
    const priorityButtons = [
        {
            key: 'Low',
            label: 'Low',
            color: 'text-warning',
            fillColor: 'fill-warning'
        },
        {
            key: 'Medium',
            label: 'Medium',
            color: 'text-success',
            fillColor: 'fill-success'
        },
        {
            key: 'High',
            label: 'High',
            color: 'text-danger',
            fillColor: 'fill-danger'
        }
    ];

    return (
        <div className={`panel absolute z-10 hidden h-full w-[240px] max-w-full flex-none space-y-4 p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${isShowTaskMenu && '!block'} `}>
            <div className="flex h-full flex-col pb-16">
                <div className="pb-5">
                    <div className="flex items-center text-center">
                        <div>
                            <HamburgerIcon />
                        </div>
                        <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Todo list</h3>
                    </div>
                </div>
                <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                <PerfectScrollbar className="relative -mr-3.5 h-full grow pr-3.5 ">
                    <div className="space-y-1">
                        {/* Status Buttons */}
                        {statusButtons.map((button) => (
                            <button
                                key={button.key}
                                type="button"
                                className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary ${qStatus === button.key ? 'bg-gray-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''
                                    }`}
                                onClick={() => {
                                    tabChanged();
                                    handleStatusFilter(button.key);
                                }}
                            >
                                <div className="flex items-center">
                                    {button.icon}
                                    <div className="ltr:ml-3 rtl:mr-3">{button.label}</div>
                                </div>
                                {!button.hideCount && (
                                    <div className={`whitespace-nowrap rounded-md bg-primary-light py-0.5 px-2 font-semibold dark:bg-[#060818] ${isLoading ? 'animate-pulse w-6 h-5 ' : ''}`}>
                                        {isLoading ? '' : countDetail[button.key.toLowerCase()] || 0}
                                    </div>
                                )}
                            </button>
                        ))}

                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                        <div className="px-1 py-3 text-white-dark">Priorities</div>

                        {/* Priority Buttons */}
                        {priorityButtons.map((button) => (
                            <button
                                key={button.key}
                                type="button"
                                className={`flex h-10 w-full items-center rounded-md p-1 font-medium ${button.color} duration-300 hover:bg-white-dark/10 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${qPriority === button.key && 'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                                    }`}
                                onClick={() => {
                                    tabChanged();
                                    handlePriorityFilter(button.key);
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 rotate-45 ${button.fillColor}`}>
                                    <path
                                        d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                <div className="ltr:ml-3 rtl:mr-3">{button.label}</div>
                            </button>
                        ))}
                    </div>
                </PerfectScrollbar>
                <div className="absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0">
                    <button className="btn btn-primary w-full" type="button" onClick={() => addEditTask()}>
                        <svg className="h-5 w-5 ltr:mr-2 rtl:ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add New Task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskSidebar