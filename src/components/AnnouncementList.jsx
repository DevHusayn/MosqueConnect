import React, { useContext, useState } from 'react';
import { useToast } from './ToastProvider';
import { AdminContext } from '../App';
import { ModalContext } from './ModalProvider';

export default function AnnouncementList() {
    const { isAdmin } = useContext(AdminContext);
    const { showModal, hideModal } = useContext(ModalContext);
    const [open, setOpen] = useState(null);
    const [announcements, setAnnouncements] = useState([
        { id: 1, title: 'Friday Prayer', content: 'Jumuah prayer will be held at 1:30 PM.', date: '2025-12-19', status: 'Published' },
        { id: 2, title: 'Community Iftar', content: 'Join us for community iftar this Saturday after Maghrib.', date: '2025-12-20', status: 'Draft' },
    ]);
    // Loading state for async support (future use)
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const [modal, setModal] = useState({ type: null, id: null });
    const [form, setForm] = useState({ title: '', content: '' });

    // Add Announcement

    function handleAdd() {
        function AddAnnouncementModal() {
            const [title, setTitle] = useState('');
            const [content, setContent] = useState('');
            return (
                <div>
                    <h2 className="text-lg font-bold text-green mb-4">Add Announcement</h2>
                    <div className="flex flex-col gap-3">
                        <input
                            className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea
                            className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none"
                            placeholder="Content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={4}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                            <button onClick={() => {
                                if (!title || !content) return;
                                const date = new Date().toISOString().slice(0, 10);
                                setAnnouncements(prev => [
                                    { id: Date.now(), title, content, date, status: 'Draft' },
                                    ...prev,
                                ]);
                                hideModal();
                                showToast('Announcement added!', 'success');
                            }} className="px-4 py-2 rounded bg-gold text-green font-semibold border border-gold/30 shadow hover:bg-goldLight transition">Add</button>
                        </div>
                    </div>
                </div>
            );
        }
        showModal(<AddAnnouncementModal />);
    }

    // Edit Announcement

    function handleEdit(id) {
        const a = announcements.find(x => x.id === id);
        if (!a) return;
        function EditAnnouncementModal() {
            const [title, setTitle] = useState(a.title);
            const [content, setContent] = useState(a.content);
            return (
                <div>
                    <h2 className="text-lg font-bold text-green mb-4">Edit Announcement</h2>
                    <div className="flex flex-col gap-3">
                        <input
                            className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea
                            className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none"
                            placeholder="Content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={4}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                            <button onClick={() => {
                                setAnnouncements(prev => prev.map(x => x.id === id ? { ...x, title, content } : x));
                                hideModal();
                                showToast('Announcement updated!', 'success');
                            }} className="px-4 py-2 rounded bg-gold text-green font-semibold border border-gold/30 shadow hover:bg-goldLight transition">Save</button>
                        </div>
                    </div>
                </div>
            );
        }
        showModal(<EditAnnouncementModal />);
    }

    // Delete Announcement
    function handleDelete(id) {
        setModal({ type: 'delete', id });
        showModal(
            <div>
                <h2 className="text-lg font-bold text-red-700 mb-4">Delete Announcement</h2>
                <div className="mb-4">Are you sure you want to delete this announcement?</div>
                <div className="flex gap-2 justify-end">
                    <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                    <button onClick={submitDelete} className="px-4 py-2 rounded bg-red-100 text-red-700 font-semibold border border-red-200 shadow hover:bg-red-200 transition">Delete</button>
                </div>
            </div>
        );
    }
    function submitDelete() {
        setAnnouncements(prev => prev.filter(x => x.id !== modal.id));
        setModal({ type: null, id: null });
        hideModal();
        showToast('Announcement deleted.', 'success');
    }

    // Toggle status
    function handleToggleStatus(id) {
        setAnnouncements(prev => prev.map(x => x.id === id ? { ...x, status: x.status === 'Published' ? 'Draft' : 'Published' } : x));
    }

    return (
        <div className="space-y-6 font-sans">
            {isAdmin && (
                <div className="mb-4 flex justify-end">
                    <button onClick={handleAdd} className="px-4 py-2 rounded bg-emerald text-white font-semibold border border-emerald shadow hover:bg-gold hover:text-emerald transition">+ Add Announcement</button>
                </div>
            )}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <span className="sr-only">Loading announcements...</span>
                    <span className="relative flex h-10 w-10 mb-3">
                        <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-gold via-emerald to-gold opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-10 w-10 border-4 border-gold border-t-transparent border-b-transparent"></span>
                    </span>
                    <div className="text-gold font-semibold text-base">Loading announcements...</div>
                </div>
            ) : (
                announcements.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-base-sand shadow-sm mb-3">
                        <button
                            className="w-full text-left flex justify-between items-center hover:bg-base-sand rounded-2xl transition px-6 py-4"
                            onClick={() => setOpen(open === a.id ? null : a.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-emerald text-lg">{a.title}</span>
                                {isAdmin && (
                                    <span className={`text-xs px-3 py-1 rounded font-bold border ${a.status === 'Published' ? 'bg-gold text-emerald border-gold' : 'bg-base-sand text-text-muted border-base-sand'}`}>{a.status}</span>
                                )}
                            </div>
                            <span className="text-xs text-gold font-medium">{a.date}</span>
                        </button>
                        {open === a.id && (
                            <div className="px-6 pb-4 text-emerald animate-fade-in flex flex-col gap-2 text-base">
                                {a.content}
                                {isAdmin && (
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => handleEdit(a.id)} className="px-3 py-1 rounded bg-gold/10 hover:bg-gold text-emerald border border-gold text-xs font-semibold" title="Edit">Edit</button>
                                        <button onClick={() => handleToggleStatus(a.id)} className={`px-3 py-1 rounded border text-xs font-semibold ${a.status === 'Published' ? 'bg-base-sand text-text-muted border-base-sand' : 'bg-emerald/10 text-emerald border-emerald'}`} title="Toggle Status">{a.status === 'Published' ? 'Unpublish' : 'Publish'}</button>
                                        <button onClick={() => handleDelete(a.id)} className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 text-xs font-semibold" title="Delete">Delete</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}


