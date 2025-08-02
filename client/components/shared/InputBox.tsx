'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

type TInputField = {
    name: string;
    type: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel';
    placeholder: string;
    id?: string;
    value?: string | null | undefined | number;
    icon?: string;
    errors?: any;
    disabled?: boolean;
    className?: string;
    label?: string;
};

export default function InputBox({ name, type, id, value, placeholder, icon, errors, disabled = false, className = '', label }: TInputField) {
    console.log('errors', errors);
    const [isPassVisible, setIsPassVisible] = useState(false);
    return (
        <div >
            <div className='relative'>
                {label && <label htmlFor={id} className='pl-2'>{label}</label>}

                <input
                    name={name}
                    type={isPassVisible ? 'text' : type}
                    placeholder={placeholder}
                    defaultValue={value ?? undefined}
                    id={id}
                    disabled={disabled}
                    className={`form-input  placeholder:text-gray-400 ${errors ? 'border-red-500' : ''} ${className}`}
                />

                {icon && (<i className={`fi input-icon ${icon}`} />)}
                {
                    type === 'password' && (
                        isPassVisible ? (<EyeSlashIcon
                            className=" absolute text-gray-500 size-5 top-[8px] right-2 cursor-pointer"
                            onClick={() => setIsPassVisible(false)}
                        />) : (<EyeIcon
                            className=" absolute text-gray-500 size-5 top-[8px] right-2 cursor-pointer"
                            onClick={() => setIsPassVisible(true)}
                        />)
                    )
                }
            </div>

            {
                errors && errors.map((error: string, index: number) => (
                    <p key={index} className='text-red-500  pt-1 text-sm '>- {error}</p>
                ))
            }
        </div>

    )
}
