import InputBox from '@/components/shared/InputBox';
import { InvoiceItem } from '@/types';
import React, { memo } from 'react';
import Select from 'react-select';


interface InvoiceItemTableProps {
    items: InvoiceItem[];
    productOp: { value: string; label: string; price?: number }[];
    onItemChange: (index: number, field: string, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (index: number) => void;
}

const InvoiceItemsTable = memo(({ items, productOp, onItemChange, onAddItem, onRemoveItem }: InvoiceItemTableProps) => {
    return (
        <div className="mt-8">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th className="w-1">Quantity</th>
                        <th className="w-1">Price</th>
                        <th className="w-1">Unit Discount</th>
                        <th className='w-1'>Total</th>
                        <th className="w-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr className="align-top" key={index}>
                            <tr className="align-top" key={index}>
                                <td>
                                    <Select
                                        placeholder="Select The Product"
                                        name={`invoice_items[${index}].product.id`}
                                        options={productOp}
                                        value={productOp.find(option => option.value === item.product._id)}
                                        onChange={option => {
                                            if (option) {
                                                onItemChange(index, 'product._id', option.value);
                                                onItemChange(index, 'product.name', option.label);
                                                onItemChange(index, 'unit_price', option.price || 0);
                                                const totalPrice = (item.quantity * (option.price || 0)) - item.discount;
                                                onItemChange(index, 'total_price', totalPrice);
                                            }
                                        }}
                                        className="min-w-[200px] "
                                        required
                                    />

                                </td>
                                <td>
                                    <InputBox
                                        name={`invoice_items[${index}].quantity`}
                                        type='number'
                                        className='w-32'
                                        placeholder="Quantity"
                                        value={item.quantity}
                                        min={1}
                                        onChange={e => {
                                            const newQuantity = Number(e.target.value);
                                            onItemChange(index, 'quantity', newQuantity);

                                            // Recalculate total price
                                            const unitPrice = item.unit_price;
                                            const discount = item.discount;
                                            const totalPrice = (newQuantity * unitPrice) - discount;
                                            onItemChange(index, 'total_price', totalPrice);
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        id={index.toString()}
                                        name={`invoice_items[${index}].product.price`}
                                        type="number"
                                        className="form-input w-32"
                                        placeholder="Price"
                                        value={item.unit_price}
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <InputBox
                                        name={`invoice_items[${index}].product.discount`}
                                        type='number'
                                        className='w-32'
                                        placeholder="Discount"
                                        value={item.discount}
                                        onChange={e => {
                                            const newDiscount = Number(e.target.value);
                                            onItemChange(index, 'discount', newDiscount);

                                            // Recalculate total price
                                            const quantity = item.quantity;
                                            const unitPrice = item.unit_price;
                                            const totalPrice = (quantity * unitPrice) - newDiscount;
                                            onItemChange(index, 'total_price', totalPrice);
                                        }}
                                    />
                                </td>
                                <td className="flex items-center justify-center font-bold  text-lg">
                                    ${item.total_price.toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(index)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                <button type="button" className="btn btn-primary" onClick={onAddItem}>
                    Add Item
                </button>
            </div>
        </div>
    );
});

export default InvoiceItemsTable;