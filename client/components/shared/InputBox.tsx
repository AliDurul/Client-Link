'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

type TInputField = {
    name: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    id?: string;
    value?: string;
    icon?: string;
    errors?: any;
    disabled?: boolean;
};

export default function InputBox({ name, type, id, value, placeholder, icon, errors, disabled = false }: TInputField) {
    const [isPassVisible, setIsPassVisible] = useState(false);
    return (
        <div >
            <div className='relative'>
                <input
                    name={name}
                    type={isPassVisible ? 'text' : type}
                    placeholder={placeholder}
                    defaultValue={value}
                    id={id}
                    disabled={disabled}
                    className={`form-input  placeholder:text-gray-400 ${errors ? 'border-red-500' : ''}`}
                />


                {/* <i className={`fi input-icon ${icon}`} /> */}
                {
                    type === 'password' && (
                        isPassVisible ? (<EyeSlashIcon
                            className=" absolute size-6 top-1.5 right-2 cursor-pointer"
                            onClick={() => setIsPassVisible(false)}
                        />) : (<EyeIcon
                            className=" absolute size-6 top-1.5 right-2 cursor-pointer"
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
