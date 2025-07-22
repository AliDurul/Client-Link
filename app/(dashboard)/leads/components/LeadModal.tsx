'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import MaskedInput from 'react-text-mask';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { coloredToast } from '@/utils/sweetAlerts';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { date, number, object, string } from 'yup';
import { ELeadStatus, EPipelineStage, ILead } from '@/types/types';
import { fetchAllLeadsAsync, selectLead, selectLeadModal, setLeadModal, updateLeadState } from '@/lib/features/leads/leadSlice';
import { createLead, updateLead } from '@/lib/features/leads/leadAPI';
import { init } from 'next/dist/compiled/@vercel/og/satori';


const baseLeadSchema = object({
    source: string().nullable().required("Source is required."),
    owner: string().nullable().required("Owner is required."),
    name: string().nullable().required("Name is required."),
    source_link: string().nullable().required("Source link is required."),
    courier: string().oneOf(['Yes', 'No']).required("Courier is required."),
    mobile_number: string().nullable().required("Mobile number is required."),
    email: string().nullable().email("Invalid email format").required("Email is required."),
    province: string().nullable().required("Province is required."),
    town: string().nullable().required("Town is required."),
    exact_location: string().nullable().required("Exact location is required."),
    pipeline_stage: string().oneOf(Object.values(EPipelineStage)).required("Pipeline stage is required."),
    deal_value: string().required("Deal value is required."),
    expected_revenue: string().required("Expected revenue is required."),
    follow_up_date: date().required("Follow up date is required."),
    comments: string().nullable(),
});



