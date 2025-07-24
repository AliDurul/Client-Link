import TaskListBody from '@/components/dashboard/TaskBody';
import TaskHeaderBtns from '@/components/dashboard/TaskHeaderBtns';
import TaskMain from '@/components/dashboard/TaskMain';
import TaskSidebar from '@/components/dashboard/TaskSideBar';
import TopPageNavigation from '@/components/shared/TopPageNavigation'
import { getAllData } from '@/lib/features/shared/actionUtils';
import React from 'react'

type HomePageParams = { searchParams: Promise<{ [key: string]: string | undefined }> }
export default async function page({ searchParams }: HomePageParams) {

    const params = await searchParams;
    const query = params.query || '';
    const page = params.page || '1';
    const status = params.tab || '';
    const priority = params.priority || '';


    const tasks = await getAllData({
        url: 'tasks/',
        searchQueries: { title: query },
        filterQueries: { status, priority },
        customQuery: { page }
    });


    return (
        <>
            <TopPageNavigation />

            <TaskMain
                tasks={tasks}
            />

        </>
    )
}
