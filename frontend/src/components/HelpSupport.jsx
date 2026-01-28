import React, { useState } from 'react';
import { Mail, MessageCircle, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const HelpSupport = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "How do I upload a project?",
            answer: "Go to your dashboard or click 'Projects' in the navbar, then select 'Upload Project'. Fill in the details including GitHub link and demo URL."
        },
        {
            question: "Is the mentorship paid?",
            answer: "It depends on the mentor. Some mentors offer free sessions, while others charge a fee per session. The price is clearly listed on their profile."
        },
        {
            question: "How do I contact a recruiter?",
            answer: "If you have a Recruiter account, you can view candidate profiles and contact them directly. As a student, recruiters will contact you if your profile matches their needs."
        },
        {
            question: "What payment methods are supported?",
            answer: "We support all major payment methods including Credit/Debit Cards, UPI, and Netbanking via our secure Razorpay integration."
        }
    ];

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you shortly.");
        e.target.reset();
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">Help & Support</h1>
                    <p className="text-neutral-500">Find answers to common questions or get in touch with our team.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FileQuestion className="w-6 h-6 text-primary" /> Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                                <button
                                    className="flex justify-between items-center w-full text-left font-semibold text-neutral-800 hover:text-primary transition-colors py-2"
                                    onClick={() => toggleFaq(index)}
                                >
                                    {faq.question}
                                    {activeIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                {activeIndex === index && (
                                    <p className="text-neutral-600 mt-2 text-sm leading-relaxed animate-fade-in pl-4 border-l-2 border-primary/20">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-primary text-white rounded-xl p-8 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Live Chat</h3>
                        <p className="mb-6 text-primary-light">Chat with our support team in real-time for immediate assistance.</p>
                        <button className="bg-white text-primary font-bold py-2 px-6 rounded-lg w-full hover:bg-neutral-100 transition-colors">Start Chat</button>
                    </div>

                    <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900"><Mail className="w-5 h-5" /> Contact Us</h3>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <input type="email" placeholder="Your Email" required className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                            <textarea placeholder="How can we help?" required className="w-full border border-neutral-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-primary outline-none"></textarea>
                            <button type="submit" className="bg-neutral-900 text-white font-bold py-2 px-6 rounded-lg w-full hover:bg-black transition-colors">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
