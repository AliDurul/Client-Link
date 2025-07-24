'use client';
import { setFaq, setFaqModal } from '@/lib/features/faq/faqSlice';
import { useAppDispatch } from '@/lib/hooks';
import React from 'react'

export default function FaqCreateBtn() {
    const dispatch = useAppDispatch();
    return (
        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => { dispatch(setFaqModal(true)), dispatch(setFaq({ question: '', answer: '' })) }}>
            Add Question
        </button>
    )
}
