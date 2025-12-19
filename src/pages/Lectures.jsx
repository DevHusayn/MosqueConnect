import React, { useContext } from 'react';
import { useToast } from '../components/ToastProvider';
import { AdminContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Lectures({ lectures, setLectures }) {
    const { isAdmin } = useContext(AdminContext);
    const [modal, setModal] = React.useState({ open: false, id: null });
    const [form, setForm] = React.useState({ title: '', content: '' });
    const { showToast } = useToast();
    const navigate = useNavigate();

    function openAddModal() {
        setForm({ title: '', content: '' });
        setModal({ open: true, id: null });
    }
    function openEditModal(id) {
        const lecture = lectures.find(l => l.id === id);
        setForm({ title: lecture.title, content: lecture.content });
        setModal({ open: true, id });
    }
    function closeModal() {
        setModal({ open: false, id: null });
    }
    function handleSave() {
        if (!form.title || !form.content) return;
        if (modal.id) {
            setLectures(lectures.map(l => l.id === modal.id ? { ...l, ...form } : l));
            showToast('Lecture updated!', 'success');
        } else {
            setLectures([{ id: Date.now(), ...form, date: new Date().toISOString().slice(0, 10) }, ...lectures]);
            showToast('Lecture added!', 'success');
        }
        closeModal();
    }
    function handleDelete(id) {
        setLectures(lectures.filter(l => l.id !== id));
        closeModal();
        showToast('Lecture deleted.', 'success');
    }

    return (
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-10 font-sans">
            <h1 className="text-2xl font-bold text-emerald mb-6">Lectures</h1>
            {isAdmin && (
                <button onClick={openAddModal} className="mb-6 px-4 py-2 rounded bg-gold text-emerald font-semibold border border-gold/30 shadow hover:bg-goldLight transition">+ Add Lecture</button>
            )}
            <div className="space-y-8">
                {lectures.length === 0 && <div className="text-grayWarm">No lectures posted yet.</div>}
                {lectures.map(lecture => {
                    const preview = lecture.content.length > 30 ? lecture.content.slice(0, 30) + '...' : lecture.content;
                    return (
                        <div key={lecture.id} className="bg-white rounded-xl shadow p-6 border border-base-sand">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-emerald">{lecture.title}</h2>
                                {isAdmin && (
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(lecture.id)} className="px-3 py-1 rounded bg-gold/10 hover:bg-gold text-emerald border border-gold text-xs font-semibold">Edit</button>
                                        <button onClick={() => handleDelete(lecture.id)} className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 text-xs font-semibold">Delete</button>
                                    </div>
                                )}
                            </div>
                            <button
                                className="text-gray-700 whitespace-pre-line mb-2 text-left w-full hover:bg-base-sand/40 rounded transition px-1 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                aria-label={`Read full lecture: ${lecture.title}`}
                                onClick={() => navigate(`/lectures/${lecture.id}`)}
                            >
                                {preview}
                                {lecture.content.length > 30 && (
                                    <span className="text-gold ml-2">...read more</span>
                                )}
                            </button>
                            <div className="text-xs text-grayWarm">Posted: {lecture.date}</div>
                        </div>
                    );
                })}
            </div>
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-xl shadow-card p-6 min-w-[320px] max-w-[90vw] relative">
                        <button
                            aria-label="Close modal"
                            className="absolute top-4 right-4 text-2xl text-gold hover:text-emerald focus:outline-none"
                            onClick={closeModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-bold text-emerald mb-4">{modal.id ? 'Edit Lecture' : 'Add Lecture'}</h2>
                        <input
                            className="border border-grayLight rounded p-2 text-emerald bg-base focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                            placeholder="Lecture Title"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        />
                        <textarea
                            className="border border-grayLight rounded p-2 text-emerald bg-base focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                            placeholder="Lecture Content"
                            value={form.content}
                            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                            rows={6}
                        />
                        <div className="flex gap-2 justify-end mt-2">
                            <button onClick={closeModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 rounded bg-gold text-emerald font-semibold border border-gold/30 shadow hover:bg-goldLight transition">{modal.id ? 'Save' : 'Add'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
