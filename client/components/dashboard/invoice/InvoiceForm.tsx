'use client';
import InputBox from '@/components/shared/InputBox';
import { Invoice, InvoiceItem, Kyc, Product } from '@/types';
import Image from 'next/image';
import React, { startTransition, useActionState, useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import Select from 'react-select';
import { paymentOp, statusOp } from './InvoiceConstraint';
import { ListItem } from '@mantine/core/lib/List/ListItem/ListItem';
import { InvoiceCrUpAction } from '@/lib/features/invoices/invoiceAction';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import InvoiceItemsTable from './form/InvoiceItemsTable';
import InvoiceSummary from './form/InvoiceSummary';



const initialInvoiceItem = {
    product: { _id: '', name: '' },
    quantity: 1,
    discount: 0,
    unit_price: 0,
    total_price: 0
}


interface InvoiceFormProps {
    invoice: Invoice | null;
    customers: Kyc[];
    products: Product[];
    isEdit: boolean;
    error: string | null;
}
export default function InvoiceForm({ invoice, customers, products, isEdit, error }: InvoiceFormProps) {

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    const router = useRouter();

    const customerOp = useMemo(() =>
        customers.map(customer => ({
            value: customer._id,
            label: `${customer.full_name}`,
            ...customer
        })), [customers]
    );

    const productOp = useMemo(() =>
        products.map(product => ({
            value: product._id,
            label: product.name,
            ...product
        })), [products]
    );

    const [initialValues, setInitialValues] = useState({
        _id: invoice?._id || '',
        tax: invoice?.tax || 16,
        customer: invoice?.customer?._id || '',
        due_date: invoice?.due_date || '',
        status: invoice?.status || 'draft',
        additional_note: invoice?.additional_note || '',
        shipping_cost: invoice?.shipping_cost || 0,
        discount: invoice?.discount || 0,
        payment_type: invoice?.payment_type || 'cash',
        invoice_items: invoice?.invoice_items || [initialInvoiceItem],
    });

    const [selectedCustomer, setSelectedCustomer] = useState<Kyc | undefined>(customers?.find(customer => customer._id === invoice?.customer._id));


    // Utility functions
    const [state, action, isPending] = useActionState(InvoiceCrUpAction, null)

    useEffect(() => {
        if (!state) return;

        if (state?.success) {
            // router.replace('/invoices')
            toast.success(state?.message || 'Operation completed successfully');
            const timer = setTimeout(() => router.replace('/invoices'), 500);
            return () => clearTimeout(timer);
        } else {

            toast.error(state?.message || 'Operation failed');

            if (typeof state?.errors === 'object' && !state?.success) {
                Object.entries(state?.errors).forEach(([key, value]) => {
                    toast.error(`${key}: ${value}`);
                });
            }
        }
    }, [state]);


    const handleValueChange = (field: string, value: any) => {
        setInitialValues(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleInvoiceItemChange = useCallback((index: number, field: string, value: any) => {
        setInitialValues(prev => {
            const updatedItems = [...prev.invoice_items];
            if (field.includes('.')) {
                const [parentField, childField] = field.split('.');
                updatedItems[index] = {
                    ...updatedItems[index],
                    [parentField]: {
                        ...((updatedItems[index] as any)[parentField] || {}),
                        [childField]: value
                    }
                };
            } else {
                updatedItems[index] = { ...updatedItems[index], [field]: value };
            }
            return { ...prev, invoice_items: updatedItems };
        });
    }, []);

    const getTotalDiscounts = (invoiceItems: InvoiceItem[]) => {
        return invoiceItems.reduce((acc, item) => acc + item.discount, 0) + Number(initialValues.discount)
    };

    const calculateTotalSubtotal = (invoiceItems: InvoiceItem[]) => {
        return invoiceItems.reduce((total, item) => total + item.total_price, 0) + Number(initialValues.shipping_cost) - Number(initialValues.discount);
    };

    const addItem = () => {
        setInitialValues(prev => ({
            ...prev,
            invoice_items: [...prev.invoice_items, { ...initialInvoiceItem }]
        }));
    };

    const removeItem = (index: number) => {
        setInitialValues(prev => ({
            ...prev,
            invoice_items: prev.invoice_items.filter((_, i) => i !== index)
        }));
    };
    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = { ...initialValues };

        startTransition(() => {
            action(formData);
        });
    };

    return (
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-2.5 xl:flex-row mt-5'>

            <div className="panel flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">

                <div className="flex flex-wrap justify-between px-4">
                    <div className="mb-6 w-full lg:w-1/2">
                        <div className="flex shrink-0 items-center text-black dark:text-white">
                            <Image src="/assets/images/logo.png" alt="img" width={150} height={50} />
                        </div>
                        <div className="mt-6 space-y-1 text-gray-500 dark:text-gray-400">
                            <div>2rd Floor, Paylink, Cairo road, Lusaka, Zambia</div>
                            <div>info@paylinkzm.com</div>
                            <div>+260 21144500(0/1) or 5500</div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 lg:max-w-fit">
                        <div className="flex items-center">
                            <label htmlFor="number" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Invoice Number
                            </label>
                            <input id="number" type="text" className="form-input w-2/3 lg:w-[250px]" readOnly />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="amount_due" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Due Date
                            </label>
                            <InputBox
                                name='due_date'
                                id="due_date"
                                type="date"
                                placeholder="Select Due Date"
                                className='w-2/3 lg:w-[250px]'
                                value={initialValues.due_date ? new Date(initialValues.due_date).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleValueChange('due_date', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />

                <div className="mt-8 px-4 flex flex-col justify-between lg:flex-row">

                    <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-16  space-y-4">
                        <div className="text-lg">Bill To :-</div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="customer" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Select Customer
                            </label>
                            <Select
                                id='customer'
                                name='customer'
                                placeholder="Select The Customer"
                                options={customerOp}
                                className='flex-1'
                                required
                                value={customerOp.find(option => option.value === initialValues.customer)}
                                onChange={option => { setSelectedCustomer(option ? option : undefined); handleValueChange('customer', option ? option.value : ''); }}
                            />
                        </div>
                        <div className='flex items-center'>
                            <label htmlFor="customer_name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Name
                            </label>

                            <div>
                                <input type="text" id='customer_name' className='form-input' placeholder='Enter Name' value={selectedCustomer?.full_name} readOnly />
                            </div>

                        </div>


                        <div className='flex items-center'>
                            <label htmlFor="customer_email" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Email
                            </label>
                            <div>
                                <input type="text" id='customer_email' className='form-input' placeholder='Enter Email' value={selectedCustomer?.email} readOnly />
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <label htmlFor="customer_address" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Address
                            </label>
                            <div>
                                <input type="text" id='customer_address' className='form-input' placeholder='Enter Address' value={selectedCustomer ? selectedCustomer?.address?.street + ', ' + selectedCustomer?.address?.city + ', ' + selectedCustomer?.address?.state + ', ' + selectedCustomer?.address?.country : ''} readOnly />
                            </div>
                        </div>

                        <div className='flex items-center'>
                            <label htmlFor="customer_phone" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Phone Number
                            </label>
                            <div>
                                <input type="text" id='customer_phone' className='form-input' placeholder='Enter Phone Number' value={selectedCustomer?.phone_number} readOnly />
                            </div>
                        </div>

                    </div>

                    <div className="mb-6 w-full lg:w-1/2 ltr:lg:mr-16  space-y-4">
                        <div className="text-lg">Payment Details:</div>
                        <div className="flex items-center">
                            <label htmlFor="status" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Status
                            </label>
                            <select
                                className='form-select flex-1'
                                id='status'
                                value={initialValues.status}
                                onChange={e => handleValueChange('status', e.target.value)}
                            >
                                {
                                    statusOp.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label htmlFor="status" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Account Number
                            </label>
                            <InputBox
                                id="customer_account_number"
                                type='text'
                                placeholder="Enter Account Number"
                            />
                        </div>

                        <div className=" flex items-center">
                            <label htmlFor="bank-name" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                Bank Name
                            </label>
                            <input id="bank-name" type="text" name="bank-name" className="form-input flex-1" placeholder="Enter Bank Name" />
                        </div>
                        <div className=" flex items-center">
                            <label htmlFor="swift-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                SWIFT Number
                            </label>
                            <input id="swift-code" type="text" name="swift-code" className="form-input flex-1" placeholder="Enter SWIFT Number" />
                        </div>
                        <div className=" flex items-center">
                            <label htmlFor="iban-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                                IBAN Number
                            </label>
                            <input id="iban-code" type="text" name="iban-code" className="form-input flex-1" placeholder="Enter IBAN Number" />
                        </div>

                    </div>
                </div>

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
                            {initialValues.invoice_items.length <= 0 && (
                                <tr>
                                    <td colSpan={5} className="!text-center font-semibold">
                                        No Item Available
                                    </td>
                                </tr>
                            )}
                            {initialValues.invoice_items.map((item, index) => {
                                return (
                                    <tr className="align-top" key={index}>
                                        <td>
                                            <Select
                                                placeholder="Select The Product"
                                                name={`invoice_items[${index}].product.id`}
                                                options={productOp}
                                                value={productOp.find(option => option.value === item.product._id)}
                                                onChange={option => {
                                                    if (option) {
                                                        // Update multiple fields when product is selected
                                                        handleInvoiceItemChange(index, 'product._id', option.value);
                                                        handleInvoiceItemChange(index, 'product.name', option.label);
                                                        handleInvoiceItemChange(index, 'unit_price', option.price || 0);


                                                        // Calculate total price
                                                        const quantity = initialValues.invoice_items[index].quantity;
                                                        const discount = initialValues.invoice_items[index].discount;
                                                        const totalPrice = (quantity * (option.price || 0)) - discount;
                                                        handleInvoiceItemChange(index, 'total_price', totalPrice);
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
                                                    handleInvoiceItemChange(index, 'quantity', newQuantity);

                                                    // Recalculate total price
                                                    const unitPrice = item.unit_price;
                                                    const discount = item.discount;
                                                    const totalPrice = (newQuantity * unitPrice) - discount;
                                                    handleInvoiceItemChange(index, 'total_price', totalPrice);
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
                                                    handleInvoiceItemChange(index, 'discount', newDiscount);

                                                    // Recalculate total price
                                                    const quantity = item.quantity;
                                                    const unitPrice = item.unit_price;
                                                    const totalPrice = (quantity * unitPrice) - newDiscount;
                                                    handleInvoiceItemChange(index, 'total_price', totalPrice);
                                                }}
                                            />
                                        </td>
                                        <td className="flex items-center justify-center font-bold  text-lg">
                                            ${item.total_price.toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
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
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="mt-6 flex flex-col justify-between px-4 sm:flex-row">
                        <div className="mb-6 sm:mb-0">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addItem}>
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 px-4">
                    <InputBox
                        id="notes"
                        name="additional_note"
                        type='textarea'
                        label='Notes'
                        placeholder="Notes...."
                        className='form-textarea min-h-[130px]'
                        value={initialValues.additional_note}
                        onChange={(e) => handleValueChange('additional_note', e.target.value)}
                    />
                </div>

            </div>

            <div className="mt-6 w-full xl:mt-0 xl:w-96">

                <div className="panel mb-5">
                    <InputBox
                        id='shipping_cost'
                        name='shipping_cost'
                        type='number'
                        label='Shipping Charge ($)'
                        placeholder="Shipping Charge"
                        className='form-input mb-4'
                        value={initialValues.shipping_cost}
                        onChange={(e) => handleValueChange('shipping_cost', Number(e.target.value))}
                    />

                    <InputBox
                        id='discount'
                        name='discount'
                        type='number'
                        label='Invoice Discount ($)'
                        placeholder="Discount"
                        className='form-input'
                        value={initialValues.discount}
                        onChange={(e) => handleValueChange('discount', Number(e.target.value))}
                    />
                    <div className="mt-4">
                        <label htmlFor="payment-method">Accept Payment Via</label>
                        <select
                            id='payment-method'
                            className='form-select flex-1'
                            onChange={e => handleValueChange('payment_type', e.target.value)}
                            value={initialValues.payment_type}
                        >
                            {
                                paymentOp.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="panel">
                    <div className=''>
                        <div className="mt-4 flex items-center justify-between">
                            <div>Tax(%)</div>
                            <div>{initialValues.tax}%</div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div>Shipping Rate($)</div>
                            <div>${Number(initialValues.shipping_cost).toFixed(2)}</div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div>Discount ($)</div>
                            <div>${getTotalDiscounts(initialValues.invoice_items).toFixed(2)}</div>
                        </div>
                        <div className="mt-4 flex items-center justify-between font-semibold">
                            <div>Total</div>
                            <div>${calculateTotalSubtotal(initialValues.invoice_items).toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4  mt-4">
                        <button type="submit" className="btn btn-success w-full gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                                <path
                                    d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            {isPending ? 'Saving...' : isEdit ? 'Update Invoice' : 'Create Invoice'}
                        </button>
                    </div>
                </div>
            </div>
        </form >
    )
}
