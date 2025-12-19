import React from 'react';

export default function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-card p-6 min-w-[320px] max-w-[90vw] relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gold text-xl font-bold"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                    <button
                        aria-label="Close modal"
                        className="absolute top-4 right-4 text-2xl text-gold hover:text-emerald focus:outline-none"
                        onClick={onClose}
                    >
                        &times;
                    </button>
