import React from 'react';

export const ModalContext = React.createContext({
    showModal: () => { },
    hideModal: () => { },
});

export function ModalProvider({ children }) {
    const [modal, setModal] = React.useState({ open: false, content: null });

    const showModal = content => setModal({ open: true, content });
    const hideModal = () => setModal({ open: false, content: null });

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-xl shadow-card p-6 min-w-[320px] max-w-[90vw] relative">
                        <button
                            aria-label="Close modal"
                            className="absolute top-4 right-4 text-2xl text-gold hover:text-emerald focus:outline-none"
                            onClick={hideModal}
                        >
                            &times;
                        </button>
                        {modal.content}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}