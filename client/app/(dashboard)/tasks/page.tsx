import TaskAddEditModal from '@/components/dashboard/TaskAddEditModal';
import TaskMain from '@/components/dashboard/TaskMain';
import TaskSidebar from '@/components/dashboard/TaskSideBar';
import TopPageNavigation from '@/components/shared/TopPageNavigation'
import { PageSearchParams } from '@/types';
import React, { Suspense } from 'react'

export default async function page({ searchParams }: PageSearchParams) {


    return (
        <>
            <TopPageNavigation />

            <div className="relative flex h-full gap-5 mt-4 sm:h-[calc(100vh-160px)]">
                <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                    <TaskSidebar />
                </Suspense>


                <Suspense fallback={<div className="flex h-full items-center justify-center  text-lg font-semibold w-full">Loading...</div>}>
                    <TaskMain searchParams={searchParams} />
                </Suspense>


            </div>


        </>
    )
}
