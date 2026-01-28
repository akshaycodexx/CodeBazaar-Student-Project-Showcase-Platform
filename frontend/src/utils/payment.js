import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const handlePayment = async (amount, projectId, user) => {
    const res = await loadRazorpayScript();

    if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
    }

    try {
        // 1. Create Order
        const { data: order } = await axios.post(`${API_URL}/api/payment/create-order`, { amount }, { withCredentials: true });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: order.amount,
            currency: order.currency,
            name: "CodeBazaar",
            description: "Project Purchase",
            image: "/logo.png", // Optional: Add your logo
            order_id: order.id,
            handler: async function (response) {
                try {
                    // 2. Verify Payment
                    const verifyRes = await axios.post(`${API_URL}/api/payment/verify-payment`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        projectId
                    }, { withCredentials: true });

                    if (verifyRes.data.status === 'success') {
                        toast.success('Payment Successful!');
                    } else {
                        toast.error('Payment verification failed.');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Payment Verification Error');
                }
            },
            prefill: {
                name: user?.fullName || "",
                email: user?.email || "",
            },
            theme: {
                color: "#6366f1", // Primary color (Indigo)
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

    } catch (error) {
        console.error("Payment Error:", error);
        toast.error('Something went wrong with the payment.');
    }
};
