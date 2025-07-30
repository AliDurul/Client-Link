import TaskAddEditModal from '@/components/dashboard/TaskAddEditModal';
import TaskMain from '@/components/dashboard/TaskMain';
import TaskSidebar from '@/components/dashboard/TaskSideBar';
import TopPageNavigation from '@/components/shared/TopPageNavigation'
import React, { Suspense } from 'react'

type HomePageParams = { searchParams: Promise<{ [key: string]: string | undefined }> }
export default async function page({ searchParams }: HomePageParams) {


    return (
        <>
            <TopPageNavigation />

            <div className="relative flex h-full gap-5 mt-4 sm:h-[calc(100vh-160px)]">
                <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                    <TaskSidebar />
                </Suspense>

                {/* <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div> */}

                <Suspense fallback={<div className="flex h-full items-center justify-center  text-lg font-semibold w-full">Loading...</div>}>
                    <TaskMain searchParams={searchParams} />
                </Suspense>


                {/* <SelectedTaskModal setViewTaskModal={setViewTaskModal} viewTaskModal={viewTaskModal} selectedTask={selectedTask} /> */}
            </div>

        </>
    )
}
