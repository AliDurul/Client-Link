'use client'
import { Field, Form, Formik } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllCoparateAsync, selectCoparate, updateCoparateState } from '@/lib/features/coparate/coparateSlice';
import { createCoparate, updateCoparate, } from '@/lib/features/coparate/coparateAPI';
import { coloredToast } from '@/utils/sweetAlerts';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';
import { maskConfig, CourierOp } from '../components/CoparateConstarints';
import { getAllTickets } from '@/lib/features/tickets/ticketAPI';
import { Ticket } from '@/types/types';
import CoparateUserTicketsInfo from '../components/CoparateUserTicketsInfo';
import TopPageNavigation from '@/app/components/TopPageNavigation';
import Image from 'next/image';


const CoparateActionPage = () => {

    const IMG_URL = 'http://192.168.1.111:8000'

    const coparate = useAppSelector(selectCoparate);
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const router = useRouter()

    const userId = searchParams.get('userId')
    const source = searchParams.get('s')
    const readOnly = source === 'r';

    const [userTickets, setUserTickets] = useState<Ticket[]>([])
    // file upload
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;

    const fetchTicketsForUser = async (userId: string | null) => {
        const data = await getAllTickets(userId ? userId.toString() : null)
        setUserTickets(data.results)
    }


    useEffect(() => {
        fetchTicketsForUser(userId)
    }, [coparate])

    const activeTickets = userTickets.filter((t: Ticket) => t.status === 'Active').length
    const pendingTickets = userTickets.filter((t: Ticket) => t.status === 'Pending').length
    const cancelledTickets = userTickets.filter((t: Ticket) => t.status === 'Cancelled').length
    const resolvedTickets = userTickets.filter((t: Ticket) => t.status === 'Resolved').length
    const escalatedTickets = userTickets.filter((t: Ticket) => t.status === 'Escalated').length

    const summaryArray = [
        { title: 'Active Tickets', value: activeTickets, customStyle: 'bg-secondary-light text-secondary' },
        { title: 'Pending Tickets', value: pendingTickets, customStyle: 'bg-info-light text-info' },
        { title: 'Cancelled Tickets', value: cancelledTickets, customStyle: 'bg-danger-light text-danger' },
        { title: 'Resolved Tickets', value: resolvedTickets, customStyle: 'bg-success-light text-success' },
        { title: 'Escalated Tickets', value: escalatedTickets, customStyle: 'bg-warning-light text-warning' },

    ]

    interface CustomStyles {
        control: (provided: any) => any;
    }

    const customStyles: CustomStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: readOnly ? 'white' : provided.backgroundColor,
        })
    };


    const initialValues = {
        id: coparate?.id || 0,
        name: coparate?.name || '',
        courier: coparate?.courier || '',
        province: coparate?.province || '',
        exact_location: coparate?.exact_location || '',
        mobile_number: coparate?.mobile_number || '',
        created_at: coparate?.created_at || new Date(),
        updated_at: coparate?.updated_at || new Date(),
    };


    return (
        <div>
            <TopPageNavigation />

            <div className="pt-5">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {

                        const formData = new FormData();

                        Object.keys(values).forEach(key => {
                            formData.append(key, values[key as keyof typeof values] as string);
                        })

                        if (coparate) {
                            const res = await updateCoparate(formData)

                            setTimeout(() => {
                                if (res.message) {
                                    resetForm();
                                    router.replace('/coparate')
                                    coloredToast("success", res.message, "bottom-start");
                                    // dispatch(getAllFrimAsync());
                                    dispatch(updateCoparateState(null))
                                } else {
                                    coloredToast("danger", res.error, "bottom-start");
                                }
                            }, 500);
                        } else {

                            formData.append('user_type', 'Customer');
                            formData.append('password', 'default-password');

                            const res = await createCoparate(formData);

                            setTimeout(() => {
                                setSubmitting(false);
                                if (!res.error) {
                                    coloredToast("success", res.message, "bottom-start");
                                    dispatch(fetchAllCoparateAsync({}));
                                    dispatch(updateCoparateState(res))
                                    resetForm();
                                    router.replace('/coparate')
                                } else {
                                    coloredToast("danger", res.error, "bottom-start");
                                }
                            }, 500);
                        }

                    }}
                >
                    {
                        ({ values, errors, touched, setFieldValue }) => (
                            <Form className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                                <div className="panel">
                                    <div className="flex items-center justify-between">
                                        <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                                    </div>
                                    <div className="mb-5">
                                        <div className="flex flex-col items-center justify-center">
                                            {
                                                readOnly ? (
                                                    // <Image
                                                    //     src={coparate?.profile_pic ? IMG_URL + coparate.profile_pic : '/assets/images/profile-pic.png'}
                                                    //     alt="profile"
                                                    //     width={120}
                                                    //     height={120}
                                                    //     className="rounded-full my-5" />
                                                    <p>Profile</p>
                                                ) : (
                                                    <div className="custom-file-container my-3 mb-8" data-upload-id="myFirstImage">
                                                        <label className="custom-file-container__custom-file h-0"></label>
                                                        <input type="file" className="custom-file-container__custom-file__custom-file-input h-0 w-full" accept="image/*" />
                                                        <input type="hidden" name="MAX_FILE_SIZE" value="10485760 " />
                                                        <ImageUploading
                                                            value={images}
                                                            onChange={(imageList) => {
                                                                setImages(imageList as never[]);

                                                                if (imageList.length > 0) {
                                                                    setFieldValue('profile_pic', imageList[0].file);
                                                                } else {
                                                                    setFieldValue('profile_pic', '');
                                                                }
                                                            }}
                                                            maxNumber={maxNumber}>

                                                            {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                                                <div className="-mt-10">
                                                                    <div className='flex gap-3 justify-center items-center'>
                                                                        <div className="flex-1 inset-0 z-5 h-10 overflow-hidden rounded border border-[#f1f2f3] bg-[#f1f2f3] px-3 py-2 text-sm leading-6 text-[#333] select-none cursor-pointer" onClick={onImageUpload}>
                                                                            Choose Pic...
                                                                        </div>
                                                                        <div className="text-[#333] text-[26px]  cursor-pointer" title="Clear Image" onClick={() => { setImages([]); setFieldValue('profile_pic', ''); }}>
                                                                            ×
                                                                        </div>
                                                                    </div>
                                                                    {imageList.map((image, index) => (
                                                                        <div key={index} className="custom-file-container__image-preview relative mt-3">
                                                                            <Image width={100} height={100} src={image.dataURL || ''} alt="user profile" className="m-auto max-w-md  rounded-full  object-cover" />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                        </ImageUploading>
                                                        {images.length === 0 ? <Image width={100} height={100} src="/assets/images/file-preview.svg" className="m-auto  max-w-md  rounded-full object-cover mt-3" alt="user profile" /> : ''}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <ul className="m-auto  flex flex-col space-y-4 font-semibold text-white-dark">
                                            <li className="">
                                                <label htmlFor="name" className='pl-2'>Name</label>
                                                <Field name='name' id="name" type="text" placeholder="Enter First Name" className="form-input" disabled={source === 'r'} required />
                                            </li>

                                            <li className="flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        opacity="0.5"
                                                        d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12Z"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908L18 8"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <Field name='email' id="email" type="text" placeholder="Enter Email" className="form-input" disabled={source === 'r'} required />
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M5.00659 6.93309C5.04956 5.7996 5.70084 4.77423 6.53785 3.93723C7.9308 2.54428 10.1532 2.73144 11.0376 4.31617L11.6866 5.4791C12.2723 6.52858 12.0372 7.90533 11.1147 8.8278M17.067 18.9934C18.2004 18.9505 19.2258 18.2992 20.0628 17.4622C21.4558 16.0692 21.2686 13.8468 19.6839 12.9624L18.5209 12.3134C17.4715 11.7277 16.0947 11.9628 15.1722 12.8853"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <path
                                                        opacity="0.5"
                                                        d="M5.00655 6.93311C4.93421 8.84124 5.41713 12.0817 8.6677 15.3323C11.9183 18.5829 15.1588 19.0658 17.0669 18.9935M15.1722 12.8853C15.1722 12.8853 14.0532 14.0042 12.0245 11.9755C9.99578 9.94676 11.1147 8.82782 11.1147 8.82782"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                                <Field
                                                    as={MaskedInput}
                                                    id="mobile_number"
                                                    name="mobile_number"
                                                    type="text"
                                                    disabled={source === 'r'}
                                                    placeholder={maskConfig.phone_number.placeholder}
                                                    className={`form-input ${touched.mobile_number && errors.mobile_number ? "border-red-500" : ""}`}
                                                    required
                                                    mask={maskConfig.phone_number.mask}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="panel lg:col-span-2 xl:col-span-3">
                                    <div className="mb-5">
                                        <h5 className="text-lg font-semibold dark:text-white-light">Details</h5>
                                    </div>
                                    <div className="mb-5">
                                        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                            <div>
                                                <label htmlFor="exact_location">Home Address</label>
                                                <Field name='exact_location' id="exact_location" type="text" className="form-input" disabled={source === 'r'} required />
                                            </div>
                                            <div>
                                                <label htmlFor="province">Province</label>
                                                <Field name='province' id="province" type="text" className="form-input" disabled={source === 'r'} required />
                                            </div>

                                            <div>
                                                <label htmlFor="courier">Finincial Institution</label>
                                                <Select placeholder="Select Finincial Institution" options={CourierOp} id='courier'
                                                    value={CourierOp.find((option: any) => option.value === values.courier)}
                                                    onChange={option => setFieldValue('courier', option ? option.value : '')}
                                                    isDisabled={readOnly}
                                                    styles={customStyles}
                                                    menuIsOpen={readOnly ? false : undefined}
                                                />
                                            </div>



                                            {
                                                !readOnly && (
                                                    <div className="mt-3 sm:col-span-2">
                                                        <button type="submit" className="btn btn-primary">
                                                            Save
                                                        </button>
                                                    </div>)
                                            }

                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }

                </Formik>
                {
                    readOnly && <CoparateUserTicketsInfo userTickets={userTickets} summaryArray={summaryArray} />
                }

            </div>
        </div >
    );
};

export default CoparateActionPage;
