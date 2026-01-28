import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
            setCartItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch cart");
            setLoading(false);
        }
    };

    const removeFromCart = async (projectId) => {
        try {
            const res = await axios.delete(`${API_URL}/api/cart/remove/${projectId}`, { withCredentials: true });
            setCartItems(res.data); // Update with returned new cart
            toast.success("Item removed");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + Number(item.price), 0);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            const totalAmount = calculateTotal();

            // 1. Create Razorpay Order
            const orderRes = await axios.post(`${API_URL}/api/payment/create-order`, { amount: totalAmount }, { withCredentials: true });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderRes.data.amount,
                currency: "INR",
                name: "CodeBazaar Checkout",
                description: `Purchase of ${cartItems.length} items`,
                order_id: orderRes.data.id,
                handler: async function (response) {
                    try {
                        // 2. Verify and Save Order
                        await axios.post(`${API_URL}/api/payment/verify-payment`, {
                            ...response,
                            projects: cartItems.map(item => item._id),
                            amount: totalAmount
                        }, { withCredentials: true });

                        toast.success("Purchase Successful!");
                        setCartItems([]); // Clear local cart state (backend already cleared)
                        navigate('/profile/me'); // Redirect to profile to see purchase history (or 'me' redirect)
                    } catch (err) {
                        toast.error("Payment verification failed");
                    }
                },
                theme: { color: "#4F46E5" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            toast.error("Checkout failed");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Cart...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-primary" /> Your Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-neutral-200">
                        <p className="text-xl text-neutral-500 mb-4">Your cart is empty.</p>
                        <button onClick={() => navigate('/getallprojects')} className="text-primary font-bold hover:underline">Browse Projects</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="md:col-span-2 space-y-4">
                            {cartItems.map(item => (
                                <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex gap-4 items-center">
                                    <img src={item.coverImageUrl} alt={item.title} className="w-24 h-16 object-cover rounded-lg bg-neutral-100" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-neutral-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-primary font-bold">₹{item.price}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary Panel */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 h-fit">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-neutral-600">
                                <span>Items ({cartItems.length})</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <div className="border-t border-neutral-100 my-4 pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
