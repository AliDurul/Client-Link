import InputBox from '@/components/shared/InputBox';
import { InvoiceItem } from '@/types';
import Select from 'react-select';
import React, { memo, useMemo } from 'react';

interface InvoiceSummaryProps {
    invoiceItems: InvoiceItem[];
    shippingCost: number;
    discount: number;
    tax: number;
    paymentType: string;
    onValueChange: (field: string, value: any) => void;
    isPending: boolean;
    isEdit?: boolean;
}

const InvoiceSummary = memo(({
    invoiceItems,
    shippingCost,
    discount,
    tax,
    paymentType,
    onValueChange,
    isPending,
    isEdit
}: InvoiceSummaryProps) => {
    const totalDiscounts = useMemo(() =>
        invoiceItems.reduce((acc, item) => acc + item.discount, 0) + discount,
        [invoiceItems, discount]
    );

    const totalSubtotal = useMemo(() =>
        invoiceItems.reduce((total, item) => total + item.total_price, 0) + shippingCost - discount,
        [invoiceItems, shippingCost, discount]
    );

    return (
        <div className="mt-6 w-full xl:mt-0 xl:w-96">
            <div className="panel mb-5">
                <InputBox
                    id='shipping_cost'
                    name='shipping_cost'
                    type='number'
                    label='Shipping Charge ($)'
                    placeholder="Shipping Charge"
                    className='form-input mb-4'
                    value={shippingCost}
                    onChange={(e) => onValueChange('shipping_cost', Number(e.target.value))}
                />

                <InputBox
                    id='discount'
                    name='discount'
                    type='number'
                    label='Invoice Discount ($)'
                    placeholder="Discount"
                    className='form-input'
                    value={discount}
                    onChange={(e) => onValueChange('discount', Number(e.target.value))}
                />

                <div className="mt-4">
                    <label htmlFor="payment-method">Accept Payment Via</label>
                    <Select
                        placeholder="Select The Payment"
                        options={[
                            { value: 'cash', label: 'Cash' },
                            { value: 'card', label: 'Card' },
                            { value: 'bank', label: 'Bank Transfer' }
                        ]}
                        value={{ value: paymentType, label: paymentType }}
                        onChange={option => onValueChange('payment_type', option ? option.value : '')}
                        className='flex-1'
                        required
                    />
                </div>
            </div>

            <div className="panel">
                <div className="mt-4 flex items-center justify-between">
                    <div>Tax(%)</div>
                    <div>{tax}%</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div>Shipping Rate($)</div>
                    <div>${shippingCost.toFixed(2)}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div>Discount ($)</div>
                    <div>${totalDiscounts.toFixed(2)}</div>
                </div>
                <div className="mt-4 flex items-center justify-between font-semibold">
                    <div>Total</div>
                    <div>${totalSubtotal.toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                    <button type="submit" className="btn btn-success w-full gap-2">
                        {isPending ? 'Saving...' : isEdit ? 'Update Invoice' : 'Create Invoice'}
                    </button>
                </div>
            </div>
        </div>
    );
});

InvoiceSummary.displayName = 'InvoiceSummary';
export default InvoiceSummary;