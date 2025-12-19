import React, { createContext, useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Events from './pages/Events';
import Contact from './pages/Contact';
import MosqueFinder from './pages/MosqueFinder';
import Navbar from './components/Navbar';

import Lectures from './pages/Lectures';
import LectureDetail from './pages/LectureDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './components/ModalProvider';
import { ToastProvider } from './components/ToastProvider';


// Context for admin role
export const AdminContext = createContext();

function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    // Persist lectures in localStorage
    const defaultLectures = [
        { id: 1, title: 'The Importance of Prayer', content: 'Prayer is the foundation of faith...', date: '2025-12-01' },
        { id: 2, title: 'Charity in Islam', content: 'Charity purifies wealth and the soul...', date: '2025-12-10' },
    ];
    const [lectures, setLectures] = useState(() => {
        const saved = localStorage.getItem('lectures');
        return saved ? JSON.parse(saved) : defaultLectures;
    });
    React.useEffect(() => {
        localStorage.setItem('lectures', JSON.stringify(lectures));
    }, [lectures]);
    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            <ToastProvider>
                <ModalProvider>
                    <Router>
                        <div className="min-h-screen bg-offwhite">
                            <Navbar />
                            {isAdmin && (
                                <div className="w-full bg-gold text-emerald text-center py-2 font-bold shadow-md z-50">
                                    Admin Mode Active (Demo only)
                                </div>
                            )}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/lectures" element={<Lectures lectures={lectures} setLectures={setLectures} />} />
                                <Route path="/lectures/:id" element={<LectureDetail lectures={lectures} />} />
                                <Route path="/mosques" element={<MosqueFinder />} />
                                <Route path="/contact" element={<Contact />} />
                            </Routes>
                        </div>
                    </Router>
                </ModalProvider>
            </ToastProvider>
        </AdminContext.Provider>
    );
}

export default App;
