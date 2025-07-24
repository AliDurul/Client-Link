import React from 'react'

export default function NoDataFound({msg}:{msg: string}) {
    return (
        <div className='text-center w-full p-4 rounded-full bg-grey/50 mt-4'>
            <p>
                {msg}
            </p>
        </div>
    )
}
