import Image from 'next/image';
import React from 'react'
import logo from '@/public/assets/images/logo.png';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function page() {
    return (
        <div className="flex min-h-screen">

            <div className="hidden min-h-screen w-1/2 flex-col  items-center justify-center bg-gradient-to-t from-[#ff1361bf] to-[#44107A] p-4 text-white dark:text-black lg:flex">
                <div className="mx-auto mb-5 w-full">
                    <Image
                        src={logo}
                        alt="clientLink logo"
                        className="mx-auto lg:max-w-[370px] xl:max-w-[500px]"
                    />
                </div>
                <h3 className="mb-4 text-center text-3xl font-bold">
                    ------------------
                </h3>
                <p>
                    ---------------------------------------------------
                </p>
            </div>

            <div className="relative flex flex-col w-full items-center justify-between lg:w-1/2">
                <div className="max-w-[480px] my-auto p-5 md:p-10">
                    <h2 className="mb-3 text-3xl font-bold">Sign In</h2>
                    <p className="mb-7">Enter your email and password to login</p>
                    <LoginForm />
                </div>
                <div className="border-t p-5 w-full border-gray-900/10 md:flex md:items-center md:justify-between ">
                    <div className="flex space-x-6 md:order-2">
                        <Link href='https://www.paylinkzm.com/' target="_blank" className="text-gray-500 hover:text-gray-400">
                            <Image src="/assets/images/logo.png" alt="facebook" width={100} height={100} />
                        </Link>
                    </div>
                    <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
                        &copy; {new Date().getFullYear()} Paylink, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </div>

    );
}
