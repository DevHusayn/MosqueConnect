import React, { useState, useContext } from 'react';
import { AdminContext } from '../App';

export default function Contact() {
    const { isAdmin } = useContext(AdminContext);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    // Demo feedback list for admin
    const [feedback, setFeedback] = useState([
        { id: 1, name: 'Aisha', email: 'aisha@email.com', message: 'Thank you for the new prayer times!', category: 'General', read: false },
        { id: 2, name: 'Omar', email: 'omar@email.com', message: 'Please add more events for youth.', category: 'Events', read: true },
    ]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        // Send email using mailto as a fallback (for demo only)
        const subject = encodeURIComponent('MosqueConnect Contact/Feedback from ' + form.name);
        const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`);
        window.location.href = `mailto:husaynmubarak0@gmail.com?subject=${subject}&body=${body}`;
        // In a real app, send to backend API to deliver to husaynmubarak0@gmail.com
    }

    function markAsRead(id) {
        setFeedback(fb => fb.map(f => f.id === id ? { ...f, read: true } : f));
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-24 font-sans bg-base min-h-screen">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Feedback Form */}
                <div className="flex-1 bg-white rounded-3xl shadow-card p-10 border border-base-sand">
                    <h1 className="text-2xl font-bold text-emerald mb-6 tracking-tight">Contact / Feedback</h1>
                    {submitted ? (
                        <div className="bg-base-sand text-emerald p-6 rounded text-base font-medium text-center">Thank you for your feedback!</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form" role="form">
                            <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="w-full border border-base-sand rounded p-3 bg-base text-emerald text-base focus:ring-2 focus:ring-gold outline-none" aria-label="Name" />
                            <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full border border-base-sand rounded p-3 bg-base text-emerald text-base focus:ring-2 focus:ring-gold outline-none" aria-label="Email" />
                            <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Message" className="w-full border border-base-sand rounded p-3 bg-base text-emerald text-base focus:ring-2 focus:ring-gold outline-none" aria-label="Message" />
                            <button type="submit" className="bg-emerald text-white px-6 py-3 rounded font-semibold text-base shadow-sm hover:bg-gold hover:text-emerald transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">Send</button>
                        </form>
                    )}
                </div>
                {/* Admin Feedback Inbox */}
                {isAdmin && (
                    <div className="flex-1 bg-white rounded-3xl shadow-card p-10 border border-base-sand">
                        <h2 className="text-xl font-bold text-emerald mb-6 tracking-tight">Feedback Inbox</h2>
                        <div className="space-y-4">
                            {feedback.map(f => (
                                <div key={f.id} className={`border rounded p-3 ${f.read ? 'border-base-sand bg-base' : 'border-gold bg-gold/10'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-emerald">{f.name}</span>
                                        <span className="text-xs text-text-muted bg-base-sand rounded px-2 py-0.5">{f.category}</span>
                                    </div>
                                    <div className="text-emerald mb-2">{f.message}</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-text-muted">{f.email}</span>
                                        {!f.read && <button onClick={() => markAsRead(f.id)} className="text-xs px-2 py-1 rounded bg-emerald text-gold font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2">Mark as read</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
