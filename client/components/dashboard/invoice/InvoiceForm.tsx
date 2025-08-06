import { Invoice } from '@/types';
import React, { use } from 'react'

interface InvoiceFormProps {
    invoice: Invoice | null;
    // isEdit: boolean;
    error: string | null;
}

export default function InvoiceForm({ invoice, error }: InvoiceFormProps) {


    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    console.log('invoice:', invoice);


    return (
        <div>InvoiceForm</div>
    )
}
