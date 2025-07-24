'use client';
import { authCredentials } from '@/lib/features/auth/authActions'
import { LoginFormState } from '@/types/auth'
import React, { useActionState, useEffect } from 'react'
import InputBox from '../shared/InputBox';
import { useRouter } from 'next/navigation';
import { coloredToast, forgetPasswordToast, successToast } from '@/lib/utility/sweetAlerts';


const initialState: LoginFormState = {
    success: false,
    message: '',
    errors: {},
    inputs: { email: '', password: '' }
};

export default function LoginForm() {
    const [state, action, isPending] = useActionState(authCredentials, initialState);
    const router = useRouter();

    useEffect(() => {
        if (!state?.message) return;

        if (state.success) {
            successToast(state.message);
            const timer = setTimeout(() => router.push('/'), 2000);
            return () => clearTimeout(timer);
        } else {
            coloredToast("danger", state.message);
        }
    }, [state])


    return (
        <form action={action} className="space-y-5">
            <div>
                <label htmlFor="email">Email</label>
                <InputBox
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    id="email"
                    value={state?.inputs?.email as string}
                    errors={state?.errors?.email}
                    disabled={isPending}
                />

            </div>
            <div>
                <label htmlFor="password">Password</label>
                <InputBox
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    id="password"
                    value={state?.inputs?.password as string}
                    errors={state?.errors?.password}
                    disabled={isPending}
                />

                <div className="flex justify-end mt-2">
                    <span
                        onClick={forgetPasswordToast}
                        className="text-sm text-gray-500 font-normal cursor-pointer"
                    >
                        Forget Your password ?
                    </span>
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isPending}
            >
                {isPending && (
                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle mr-4"></span>
                )}
                {isPending ? "LOADING.." : "SIGN IN"}
            </button>
        </form>
    )
}
