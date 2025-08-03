import Image from 'next/image';
import React, { useRef, useState } from 'react'

export default function KycImageUpload() {
    const [images, setImages] = useState<any>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    return (
        <div className=" w-full mb-8" data-upload-id="profile_pic">
            <input
                type="file"
                name="profile_pic"
                ref={fileInputRef}
                onChange={() => {
                    const file = fileInputRef.current?.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setImages([{ dataURL: reader.result, file }]);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
                className='hidden'
                aria-hidden="true"
            />
            {
                images.length === 0 && <div className='flex gap-3 justify-center items-center'>
                    <div className="flex-1 inset-0 z-5 h-10 overflow-hidden rounded border border-[#f1f2f3] bg-[#f1f2f3] px-3 py-2 text-sm leading-6 text-[#333] select-none cursor-pointer"
                        onClick={() => fileInputRef.current?.click()} >
                        Choose Pic...
                    </div>
                    <div className="text-[#333] text-[26px]  cursor-pointer" title="Clear Image" onClick={() => { setImages([]); }}>×</div>
                </div>
            }

            {images.map((image: any, index: number) => (
                <div key={index} className="custom-file-container__image-preview relative mt-3">
                    <Image width={100} height={100} src={image.dataURL || ''} alt="user profile" className="m-auto max-w-md  rounded-full  object-cover" />
                    <span className="absolute top-0 right-0 cursor-pointer text-gray-500 text-lg" onClick={() => setImages([])}>×</span>
                </div>
            ))}
            {images.length === 0 ? <Image width={100} height={100} src="/assets/images/file-preview.svg" className="m-auto  max-w-md  rounded-full object-cover mt-3" alt="user profile" /> : ''}
        </div>
    )
}
