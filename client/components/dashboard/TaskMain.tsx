import React, { Suspense } from 'react'
import TaskHeaderBtns from './TaskHeaderBtns';
import TaskTable from './TaskTable';
import { getAllData } from '@/lib/features/shared/actionUtils';
import { PageSearchParams } from '@/types';

export default async function TaskMain({ searchParams }: PageSearchParams) {


    const params = await searchParams;
    const query = params.q || '';
    const page = params.page || '1';
    const status = params.qs || '';
    const priority = params.qp || '';


    const tasks = await getAllData({
        url: 'tasks/',
        searchQueries: { title: query },
        filterQueries: { status, priority },
        customQuery: { page }
    });


    return (
        <div className="panel h-full flex-1 overflow-auto p-0">
            <div className="flex h-full flex-col">
                <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                    <TaskHeaderBtns details={tasks.details} />
                </Suspense>
                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
                    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                        <TaskTable tasks={tasks.result} />
                    </Suspense>
                </div>

            </div>

        </div>
    )
}
