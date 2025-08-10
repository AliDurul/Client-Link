'use client';
import { useActionState, useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Select, { SingleValue } from 'react-select';
import { taskCrUpAction } from '@/lib/features/task/taskActions';
import { selectAddTaskModal, selectTask, setAddTaskModal } from '@/lib/features/task/taskSlice';
import FormErrMsg from '../../shared/FormErrMsg';
import useSWR from 'swr';
import { getAllData } from '@/lib/features/shared/actionUtils';
import { mutate } from 'swr';


interface AgentOption {
    label: string;
    value: string;
}

interface TaskParams {
    _id?: number | undefined;
    title: string;
    assigned_agent: number | string;
    priority: string;
    description: string;
}

const PRIORITY_OPTIONS = [
    { value: '', label: 'Select Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
] as const;

const TaskAddEditModal = () => {

    const [state, action, isPending] = useActionState(taskCrUpAction, null);
    const addTaskModal = useAppSelector(selectAddTaskModal);
    const task = useAppSelector(selectTask)
    const dispatch = useAppDispatch();
    const [agentOptions, setAgentOptions] = useState<AgentOption[]>([]);

    const [params, setParams] = useState<TaskParams>({
        _id: task?._id || undefined,
        title: task?.title || '',
        assigned_agent: task?.assigned_agent ? task.assigned_agent._id : '',
        priority: task?.priority || '',
        description: task?.description || '',
    });

    const { data: usersData, isLoading: usersLoading } = useSWR('users', () => getAllData({ url: 'users/'}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onSuccess: (data) => {
            setAgentOptions(data?.result.map((user: any) => ({ label: user.full_name, value: user._id })) || []);
        }
    });

    useEffect(() => {
        if (state?.inputs) {
            setParams(prev => ({
                ...prev,
                ...state.inputs
            }));
        }

        if (state?.success) {
            mutate('task-counts');

            const timer = setTimeout(() => {
                dispatch(setAddTaskModal(false));
                setParams({
                    _id: undefined,
                    title: '',
                    assigned_agent: '',
                    priority: '',
                    description: '',
                });
            }, 1000);

            return () => clearTimeout(timer);
        }

    }, [state]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleAgentChange = (selectedOption: SingleValue<AgentOption>) => {
        setParams(prev => ({
            ...prev,
            assigned_agent: selectedOption?.value || ''
        }));
    };

    const handleCancel = () => {
        dispatch(setAddTaskModal(false));
        setParams({
            _id: undefined,
            title: '',
            assigned_agent: '',
            priority: '',
            description: '',
        });
    };

    const selectedAgent = agentOptions.find(option => option.value === params.assigned_agent);

    return (
        <Dialog as="div" open={addTaskModal} onClose={() => dispatch(setAddTaskModal(false))} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center px-4 py-8">
                    <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                            {params._id ? 'Edit Task' : 'Add Task'}
                        </div>
                        {
                            state?.message && (
                                <div className={`p-3 ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-md mb-4 `}>
                                    {state.message}
                                </div>
                            )
                        }
                        <div className="p-5">
                            <form action={action}>
                                <input type="hidden" name="id" value={params._id} />

                                <div className="mb-5">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name='title'
                                        placeholder="Enter Task Title"
                                        className="form-input"
                                        value={params.title}
                                        onChange={handleInputChange} />
                                    {
                                        state?.errors?.title && <FormErrMsg error={state.errors.title} />
                                    }
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="assigned_agent">Assignee</label>
                                    {
                                        usersLoading ? (
                                            <div className="flex items-center justify-center h-10">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                                            </div>
                                        ) : <>
                                            <Select
                                                placeholder="Select The Agent"
                                                options={agentOptions}
                                                value={selectedAgent}
                                                onChange={handleAgentChange}
                                                className="flex-1"
                                                isClearable
                                            />
                                            <input
                                                type="hidden"
                                                name="assigned_agent"
                                                value={params.assigned_agent}
                                            />
                                        </>
                                    }

                                    {
                                        state?.errors?.assigned_agent && <FormErrMsg error={state.errors.assigned_agent} />
                                    }
                                </div>
                                <div className="mb-5">
                                    <label className='block text-sm font-medium mb-2' htmlFor="priority">Priority</label>

                                    <select name='priority' id="priority" className="form-select" value={params.priority} onChange={handleInputChange}>
                                        {PRIORITY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {
                                        state?.errors?.priority && <FormErrMsg error={state.errors.priority} />
                                    }
                                </div>
                                <div className="mb-5 ">
                                    <label>Description</label>
                                    <div className="mb-2">
                                        <textarea
                                            id="description"
                                            name='description'
                                            placeholder="Enter Task Description"
                                            className="form-textarea"
                                            rows={5}
                                            value={params.description}
                                            onChange={handleInputChange}
                                        />

                                        {
                                            state?.errors?.description && <FormErrMsg error={state.errors.description} />
                                        }
                                    </div>
                                    <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                        <button type="button" className="btn btn-outline-danger" onClick={handleCancel}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" disabled={isPending}>
                                            {params._id ? 'Update' : isPending ? 'Loading...' : 'Add Task'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default TaskAddEditModal