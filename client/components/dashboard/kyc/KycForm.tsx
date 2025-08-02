'use client';
import { bankOp, countryOp, genderOp, getMaskForIdType, idTypeOp, maritalOp, maskConfig, nationalityOp, relationOp, religionOp } from '@/components/dashboard/kyc/KycConstraints';
import InputBox from '@/components/shared/InputBox';
import TopPageNavigation from '@/components/shared/TopPageNavigation';
import { useUrlParams } from '@/hooks/useUrlParams';
import { selectKyc } from '@/lib/features/kyc/kycSlice';
import { useAppSelector } from '@/lib/hooks';
import Image from 'next/image';
import MaskedInput from 'react-text-mask';
import Select from 'react-select';
import { use } from 'react';
import { Kyc } from '@/types';


interface CustomStyles {
    control: (provided: any) => any;
}

export default function KycForm({ kycPromise }: { kycPromise: Promise<{ result?: Kyc | undefined; success: boolean; message?: string | undefined; }> }) {

    const { result: kyc, success, message } = use(kycPromise);

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

    

    const { getParam } = useUrlParams();

    const readOnly = getParam('s', 'r') === 'r';

    const customStyles: CustomStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: readOnly ? 'white' : provided.backgroundColor,
        })
    };

    const initialValues = {
        _id: kyc?._id || 0,
        customer_id: kyc?.customer_id || '',
        first_name: kyc?.first_name || '',
        last_name: kyc?.last_name || '',
        full_name: kyc?.full_name || '',
        email: kyc?.email || '',
        phone_number: kyc?.phone_number || '',
        dob: kyc?.dob ? new Date(kyc.dob) : undefined,
        nationality: kyc?.nationality || '',
        gender: kyc?.gender || '',
        address: {
            street: kyc?.address?.street || '',
            city: kyc?.address?.city || '',
            state: kyc?.address?.state || '',
            country: kyc?.address?.country || '',
            zip_code: kyc?.address?.zip_code || '',
        },
        id_type: kyc?.id_type || '',
        id_number: kyc?.id_number || '',
        id_front: kyc?.id_front || '',
        id_back: kyc?.id_back || '',
        profession: kyc?.profession || '',
        marital_status: kyc?.marital_status || '',
        religion: kyc?.religion || '',
        father_name: kyc?.father_name || '',
        mother_name: kyc?.mother_name || '',
        witness_name: kyc?.witness_name || '',
        witness_relation: kyc?.witness_relation || '',
        medication: typeof kyc?.medication === 'boolean' ? kyc.medication : false,
        medication_type: kyc?.medication_type || '',
        number_of_children: typeof kyc?.number_of_children === 'number' ? kyc.number_of_children : 0,
        boys: typeof kyc?.boys === 'number' ? kyc.boys : 0,
        girls: typeof kyc?.girls === 'number' ? kyc.girls : 0,
        finincial_institution: kyc?.finincial_institution || '',
        documents: Array.isArray(kyc?.documents) ? kyc.documents : [],
        profile_pic: kyc?.profile_pic || '',
        status: kyc?.status || 'active',
        notes: kyc?.notes || '',
        assigned_agent: typeof kyc?.assigned_agent === 'number' ? kyc.assigned_agent : undefined,
        createdAt: kyc?.createdAt ? new Date(kyc.createdAt) : undefined,
        updatedAt: kyc?.updatedAt ? new Date(kyc.updatedAt) : undefined,
    };

    return (
        <form className="my-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
            <div className="panel">
                <div className="flex items-center justify-between">
                    <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col items-center justify-center">
                        {
                            readOnly ? (
                                <Image
                                    src={kyc?.profile_pic ? kyc.profile_pic : '/assets/images/profile-pic.png'}
                                    alt="profile"
                                    width={120}
                                    height={120}
                                    className="rounded-full my-5" />
                            ) : (
                                <div className="custom-file-container my-3 mb-8" data-upload-id="myFirstImage">
                                    <label className="custom-file-container__custom-file h-0"></label>
                                    <input type="file" className="custom-file-container__custom-file__custom-file-input h-0 w-full" accept="image/*" />
                                    <input type="hidden" name="MAX_FILE_SIZE" value="10485760 " />
                                    {/* <ImageUploading
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

                                        </ImageUploading> */}
                                    {/* {images.length === 0 ? <Image width={100} height={100} src="/assets/images/file-preview.svg" className="m-auto  max-w-md  rounded-full object-cover mt-3" alt="user profile" /> : ''} */}
                                </div>
                            )
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
                                placeholder="Enter Profession"
                                disabled={readOnly}
                                value={initialValues.profession}

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
                                value={initialValues.dob ? initialValues.dob.toISOString().split('T')[0] : ''}
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
                            <Select placeholder="Select Gender" options={genderOp} id='Gender'
                                value={genderOp.find(option => option.value === initialValues.gender)}
                                // onChange={option => setFieldValue('gender', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                        </div>
                        {/* <div>
                            <InputBox
                                name='user_age'
                                id="user_age"
                                type="number"
                                placeholder="Enter Age"
                                disabled={readOnly}
                                label="Age"
                                value={initialValues.user_age}
                            />
                        </div> */}
                        <div>
                            <label htmlFor="id_type">Id Type </label>
                            <Select
                                placeholder="Select Id Type"
                                options={idTypeOp}
                                id='id_type'
                                value={idTypeOp.find(option => option.value === initialValues.id_type)}
                                // onChange={option => setFieldValue('id_type', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="id_number">Nrc No</label>
                            <MaskedInput
                                id="id_number"
                                name="id_number"
                                type="text"
                                disabled={readOnly}
                                placeholder={getMaskForIdType(initialValues.id_type)?.placeholder}
                                className={`form-input `}
                                required
                                guide={true}
                                keepCharPositions={true}
                                value={initialValues.id_number}
                                mask={getMaskForIdType(initialValues.id_type)?.mask}
                            />
                        </div>
                        <div>
                            <label htmlFor="Religion">Religion</label>
                            <Select
                                placeholder="Select Religion"
                                options={religionOp}
                                id='Religion'
                                value={religionOp.find(option => option.value === initialValues.religion)}
                                // onChange={option => setFieldValue('religion', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                        </div>
                        <div>
                            <label htmlFor="matrial_status">Marital Status</label>
                            <Select
                                placeholder="Select status of marital"
                                options={maritalOp}
                                value={maritalOp.find(option => option.value === initialValues.marital_status)}
                                // onChange={option => setFieldValue('marital_status', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="boys">Boys</label> */}
                            {/* <Field name='boys' id="boys" type="number" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='boys'
                                id="boys"
                                type="number"
                                placeholder="Enter Boys Count"
                                label="Boys Count"
                                disabled={readOnly}
                                value={initialValues.boys}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="girls">Girls</label> */}
                            {/* <Field name='girls' id="girls" type="number" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='girls'
                                id="girls"
                                type="number"
                                placeholder="Enter Girls Count"
                                label="Girls Count"
                                disabled={readOnly}
                                value={initialValues.girls}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='address.street'
                                id="address.street"
                                type="text"
                                placeholder="Enter Street Address"
                                label="Street Address"
                                disabled={readOnly}
                                value={initialValues.address.street}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='address.city'
                                id="address.city"
                                type="text"
                                placeholder="Enter City"
                                label="City"
                                disabled={readOnly}
                                value={initialValues.address.city}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='address.state'
                                id="address.state"
                                type="text"
                                placeholder="Enter State"
                                label="State"
                                disabled={readOnly}
                                value={initialValues.address.state}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='address.country'
                                id="address.country"
                                type="text"
                                placeholder="Enter Country"
                                label="Country"
                                disabled={readOnly}
                                value={initialValues.address.country}
                            />
                        </div>
                        <div>
                            <InputBox
                                name='address.zipCode'
                                id="address.zipCode"
                                type="text"
                                placeholder="Enter Zip Code"
                                label="Zip Code"
                                disabled={readOnly}
                                value={initialValues.address.zip_code}
                            />
                        </div>

                        <div>
                            {/* <label htmlFor="father_name">Father Name</label> */}
                            {/* <Field name='father_name' id="father_name" type="text" placeholder="Enter Father Name" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='father_name'
                                id="father_name"
                                type="text"
                                placeholder="Enter Father Name"
                                disabled={readOnly}
                                label="Father Name"
                                value={initialValues.father_name}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="mother_name">Mother Name</label> */}
                            {/* <Field name='mother_name' id="mother_name" type="text" placeholder="Enter Mother Name" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='mother_name'
                                id="mother_name"
                                type="text"
                                placeholder="Enter Mother Name"
                                disabled={readOnly}
                                label="Mother Name"
                                value={initialValues.mother_name}
                            />
                        </div>
                        <div>
                            {/* <label htmlFor="witness_name">Witness Name</label> */}
                            {/* <Field name='witness_name' id="witness_name" type="text" placeholder="Enter Witness Name" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='witness_name'
                                id="witness_name"
                                type="text"
                                placeholder="Enter Witness Name"
                                disabled={readOnly}
                                label="Witness Name"
                                value={initialValues.witness_name}
                            />
                        </div>
                        <div>
                            <label htmlFor="witness_relation">Witness Relation</label>
                            <Select
                                placeholder="Select witness relation"
                                options={relationOp} id='witness_relation'
                                value={relationOp.find(option => option.value === initialValues.witness_relation)}
                                // onChange={option => setFieldValue('witness_relation', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality">Nationality</label>
                            <Select placeholder="Select Nationality"
                                options={nationalityOp} id='nationality'
                                value={nationalityOp.find(option => option.value === initialValues.nationality)}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="banks">Finincial Institution</label>
                            <Select
                                placeholder="Select Finincial Institution"
                                options={bankOp} id='banks'
                                value={bankOp.find(option => option.value === initialValues.finincial_institution)}
                                // onChange={option => setFieldValue('finincial_institution', option ? option.value : '')}
                                onChange={option => console.log(option)}
                                isDisabled={readOnly}
                                styles={customStyles}
                                menuIsOpen={readOnly ? false : undefined}
                            />
                        </div>

                        {initialValues.medication && <div>
                            {/* <label htmlFor="medication_type">Medication Type</label> */}
                            {/* <Field name='medication_type' id="medication_type" type="text" placeholder="Medication Type" className="form-input" disabled={readOnly} required /> */}
                            <InputBox
                                name='medication_type'
                                id="medication_type"
                                type="text"
                                placeholder="Medication Type"
                                disabled={readOnly}
                                label='Medication Type'
                                value={initialValues.medication_type}
                            />

                        </div>}
                        <div className=''>
                            <label htmlFor="id_type">Medication</label>
                            <div className="flex gap-3">
                                <label className="inline-flex">
                                    <input
                                        type="radio"
                                        name="square_text_radio"
                                        className="form-radio text-info rounded-none peer"
                                        checked={initialValues.medication === true}
                                        // onChange={() => setFieldValue('medication', true)}
                                        onChange={() => console.log('Medication Yes')}
                                        disabled={readOnly}
                                        required
                                    />
                                    <span className="peer-checked:text-info">Yes</span>
                                </label>
                                <label className="inline-flex">
                                    <input
                                        type="radio"
                                        name="square_text_radio"
                                        className="form-radio text-secondary rounded-none peer"
                                        checked={initialValues.medication === false}
                                        onChange={() => console.log('Medication No')}
                                        disabled={readOnly}
                                        required
                                    />
                                    <span className="peer-checked:text-secondary">No</span>
                                </label>
                            </div>
                        </div>

                        {
                            !readOnly && (
                                <div className="mt-3 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        Save
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
