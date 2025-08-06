import FaqCreateBtn from '@/components/dashboard/faq/FaqCreateBtn'
import FaqList from '@/components/dashboard/faq/FaqList'
import FaqModal from '@/components/dashboard/faq/FaqModal'
import NoDataFound from '@/components/shared/NoDataFound'
import TopPageNavigation from '@/components/shared/TopPageNavigation'
import { getAllData } from '@/lib/features/shared/actionUtils'
import React from 'react'

export default async function page() {

    const faqs = await getAllData({ url: 'faqs/' });

    return (
        <div>
            {/* <TopPageNavigation /> */}

            <div className="pt-5">
                <div className='flex justify-between items-center max-w-[80%] mx-auto'>
                    <h2 className="text-center text-xl font-bold md:text-3xl">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <FaqCreateBtn />
                </div>
            </div>

            {
                faqs?.result.length > 0 ? (<FaqList faqs={faqs.result} />) : (<NoDataFound msg={'No FAQs found.'} />)
            }
            <FaqModal />

        </div>
    )
}
