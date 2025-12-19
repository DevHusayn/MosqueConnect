import React, { useContext, useState } from 'react';
import { AdminContext } from '../App';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { isAdmin, setIsAdmin } = useContext(AdminContext);
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="bg-emerald text-base fixed top-0 left-0 w-full z-40 font-sans shadow-none h-16 flex items-center px-6 border-b border-base-sand">
            <div className="flex items-center gap-3 flex-shrink-0">
                <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.2" fill="#C8A95122" />
                    <path d="M10 22V16a6 6 0 1 1 12 0v6" stroke="currentColor" strokeWidth="2.2" fill="none" />
                    <rect x="13" y="22" width="6" height="4" rx="2" fill="#C8A951" />
                </svg>
                <span className="font-extrabold text-2xl tracking-tight select-none text-base">MosqueConnect</span>
            </div>
            <div className="hidden md:flex items-center gap-8 ml-auto">
                <Link to="/" className="font-semibold text-base hover:text-olive transition relative group">
                    Home
                    <span className="block h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute left-0 -bottom-1 w-full"></span>
                </Link>
                <Link to="/events" className="font-semibold text-base hover:text-olive transition relative group">
                    Events
                    <span className="block h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute left-0 -bottom-1 w-full"></span>
                </Link>
                <Link to="/lectures" className="font-semibold text-base hover:text-olive transition relative group">
                    Lectures
                    <span className="block h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute left-0 -bottom-1 w-full"></span>
                </Link>
                <Link to="/mosques" className="font-semibold text-base hover:text-olive transition relative group">
                    Find Mosques
                    <span className="block h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute left-0 -bottom-1 w-full"></span>
                </Link>
                <Link to="/contact" className="font-semibold text-base hover:text-olive transition relative group">
                    Contact
                    <span className="block h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left absolute left-0 -bottom-1 w-full"></span>
                </Link>
                <div className="relative group ml-8">
                    <button
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold border border-gold text-xs transition shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${isAdmin ? 'bg-gold text-emerald' : 'bg-base text-emerald'}`}
                        onClick={() => setIsAdmin(v => !v)}
                        title={isAdmin ? 'Switch to Public Mode' : 'Switch to Admin Mode'}
                        aria-label={isAdmin ? 'Switch to Public Mode' : 'Switch to Admin Mode'}
                    >
                        {isAdmin ? 'Admin Mode' : 'Public Mode'}
                    </button>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-base text-xs text-center text-emerald border border-gold rounded shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                        Demo only: This switch does not provide real security.
                    </span>
                </div>
            </div>
            <button
                className="md:hidden ml-auto flex items-center px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                onClick={() => setMenuOpen(m => !m)}
                aria-label="Open navigation menu"
            >
                <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {menuOpen && (
                <div className="fixed inset-0 bg-emerald/95 z-50 flex flex-col items-center justify-start pt-24 animate-fade-in md:hidden">
                    <button
                        className="absolute top-6 right-6 text-gold bg-white rounded-full p-2 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <Link to="/" className="font-semibold text-base py-2 w-full text-center hover:text-gold" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/events" className="font-semibold text-base py-2 w-full text-center hover:text-gold" onClick={() => setMenuOpen(false)}>Events</Link>
                    <Link to="/lectures" className="font-semibold text-base py-2 w-full text-center hover:text-gold" onClick={() => setMenuOpen(false)}>Lectures</Link>
                    <Link to="/mosques" className="font-semibold text-base py-2 w-full text-center hover:text-gold" onClick={() => setMenuOpen(false)}>Find Mosques</Link>
                    <Link to="/contact" className="font-semibold text-base py-2 w-full text-center hover:text-gold" onClick={() => setMenuOpen(false)}>Contact</Link>
                    <div className="relative group mt-4">
                        <button
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold border border-gold text-xs transition shadow-none ${isAdmin ? 'bg-gold text-emerald' : 'bg-base text-emerald'}`}
                            onClick={() => setIsAdmin(v => !v)}
                            title={isAdmin ? 'Switch to Public Mode' : 'Switch to Admin Mode'}
                        >
                            {isAdmin ? 'Admin Mode' : 'Public Mode'}
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-base text-xs text-center text-emerald border border-gold rounded shadow-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
                            Demo only: This switch does not provide real security.
                        </span>
                    </div>
                </div>
            )}
        </nav>
    );
}
