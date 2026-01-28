import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { handlePayment } from '../utils/payment';

const API_URL = import.meta.env.VITE_API_URL;

const Pricing = ({ user }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/api/plans`)
            .then(res => {
                setPlans(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubscribe = (plan) => {
        if (plan.price === 0) return alert("You are on free plan!");
        if (!user) {
            alert("Please login to subscribe.");
            return;
        }
        // Using existing payment handler
        handlePayment(plan.price, "SUBSCRIPTION_" + plan.name.toUpperCase(), user);
    };

    if (loading) return <div className="p-20 text-center">Loading Plans...</div>;

    return (
        <div className="min-h-screen bg-neutral-50 py-20 px-4">
            <div className="max-w-screen-xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-neutral-900 mb-4">Choose Your Plan</h2>
                <p className="text-xl text-neutral-500 mb-16">Unlock the full potential of CodeBazaar</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan._id} className={`bg-white rounded-2xl shadow-xl p-8 border ${plan.recommended ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-neutral-100'} relative flex flex-col`}>
                            {plan.recommended && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                            <div className="text-4xl font-extrabold text-neutral-900 mb-6">
                                ₹{plan.price}<span className="text-lg font-normal text-neutral-500">/{plan.duration}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-neutral-600">
                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                className={`w-full py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1 ${plan.recommended
                                    ? 'bg-primary hover:bg-primary-dark text-white shadow-lg'
                                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
