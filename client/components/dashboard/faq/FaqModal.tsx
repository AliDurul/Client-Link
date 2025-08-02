'use client'
import React, { useActionState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectFaq, selectFaqModal, setFaqModal } from '@/lib/features/faq/faqSlice';
import { faqCrUpAction } from '@/lib/features/faq/faqActions';
import { coloredToast } from '@/lib/utility/sweetAlerts';
import InputBox from '../../shared/InputBox';

interface IinitialValues {
    success: boolean;
    message: string;
    // errors?: {
    //     question?: string[];
    //     answer?: string[];
    // };
    // inputs: {
    //     question: string;
    //     answer: string;
    // };
}

const initialState: IinitialValues = {
    success: false,
    message: '',
    // inputs: { question: '', answer: '' }
}
export default function FaqModal() {
    const dispatch = useAppDispatch();
    const faqModal = useAppSelector(selectFaqModal)
    const faq = useAppSelector(selectFaq)
    const [initialValues, setinitialValues] = useState(faq)
    const [state, action, isPending] = useActionState(faqCrUpAction, initialState);

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                dispatch(setFaqModal(false));
            }
        }
    }, [state]);

    useEffect(() => {
        setinitialValues(faq)
    }, [faq])

    return (
        <>
            <Dialog as="div" open={faqModal} onClose={() => dispatch(setFaqModal(false))} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <DialogPanel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                            <button
                                type="button"
                                onClick={() => dispatch(setFaqModal(false))}
                                className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                            >
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
                            <DialogTitle as="h3" className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                Add New Question
                            </DialogTitle>
                            <div className="p-5">
                                <form action={action}>
                                    <input type="hidden" name="id" value={initialValues._id} />
                                    <div className="mb-5">
                                        <label htmlFor="question">Question</label>
                                        <input
                                            name="question"
                                            id="question"
                                            type="text"
                                            placeholder="Enter Question"
                                            className="form-input"
                                            onChange={(e) => setinitialValues({ ...initialValues, question: e.target.value })}
                                            value={initialValues.question}
                                        />
                                        {
                                            state?.errors?.question && <p className='text-red-500 pt-1 text-sm'>- {state.errors.question}</p>
                                        }
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="desc">Answer</label>
                                        <textarea
                                            id="desc"
                                            name='answer'
                                            rows={3}
                                            className="form-textarea min-h-[130px] resize-none"
                                            placeholder="Enter Answer"
                                            onChange={(e) => setinitialValues({ ...initialValues, answer: e.target.value })}
                                            value={initialValues.answer}
                                        ></textarea>
                                        {
                                            state?.errors?.answer && <p className='text-red-500 pt-1 text-sm'>- {state.errors.answer}</p>
                                        }
                                    </div>
                                    <div className="mt-8 flex items-center justify-end">
                                        <button type="button" className="btn btn-outline-danger gap-2" onClick={() => dispatch(setFaqModal(false))}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
                                            {isPending ? 'Loading...' : 'Add Question'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>

    )
}
