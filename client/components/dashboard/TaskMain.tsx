import React from 'react'
import TaskHeaderBtns from './TaskHeaderBtns';
import TaskTable from './TaskTable';
import { getAllData } from '@/lib/features/shared/actionUtils';

export default async function TaskMain({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {


    const params = await searchParams;
    const query = params.query || '';
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
                <TaskHeaderBtns details={tasks.details} />
                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                {tasks.result.length ? (
                    <div className="table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]">
                        <TaskTable tasks={tasks.result} />
                    </div>
                ) : (
                    <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">No data available</div>
                )}
            </div>
        </div>
    )
}
