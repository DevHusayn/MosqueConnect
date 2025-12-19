import { render, screen, fireEvent } from '@testing-library/react';
import AnnouncementList from '../components/AnnouncementList';
import { AdminContext } from '../App';
import { ModalProvider } from '../components/ModalProvider';
import { ToastProvider } from '../components/ToastProvider';
import React from 'react';

describe('AnnouncementList', () => {
    it('renders announcements and allows admin to add', () => {
        render(
            <AdminContext.Provider value={{ isAdmin: true, setIsAdmin: () => { } }}>
                <ToastProvider>
                    <ModalProvider>
                        <AnnouncementList />
                    </ModalProvider>
                </ToastProvider>
            </AdminContext.Provider>
        );
        expect(screen.getByText(/Friday Prayer/i)).toBeInTheDocument();
        expect(screen.getByText(/Community Iftar/i)).toBeInTheDocument();
        expect(screen.getByText('+ Add Announcement')).toBeInTheDocument();
    });
});