export default function LeadModal() {

    const dispatch = useAppDispatch();

    const ticketModal = useAppSelector(selectLeadModal);
    const params = useAppSelector(selectLead);


    // useEffect(() => {
    //     dispatch(fetchAllKycAsync({ type: 'Customer' }));
    // }, []);

    const initialValues: ILead = {
        source: params?.source || null,
        owner: params?.owner || null,
        name: params?.name || null,
        source_link: params?.source_link || null,
        courier: params?.courier || 'No',
        mobile_number: params?.mobile_number || null,
        email: params?.email || null,
        province: params?.province || null,
        town: params?.town || null,
        exact_location: params?.exact_location || null,
        pipeline_stage: params?.pipeline_stage || EPipelineStage.Qualification,
        deal_value: params?.deal_value || "",
        probability: params?.probability || "",
        expected_revenue: params?.expected_revenue || "",
        follow_up_date: params?.follow_up_date || new Date(),
        close_date: params?.close_date || null,
        status: params?.status || ELeadStatus.Open,
        comments: params?.comments || null,
    }

    if (params?.id) initialValues.id = params.id;

    return (
        <div>

            <Transition appear show={ticketModal} as={Fragment}>
                <Dialog as="div" open={ticketModal} onClose={() => { dispatch(setLeadModal(false)) }} className="relative z-50">

                    <div className="fixed inset-0 bg-[black]/60 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => { dispatch(setLeadModal(false)) }}
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
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                        {params && 'id' in params ? 'Edit Lead' : 'Create Lead'}
                                    </div>
                                    <div className="p-5">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={baseLeadSchema}

                                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                                console.log(values);
                                                if (params?.id) {
                                                    const res = await updateLead(values);

                                                    setTimeout(() => {
                                                        if (res.message) {
                                                            coloredToast("success", res.message, "bottom-start");
                                                            dispatch(setLeadModal(false));
                                                            dispatch(fetchAllLeadsAsync({}));
                                                            setSubmitting(false);
                                                        } else {
                                                            coloredToast("danger", res.error, "bottom-start");
                                                        }
                                                    }, 500);

                                                } else {
                                                    const res = await createLead(values);

                                                    setTimeout(() => {
                                                        if (res.message) {
                                                            coloredToast("success", res.message, "bottom-start");
                                                            dispatch(setLeadModal(false));
                                                            dispatch(fetchAllLeadsAsync({}));
                                                            setSubmitting(false);
                                                        } else {
                                                            coloredToast("danger", res.error, "bottom-start");
                                                        }
                                                    }, 500);
                                                }
                                            }}
                                        >
                                            {
                                                ({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, }) => (
                                                    <Form onSubmit={handleSubmit} >

                                                        <div className='flex gap-3 mb-5'>
                                                            <div className="flex-1">
                                                                <label htmlFor="owner">Company Name</label>
                                                                <Field
                                                                    id="owner" name='owner' type="text" placeholder="Enter Title"
                                                                    className={`form-input ${touched.owner && errors.owner ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="owner"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>

                                                            <div className="flex-1">
                                                                <label htmlFor="name">Person Name</label>
                                                                <Field
                                                                    id="name" name='name' type="text" placeholder="Enter Title"
                                                                    className={`form-input ${touched.name && errors.name ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="name"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>

                                                            <fieldset className="w-[160px]">
                                                                <label htmlFor="mobile_number" className='text-sm'>
                                                                    Phone Number
                                                                    {/* (<span className="text-white-dark">+###-###-###-###</span>) */}
                                                                </label>
                                                                <Field
                                                                    as={MaskedInput}
                                                                    id="mobile_number"
                                                                    name='mobile_number'
                                                                    type="text"
                                                                    placeholder="+___-___-___-___"
                                                                    className={`form-input ${touched.mobile_number && errors.mobile_number ? "border-red-500" : ""}`}
                                                                    required
                                                                    mask={[
                                                                        '+',
                                                                        /\d/, /\d/, /\d/, // Allow up to three digits for the country code
                                                                        '-',
                                                                        /\d/, /\d/, /\d/, // First group of three digits
                                                                        '-',
                                                                        /\d/, /\d/, /\d/, // Second group of three digits
                                                                        '-',
                                                                        /\d/, /\d/, /\d/  // Third group of three digits
                                                                    ]}
                                                                />
                                                                <ErrorMessage
                                                                    name='mobile_number'
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </fieldset>
                                                        </div>

                                                        <div className="flex gap-3 mb-5">
                                                            <div className="flex-1">
                                                                <label htmlFor="source">Source</label>
                                                                <Field
                                                                    id="source" name='source' type="text" placeholder="Enter source"
                                                                    className={`form-input ${touched.source && errors.source ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="source"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="source_link">Source Link</label>
                                                                <Field
                                                                    id="source_link" name='source_link' type="text" placeholder="Enter source link"
                                                                    className={`form-input ${touched.source_link && errors.source_link ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="source_link"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="email">Email</label>
                                                                <Field
                                                                    id="email" name='email' type="email" placeholder="Enter email"
                                                                    className={`form-input ${touched.email && errors.email ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="email"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 mb-5">

                                                            <div className="flex-1">
                                                                <label htmlFor="province">Province</label>
                                                                <Field
                                                                    id="province" name='province' type="text" placeholder="Enter province"
                                                                    className={`form-input ${touched.province && errors.province ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="province"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="town">Town</label>
                                                                <Field
                                                                    id="town" name='town' type="text" placeholder="Enter town"
                                                                    className={`form-input ${touched.town && errors.town ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="town"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="exact_location">Exact Location</label>
                                                                <Field
                                                                    id="exact_location" name='exact_location' type="text" placeholder="Enter exact_location"
                                                                    className={`form-input ${touched.exact_location && errors.exact_location ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="exact_location"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 mb-5">
                                                            <div className={`w-[70px] ${touched.courier && errors.courier ? "has-error" : ""}`}>
                                                                <label htmlFor="courier">Courier</label>
                                                                <Field as='select' id='courier' name='courier' className="form-select" required >
                                                                    <option value="No">No</option>
                                                                    <option value="Yes">Yes</option>

                                                                </Field>
                                                                <ErrorMessage
                                                                    name="courier"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="deal_value">Deal Value</label>
                                                                <Field
                                                                    id="deal_value" name='deal_value' type="number" placeholder="Enter deal value"
                                                                    className={`form-input ${touched.deal_value && errors.deal_value ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="deal_value"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="expected_revenue">Expected Revenue</label>
                                                                <Field
                                                                    id="expected_revenue" name='expected_revenue' type="number" placeholder="Enter expected revenue"
                                                                    className={`form-input ${touched.expected_revenue && errors.expected_revenue ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="expected_revenue"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex mb-5 gap-3 w-full">
                                                            <div className={`flex-1 ${touched.pipeline_stage && errors.pipeline_stage ? "has-error" : ""}`}>
                                                                <label htmlFor="pipeline_stage">Pipline Stage</label>
                                                                <Field as='select' id='pipeline_stage' name='pipeline_stage' className="form-select" required >
                                                                    <option value="">Select Pipeline Stage...</option>
                                                                    {Object.values(EPipelineStage).map(stage => (
                                                                        <option key={stage} value={stage}>{stage}</option>
                                                                    ))}
                                                                </Field>
                                                                <ErrorMessage
                                                                    name="pipeline_stage"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor="follow_up_date">Follow Up Date</label>
                                                                <Field
                                                                    id="follow_up_date" name='follow_up_date' type="date" placeholder=""
                                                                    className={`form-input ${touched.follow_up_date && errors.follow_up_date ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="follow_up_date"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                            <div className="">
                                                                <label htmlFor="status">Status</label>
                                                                <Field
                                                                    id="status" name='status' type="text" placeholder="Enter status" disabled
                                                                    className={`form-input ${touched.status && errors.status ? "border-red-500" : ""}`} required />
                                                                <ErrorMessage
                                                                    name="status"
                                                                    component="div"
                                                                    className="text-red-500 text-sm mt-1 "
                                                                />
                                                            </div>
                                                        </div>
                                                        {
                                                            params?.id && (
                                                                <div className='mb-5'>
                                                                    <label htmlFor="pipeline_stage">Probability
                                                                        {/* <span className='text-gray-500'> %{values.probability === '' ? 0 : values.probability}</span> */}
                                                                    </label>
                                                                    {
                                                                        values.probability && (
                                                                            <div className="w-full h-6 bg-[#ebedf2] dark:bg-dark/40 rounded-full">
                                                                                <div
                                                                                    className="grid place-items-center text-sm  text-white bg-linear-to-r from-[#3cba92] to-[#0ba360] h-6 rounded-full "
                                                                                    style={{ width: `${values.probability}%` }}
                                                                                >
                                                                                    % {values.probability}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                        <div>
                                                            <div className={`flex`}>
                                                                <div className='bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b] whitespace-nowrap '>
                                                                    Comment
                                                                </div>
                                                                <Field as="textarea" name='comments' rows={4} className={` ${touched.comments && errors.comments ? "border-red-500" : ""} form-textarea ltr:rounded-l-none rtl:rounded-r-none`}>{values.comments}</Field>
                                                            </div>
                                                            <ErrorMessage
                                                                name="comments"
                                                                component="div"
                                                                className="text-red-500 text-sm mt-1 "
                                                            />
                                                        </div>

                                                        <div className="mt-8 flex items-center justify-end">
                                                            <button type="button" className="btn btn-outline-danger gap-2" onClick={() => dispatch(setLeadModal(false))}>
                                                                Cancel
                                                            </button>
                                                            <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                                {
                                                                    params?.id ? isSubmitting ? 'Submiting..' : 'Update Lead'
                                                                        : isSubmitting ? 'Submiting..' : 'Create Lead'
                                                                }
                                                            </button>
                                                        </div>
                                                    </Form>
                                                )
                                            }


                                        </Formik>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog >
            </Transition >
        </div >
    )
}
