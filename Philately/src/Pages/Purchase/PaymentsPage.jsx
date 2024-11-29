import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

const PaymentsPage = () => {
    const inputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        cardNumber: '',
        expDate: '',
        cvv: '',
        paymentMethod: ''
    });
    const { totalAmount } = useSelector(state => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [upiId, setUpiId] = useState('');
    const [upiQRData, setUpiQRData] = useState('');
    const UpiId = 'philatelystore@upi';
    const businessName = "Philately Store";
    const amount = totalAmount.toFixed(2);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    useEffect(() => {
        if (paymentMethod === 'upi') {
            // const qrData = `upi://pay?pa=${upiId || 'default@upi'}&pn=PhilatelyStore&am=${totalAmount.toFixed(2)}&cu=INR`;
            const qrData = `upi://pay?pa=${UpiId}&pn=${businessName}&am=${amount}&cu=INR&mode=02&purpose=00`;
            setUpiQRData(qrData);
        }
    }, [paymentMethod, upiId, totalAmount]);

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        const handleInput = (e) => {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 4 digits
            if (value.length > 4) {
                value = value.slice(0, 4);
            }

            // Format with slash
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }

            // Update input value and formData
            e.target.value = value;
            setFormData(prevState => ({
                ...prevState,
                expDate: value
            }));
        };

        input.addEventListener('input', handleInput);

        return () => {
            input.removeEventListener('input', handleInput);
        };
    }, []);

    const handleCardNumberChange = (e) => {
        // Remove non-digit characters
        let value = e.target.value.replace(/\D/g, '');

        // Limit to 16 digits
        if (value.length > 16) {
            value = value.slice(0, 16);
        }

        // Format with hyphens every 4 digits
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');

        setFormData(prevState => ({
            ...prevState,
            cardNumber: formattedValue
        }));
    };

    const handleSubmitPayment = async (e) => {
        const email = currentUser.data.email;
        e.preventDefault();

        // Validate form data
        if (!currentUser || !currentUser.data || !currentUser.data._id) {
            console.error('User not logged in');
            return;
        }

        const userId = currentUser.data._id;
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString();

        // Prepare payment data
        const paymentData = {
            ...formData,
            cardNumber: formData.cardNumber.replace(/-/g, ''), // Remove hyphens
            amount: totalAmount.toFixed(2),
            userId,
            paymentMethod,
            date: formattedDate,
            email
        };

        try {
            const response = await fetch('/api/pay/paymentGateway', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Payment processing failed');
            }

            const result = await response.json();
            console.log('Payment processed:', result);

            const { orderId } = result;

            localStorage.setItem('recentOrderId', orderId);

            setIsModalVisible(true)

            // Optional: Add success handling (e.g., show success message, redirect)
            navigate('/purchase/order_history', { state: { orderId } })

        } catch (error) {
            console.error('Payment error:', error);
            alert(`Payment failed: ${error.message}`);
        }
    };

    return (
        <>
            <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="animate__animated animate__fadeIn animate__faster text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>

                        <div className={`mt-6 sm:mt-8 lg:flex ${paymentMethod === 'upi' ? 'lg:flex-col' : 'lg:flex-row'} lg:gap-6`}>
                            <div className='animate__animated animate__zoomIn animate__faster lg:flex lg:items-start lg:gap-12 w-full'> {/* Set width to half */}
                                <form action="#" onSubmit={handleSubmitPayment} className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:p-8">
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Full name *</label>
                                            <input type="text" id="fullName" onChange={handleChange} value={formData.fullName} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Name on card" required />
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                            <label htmlFor="cardNumber" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Card number * </label>
                                            <input type="text" id="cardNumber"
                                                onChange={(e) => {
                                                    handleCardNumberChange(e);
                                                }}
                                                maxLength="19"
                                                value={formData.cardNumber}
                                                pattern="^(\d{4}-){3}\d{4}$"
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                                placeholder="xxxx-xxxx-xxxx-xxxx"
                                                required />
                                        </div>

                                        <div>
                                            <label html for="expDate" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                Card expiration *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={inputRef}
                                                    id="expDate"
                                                    type="text"
                                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="cvv" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">CVV *</label>
                                            <input type="password" id="cvv" onChange={handleChange} value={formData.cvv} maxLength="3" pattern="\d{3}" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Payment Method *</label>
                                        <select className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                handleChange(e);
                                                handlePaymentMethodChange(e);
                                            }}
                                            required
                                        >
                                            <option>Select a payment method</option>
                                            <option value="credit_card">Credit/Debit Card</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="upi">UPI</option>
                                            <option value="net_banking">Net Banking</option>
                                            <option value="wallet">Digital Wallet</option>
                                        </select>
                                    </div>

                                    {/* UPI specific fields */}
                                    {paymentMethod === 'upi' && (
                                        <div className="mb-6">
                                            <label
                                                htmlFor="upiId"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                UPI ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="upiId"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                                                placeholder="Enter UPI ID (e.g., yourname@upi)"
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        disabled={!paymentMethod}
                                    >
                                        Pay now
                                    </button>
                                </form>


                                {/* UPI QR Code Section */}
                                {paymentMethod === 'upi' && (
                                    <div className="mt-6 grow sm:mt-8 lg:mt-0 flex flex-col items-center">
                                        <div className="bg-white p-4 rounded-2xl shadow-md">
                                            <h3 className="text-lg font-semibold mb-4 text-center">
                                                Scan UPI QR Code to Pay
                                            </h3>
                                            <div className="flex justify-center">
                                                <QRCodeSVG
                                                    value={upiQRData}
                                                    size={256}
                                                    level={'H'}
                                                    includeMargin={true}
                                                />
                                            </div>
                                            <p className="mt-4 text-center text-sm text-gray-600">
                                                Amount: Rs. {totalAmount.toFixed(2)}
                                            </p>
                                            {upiId && (
                                                <p className="text-center text-sm text-gray-600">
                                                    UPI ID: {upiId}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pt-9 text-center">
                                            <p className="text-sm text-gray-500">
                                                Scan with any UPI app or use the generated QR code
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Amount Details Section - Now Full Width */}
                            <div className="animate__animated animate__zoomIn animate__faster w-full mt-2"> {/* Set width to half */}
                                <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                                    <div className="space-y-2">
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400 ">Original price</dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white">Rs. {(totalAmount + 75).toFixed(2)}</dd>
                                        </dl>

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                                            <dd className="text-base font-medium text-green-500">- Rs. 50</dd>
                                        </dl>

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Store Pickup</dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white">Free</dd>
                                        </dl>

                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">GST</dt>
                                            <dd className="text-base font-medium text-gray-900 dark:text-white">18 %</dd>
                                        </dl>
                                    </div>

                                    <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                                        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                                        <dd className="text-base font-bold text-gray-900 dark:text-white">Rs. {totalAmount.toFixed(2)}</dd>
                                    </dl>
                                </div>

                                {/* Payment Method Logos */}
                                <div className="mt-4 flex items-center justify-center gap-8"> {/* Reduced mt-6 to mt-4 */}
                                    <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
                                    <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
                                    <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
                                    <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
                                    <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
                                    <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
                                </div>

                                <nav class="flex items-center justify-center p-8" aria-label="Breadcrumb">
                                    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                        <li aria-current="page">
                                            <div className="flex items-center">
                                                <span className="ms-1 text-sm font-2xl text-gray-500 md:ms-2 dark:text-gray-900">Your Cart</span>
                                                <svg className="rtl:rotate-180 w-3 h-3 text-gray-500 mx-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                                </svg>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="flex items-center">
                                                <a href="#" class="ms-1 text-md font-xl text-gray-500 hover:text-blue-600 md:ms-2 dark:text-gray-900 dark:hover:text-white">Delivery Address</a>
                                            </div>
                                        </li>
                                        <li aria-current="page">
                                            <div class="flex items-center">
                                                <svg class="rtl:rotate-180 w-3 h-3 text-gray-900 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                                </svg>
                                                <span class="ms-1 text-2xl font-2xl text-gray-900 md:ms-2 dark:text-gray-900">Checkout</span>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>

                            </div>
                        </div>

                        <p className="animate__animated animate__fadeIn animate__faster flex gap-2 justify-center mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 lg:text-left">
                            Payment processed by <a href="#" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Stripe</a> for <a href="/" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Philately Store</a> - India
                        </p>
                    </div>
                </div>
                {isModalVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="success-icon">
                                <img src="/src/images/Logos/modalCheck.png" alt="check" />
                            </div>
                            <h2 className="modal-title">Delivery Address Saved Successfully!</h2>
                            <p className="modal-message">You will be redirected shortly...</p>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default PaymentsPage;