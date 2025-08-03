'use client';
import { bankOp, countryOp, genderOp, getMaskForIdType, idTypeOp, maritalOp, maskConfig, nationalityOp, relationOp, religionOp } from '@/components/dashboard/kyc/KycConstraints';
import InputBox from '@/components/shared/InputBox';
import ImageUploading, { ImageListType } from 'react-images-uploading';

import Image from 'next/image';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import { use, useActionState, useEffect, useRef, useState } from 'react';
import { Kyc } from '@/types';
import { updateKyc } from '@/lib/features/kyc/kycActions';
import KycImageUpload from './KycImageUpload';
import { useRouter } from 'next/navigation';
import { coloredToast } from '@/lib/utility/sweetAlerts';


interface CustomStyles {
    control: (provided: any) => any;
}

interface IinitialValues {
    success: boolean;
    message: string;
}

const initialState: IinitialValues = {
    success: false,
    message: '',
}

interface KycFormProps {
    kycPromise: Promise<{ result?: Kyc; success: boolean; message?: string }>;
    readOnly: boolean;
}

export default function KycForm({ kycPromise, readOnly }: KycFormProps) {

    const router = useRouter();

    let kyc: Kyc | undefined = undefined;
    let success = true;
    let message = '';

    if (readOnly && kycPromise) {
        const kycResult = use(kycPromise);
        kyc = kycResult.result;
        success = kycResult.success;
        message = kycResult.message || '';
    }

    // if (!success) {
    //     return (
    //         <div className="flex h-full items-center justify-center mt-5">
    //             <div className="text-red-500">
    //                 <h2 className="text-2xl font-bold">Error</h2>
    //                 <p>{message}</p>
    //             </div>
    //         </div>
    //     );
    // };


    // form action
    const [state, action, isPending] = useActionState(updateKyc, initialState);


    // states
    const customStyles: CustomStyles = { control: (provided) => ({ ...provided, backgroundColor: readOnly ? 'white' : provided.backgroundColor, }) };
    const initialValues = kyc ? {
        _id: kyc._id || 0,
        customer_id: kyc.customer_id || '',
        first_name: kyc.first_name || '',
        last_name: kyc.last_name || '',
        full_name: kyc.full_name || '',
        email: kyc.email || '',
        phone_number: kyc.phone_number || '',
        dob: kyc.dob ? new Date(kyc.dob) : undefined,
        nationality: kyc.nationality || '',
        gender: kyc.gender || '',
        address: {
            street: kyc.address?.street || '',
            city: kyc.address?.city || '',
            state: kyc.address?.state || '',
            country: kyc.address?.country || '',
            zip_code: kyc.address?.zip_code || '',
        },
        id_type: kyc.id_type || '',
        id_number: kyc.id_number || '',
        id_front: kyc.id_front || '',
        id_back: kyc.id_back || '',
        profession: kyc.profession || '',
        marital_status: kyc.marital_status || '',
        religion: kyc.religion || '',
        father_name: kyc.father_name || '',
        mother_name: kyc.mother_name || '',
        witness_name: kyc.witness_name || '',
        witness_relation: kyc.witness_relation || '',
        medication: typeof kyc.medication === 'boolean' ? kyc.medication : false,
        medication_type: kyc.medication_type || '',
        number_of_children: typeof kyc.number_of_children === 'number' ? kyc.number_of_children : 0,
        boys: typeof kyc.boys === 'number' ? kyc.boys : 0,
        girls: typeof kyc.girls === 'number' ? kyc.girls : 0,
        finincial_institution: kyc.finincial_institution || '',
        documents: Array.isArray(kyc.documents) ? kyc.documents : [],
        profile_pic: kyc.profile_pic || '',
        status: kyc.status || 'active',
        notes: kyc.notes || '',
        assigned_agent: typeof kyc.assigned_agent === 'number' ? kyc.assigned_agent : undefined,
        createdAt: kyc.createdAt ? new Date(kyc.createdAt) : undefined,
        updatedAt: kyc.updatedAt ? new Date(kyc.updatedAt) : undefined,
    } : {
        ...state?.inputs,
        address: {
            street: state?.inputs?.street || '',
            city: state?.inputs?.city || '',
            state: state?.inputs?.state || '',
            country: state?.inputs?.country || '',
            zip_code: state?.inputs?.zip_code || '',
        },
    };
    const [idType, setIdType] = useState(initialValues.id_type || '');

    // functins
    useEffect(() => {
        if (!state?.message) return;


        if (state.success) {
            router.replace('/kyc')
            coloredToast("success", state.message, "bottom-start");
        }

    }, [state]);


    return (
        <form action={action} className="my-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
            <input type="text" hidden name='_id' />
            <div className="panel">
                <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col items-center justify-center">
                        {
                            readOnly
                                ? <Image
                                    src={kyc?.profile_pic ? kyc.profile_pic : '/assets/images/profile-pic.png'}
                                    alt="profile"
                                    width={120}
                                    height={120}
                                    className="rounded-full my-5" />
                                : <KycImageUpload />
                        }
                    </div>

                    <ul className="m-auto  flex flex-col space-y-4 font-semibold text-white-dark">
                        <li >
                            <InputBox
                                name='first_name'
                                id="first_name"
                                type="text"
                                placeholder="Enter First Name"
                                disabled={readOnly}
                                label="First Name"
                                value={initialValues.first_name}
                                errors={state?.errors?.first_name}
                            />
                        </li>
                        <li >
                            <InputBox
                                name='last_name'
                                id="last_name"
                                type="text"
                                placeholder="Enter Last Name"
                                disabled={readOnly}
                                label="Last Name"
                                value={initialValues.last_name}
                                errors={state?.errors?.last_name}
                            />
                        </li>
                        <li className="flex items-center gap-2  ">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                <path
                                    d="M2.3153 12.6978C2.26536 12.2706 2.2404 12.057 2.2509 11.8809C2.30599 10.9577 2.98677 10.1928 3.89725 10.0309C4.07094 10 4.286 10 4.71612 10H15.2838C15.7139 10 15.929 10 16.1027 10.0309C17.0132 10.1928 17.694 10.9577 17.749 11.8809C17.7595 12.057 17.7346 12.2706 17.6846 12.6978L17.284 16.1258C17.1031 17.6729 16.2764 19.0714 15.0081 19.9757C14.0736 20.6419 12.9546 21 11.8069 21H8.19303C7.04537 21 5.9263 20.6419 4.99182 19.9757C3.72352 19.0714 2.89681 17.6729 2.71598 16.1258L2.3153 12.6978Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path opacity="0.5" d="M17 17H19C20.6569 17 22 15.6569 22 14C22 12.3431 20.6569 11 19 11H17.5" stroke="currentColor" strokeWidth="1.5" />
                                <path
                                    opacity="0.5"
                                    d="M10.0002 2C9.44787 2.55228 9.44787 3.44772 10.0002 4C10.5524 4.55228 10.5524 5.44772 10.0002 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4.99994 7.5L5.11605 7.38388C5.62322 6.87671 5.68028 6.0738 5.24994 5.5C4.81959 4.9262 4.87665 4.12329 5.38382 3.61612L5.49994 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14.4999 7.5L14.6161 7.38388C15.1232 6.87671 15.1803 6.0738 14.7499 5.5C14.3196 4.9262 14.3767 4.12329 14.8838 3.61612L14.9999 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>{' '}
                            <InputBox
                                name='profession'
                                id="profession"
                                type="text"
                                className='flex-1'
                                placeholder="Enter Profession"
                                disabled={readOnly}
                                value={initialValues.profession}
                                errors={state?.errors?.profession}
                            />
                        </li>
                        <li className="flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                <path
                                    d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <InputBox
                                name='dob'
                                id="dob"
                                type="date"
                                placeholder="Enter DOB / yyyy-mm-dd"
                                disabled={readOnly}
                                value={initialValues.dob ? initialValues.dob.toString().split('T')[0] : ''}
                                errors={state?.errors?.dob}
                            />
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
                            <InputBox
                                name='email'
                                id="email"
                                type="text"
                                placeholder="Enter Email"
                                disabled={readOnly}
                                value={initialValues.email}
                                errors={state?.errors?.email}
                            />
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
                            <MaskedInput
                                id="phone_number"
                                name="phone_number"
                                type="text"
                                disabled={readOnly}
                                placeholder={maskConfig.phone_number.placeholder}
                                className={`form-input `}
                                mask={maskConfig.phone_number.mask}
                                value={initialValues.phone_number}
                            />
                            {state?.errors?.phone_number && (<p className="mt-1 text-sm text-red-600">{state.errors.phone_number}</p>)}
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
                            <label htmlFor="Gender">Gender</label>
                            <Select
                                placeholder="Select Gender"
                                options={genderOp}
                                id='Gender'
                                name='gender'
                                value={genderOp.find(option => option.value === initialValues.gender)}
                                // onChange={option => setFieldValue('gender', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                            {state?.errors?.gender && (<p className="mt-1 text-sm text-red-600">{state.errors.gender}</p>)}
                        </div>

                        <div>
                            <label htmlFor="id_type">Id Type </label>
                            <Select
                                placeholder="Select Id Type"
                                options={idTypeOp}
                                id='id_type'
                                name='id_type'
                                value={idTypeOp.find(option => option.value === idType)}
                                // onChange={option => setFieldValue('id_type', option ? option.value : '')}
                                onChange={option => setIdType(option ? option.value : '')}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                            {state?.errors?.id_type && (<p className="mt-1 text-sm text-red-600">{state.errors.id_type}</p>)}
                        </div>
                        <div>
                            <label htmlFor="id_number">{idType.charAt(0).toUpperCase() + idType.slice(1)} Number</label>
                            <MaskedInput
                                id="id_number"
                                name="id_number"
                                type='text'
                                keepCharPositions={true}
                                className='form-input'
                                value={initialValues.id_number}
                                mask={getMaskForIdType(idType)?.mask}
                                placeholder={getMaskForIdType(idType)?.placeholder}
                            />
                            {state?.errors?.id_number && (<p className="mt-1 text-sm text-red-600">{state.errors.id_number}</p>)}
                        </div>
                        <div>
                            <label htmlFor="Religion">Religion</label>
                            <Select
                                placeholder="Select Religion"
                                options={religionOp}
                                id='Religion'
                                name='religion'
                                value={religionOp.find(option => option.value === initialValues.religion)}
                                // onChange={option => setFieldValue('religion', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                            {state?.errors?.religion && (<p className="mt-1 text-sm text-red-600">{state.errors.religion}</p>)}
                        </div>
                        <div>
                            <label htmlFor="marital_status">Marital Status</label>
                            <Select
                                placeholder="Select status of marital"
                                options={maritalOp}
                                id='marital_status'
                                name='marital_status'
                                value={maritalOp.find(option => option.value === initialValues.marital_status)}
                                // onChange={option => setFieldValue('marital_status', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                            {state?.errors?.marital_status && (<p className="mt-1 text-sm text-red-600">{state.errors.marital_status}</p>)}
                        </div>
                        <div>
                            <InputBox
                                name='boys'
                                id="boys"
                                type="number"
                                placeholder="Enter Boys Count"
                                label="Boys Count"
                                disabled={readOnly}
                                value={initialValues.boys}
                                errors={state?.errors?.boys}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='girls'
                                id="girls"
                                type="number"
                                placeholder="Enter Girls Count"
                                label="Girls Count"
                                disabled={readOnly}
                                value={initialValues.girls}
                                errors={state?.errors?.girls}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='street'
                                id="street"
                                type="text"
                                placeholder="Enter Street Address"
                                label="Street Address"
                                disabled={readOnly}
                                value={initialValues.address?.street}
                                errors={state?.errors?.street}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='city'
                                id="city"
                                type="text"
                                placeholder="Enter City"
                                label="City"
                                disabled={readOnly}
                                value={initialValues.address?.city}
                                errors={state?.errors?.city}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='state'
                                id="state"
                                type="text"
                                placeholder="Enter State"
                                label="State"
                                disabled={readOnly}
                                value={initialValues.address?.state}
                                errors={state?.errors?.state}
                            />
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <Select placeholder="Select Country"
                                options={countryOp} id='country'
                                name='country'
                                value={countryOp.find(option => option.value === initialValues.address?.country)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                onChange={option => console.log(option)}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                            {state?.errors?.country && (<p className="mt-1 text-sm text-red-600">{state.errors.country}</p>)}
                        </div>
                        <div>
                            <InputBox
                                name='zip_code'
                                id="zip_code"
                                type="text"
                                placeholder="Enter Zip Code"
                                label="Zip Code"
                                disabled={readOnly}
                                value={initialValues.address?.zip_code}
                                errors={state?.errors?.zip_code}
                            />
                        </div>

                        <div>
                            <InputBox
                                name='father_name'
                                id="father_name"
                                type="text"
                                placeholder="Enter Father Name"
                                disabled={readOnly}
                                label="Father Name"
                                value={initialValues.father_name}
                                errors={state?.errors?.father_name}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='mother_name'
                                id="mother_name"
                                type="text"
                                placeholder="Enter Mother Name"
                                disabled={readOnly}
                                label="Mother Name"
                                value={initialValues.mother_name}
                                errors={state?.errors?.mother_name}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='witness_name'
                                id="witness_name"
                                type="text"
                                placeholder="Enter Witness Name"
                                disabled={readOnly}
                                label="Witness Name"
                                value={initialValues.witness_name}
                                errors={state?.errors?.witness_name}
                            />
                        </div>
                        <div>
                            <label htmlFor="witness_relation">Witness Relation</label>
                            <Select
                                placeholder="Select witness relation"
                                options={relationOp} id='witness_relation'
                                name='witness_relation'
                                value={relationOp.find(option => option.value === initialValues.witness_relation)}
                                // onChange={option => setFieldValue('witness_relation', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                            {state?.errors?.witness_relation && (<p className="mt-1 text-sm text-red-600">{state.errors.witness_relation}</p>)}
                        </div>
                        <div>
                            <label htmlFor="nationality">Nationality</label>
                            <Select placeholder="Select Nationality"
                                options={nationalityOp} id='nationality'
                                name='nationality'
                                value={nationalityOp.find(option => option.value === initialValues.nationality)}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                            {state?.errors?.nationality && (<p className="mt-1 text-sm text-red-600">{state.errors.nationality}</p>)}
                        </div>
                        <div>
                            <label htmlFor="banks">Finincial Institution</label>
                            <Select
                                placeholder="Select Finincial Institution"
                                options={bankOp} id='banks'
                                name='finincial_institution'
                                value={bankOp.find(option => option.value === initialValues.finincial_institution)}
                                // onChange={option => setFieldValue('finincial_institution', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                            {state?.errors?.finincial_institution && (<p className="mt-1 text-sm text-red-600">{state.errors.finincial_institution}</p>)}
                        </div>

                        <div>
                            <InputBox
                                name='medication_type'
                                id="medication_type"
                                type="text"
                                placeholder="Medication Type"
                                disabled={readOnly}
                                label='Medication Type'
                                value={initialValues.medication_type}
                                errors={state?.errors?.medication_type}
                            />

                        </div>


                        {
                            !readOnly && (
                                <div className="mt-3 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        {isPending ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </form>
    )
}
