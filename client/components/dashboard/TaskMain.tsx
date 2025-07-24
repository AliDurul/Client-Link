'use client';
import React from 'react'
import TaskSidebar from './TaskSideBar'
import TaskHeaderBtns from './TaskHeaderBtns';
import TaskListBody from './TaskBody';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/lib/utility/functions';

interface TaskMainProps {
    tasks: any;
}


export default function TaskMain({ tasks }: TaskMainProps) {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'all';



    return (
        <div className="relative flex h-full gap-5 mt-4 sm:h-[calc(100vh_-_150px)]">
            <TaskSidebar
                setIsShowTaskMenu={() => { }}
                isShowTaskMenu={false}
                tasks={tasks}
                addEditTask={() => { }}
            />

            {/* <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`} onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}></div> */}


            <div className="panel h-full flex-1 overflow-auto p-0">
                <div className="flex h-full flex-col">
                    <TaskHeaderBtns />

                    <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                    {tasks.result.length ? (
                        <TaskListBody
                            pagedTasks={tasks.result}
                            filteredTasks={tasks.result}
                            setSelectedTask={() => { }}
                            setViewTaskModal={() => { }}
                            searchTasks={() => { }}
                            addEditTask={() => { }}
                        />
                    ) : (
                        <div className="flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]">No data available</div>
                    )}
                </div>
            </div>

            {/* <TaskAddEditModal addTaskModal={addTaskModal} setAddTaskModal={setAddTaskModal} setParams={setParams} params={params} /> */}

            {/* <SelectedTaskModal setViewTaskModal={setViewTaskModal} viewTaskModal={viewTaskModal} selectedTask={selectedTask} /> */}
        </div>
    )
}
