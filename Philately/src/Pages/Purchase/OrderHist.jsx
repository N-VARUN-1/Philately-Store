import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Badge } from "flowbite-react";

export default function OrderHist() {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchOrders = async () => {
            const userId = currentUser?.data?._id; // Safely access userId // Debugging log

            if (!userId) {
                setError('No User ID found.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/pay/paymentOrders/${userId}`); // Fetch all orders for the user
                console.log('Response status:', response.status); // Debugging log
                if (!response.ok) {
                    const errorText = await response.text(); // Get the error text from the response
                    console.error('Error fetching orders:', errorText); // Log the error text
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                const data = await response.json();

                const processedOrders = data.map(order => ({
                    ...order,
                    // Explicitly parse the date
                    formattedDate: order.date
                        ? new Date(order.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'No date available',
                }));
                console.log('Fetched orders:', data); // Log the fetched orders
                setOrders(processedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [currentUser]); // Depend on currentUser  to trigger effect when it changes

    return (
        <section className="min-h-screen bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        My Orders
                    </h2>

                    <div className="mt-6 flow-root sm:mt-8">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <div
                                        key={index}
                                        className="animate__animated animate__fadeInDown flex flex-wrap items-center gap-y-4 py-6"
                                    >
                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                                Order ID:
                                            </dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                <a href="#" className="hover:underline">
                                                    {order.orderId}
                                                </a>
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                                Date:
                                            </dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                {order.formattedDate}
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                                Price:
                                            </dt>
                                            <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                                {order.amount}
                                            </dd>
                                        </dl>

                                        <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                            <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                                Status:
                                            </dt>
                                            <dd className="mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium text-primary-800">
                                                <Badge color="info">In Transit</Badge>
                                            </dd>
                                        </dl>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No orders found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}