import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ showToast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-semibold text-base transition-all
                    ${toast.type === 'success' ? 'bg-emerald text-white' : 'bg-red-600 text-white'}`}
                >
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
}
