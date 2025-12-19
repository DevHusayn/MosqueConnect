

import React, { useContext, useState } from 'react';
import { useToast } from '../components/ToastProvider';
import { AdminContext } from '../App';
import Calendar from '../components/Calendar';
import { ModalContext } from '../components/ModalProvider';

export default function Events() {
    const { isAdmin } = useContext(AdminContext);
    const { showModal, hideModal } = useContext(ModalContext);
    const { showToast } = useToast();
    // Demo event states
    const [events, setEvents] = useState([
        { date: new Date().toISOString().slice(0, 10), title: 'Friday Prayer', type: 'special', state: 'Published' },
        { date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10), title: 'Youth Halaqa', type: 'regular', state: 'Draft' },
    ]);

    // Modal-based CRUD handlers
    const handleAddEvent = (date) => {
        function AddEventModal() {
            const [title, setTitle] = useState('');
            const [type, setType] = useState('regular');
            return (
                <div>
                    <h2 className="text-lg font-bold text-green mb-4">Add Event</h2>
                    <input
                        className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                        placeholder="Event Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="special">Special</option>
                        <option value="regular">Regular</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="flex gap-2 justify-end mt-2">
                        <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                        <button onClick={() => {
                            if (title) {
                                setEvents([...events, { date, title, type, state: 'Draft' }]);
                                hideModal();
                            }
                            showToast('Event added!', 'success');
                        }} className="px-4 py-2 rounded bg-gold text-green font-semibold border border-gold/30 shadow hover:bg-goldLight transition">Add</button>
                    </div>
                </div>
            );
        }
        showModal(<AddEventModal />);
    };

    const handleEditEvent = (idx) => {
        function EditEventModal() {
            const [title, setTitle] = useState(events[idx].title);
            const [type, setType] = useState(events[idx].type || 'regular');
            return (
                <div>
                    <h2 className="text-lg font-bold text-green mb-4">Edit Event</h2>
                    <input
                        className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                        placeholder="Event Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="border border-grayLight rounded p-2 text-green bg-greenLight focus:ring-2 focus:ring-gold outline-none mb-3 w-full"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="special">Special</option>
                        <option value="regular">Regular</option>
                        <option value="other">Other</option>
                    </select>
                    <div className="flex gap-2 justify-end mt-2">
                        <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                        <button onClick={() => {
                            if (title) {
                                setEvents(events.map((e, i) => i === idx ? { ...e, title, type } : e));
                                hideModal();
                            }
                            showToast('Event updated!', 'success');
                        }} className="px-4 py-2 rounded bg-gold text-green font-semibold border border-gold/30 shadow hover:bg-goldLight transition">Save</button>
                    </div>
                </div>
            );
        }
        showModal(<EditEventModal />);
    };

    const handleDeleteEvent = (idx) => {
        showModal(
            <div>
                <h2 className="text-lg font-bold text-red-700 mb-4">Delete Event</h2>
                <div className="mb-4">Are you sure you want to delete this event?</div>
                <div className="flex gap-2 justify-end">
                    <button onClick={hideModal} className="px-4 py-2 rounded bg-grayLight text-grayWarm font-semibold">Cancel</button>
                    <button onClick={() => {
                        setEvents(events.filter((_, i) => i !== idx));
                        hideModal();
                        showToast('Event deleted.', 'success');
                    }} className="px-4 py-2 rounded bg-red-100 text-red-700 font-semibold border border-red-200 shadow hover:bg-red-200 transition">Delete</button>
                </div>
            </div>
        );
    };

    // Get all future events (today or later)
    const todayStr = new Date().toISOString().slice(0, 10);
    const futureEvents = events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date));

    return (
        <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 font-sans">
            <section className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-green tracking-tight mb-2">Events Calendar</h1>
                        <p className="text-emerald text-base max-w-xl">Browse upcoming mosque events and activities. Select a date to add new events. Special occasions are highlighted in the calendar.</p>
                    </div>
                </div>
                <div className="mt-6">
                    <Calendar
                        isAdmin={isAdmin}
                        events={events}
                        onAddEvent={handleAddEvent}
                        onEditEvent={handleEditEvent}
                        onDeleteEvent={handleDeleteEvent}
                    />
                </div>
            </section>
            <section className="mb-12">
                <h2 className="text-xl md:text-2xl font-bold text-emerald mb-6">Upcoming Events</h2>
                {futureEvents.length === 0 ? (
                    <div className="bg-greenLight text-green rounded p-6 text-center text-base font-medium shadow-card border border-grayLight">No upcoming events scheduled.</div>
                ) : (
                    <ul className="divide-y divide-grayLight bg-white rounded-xl shadow-card border border-grayLight">
                        {futureEvents.map((event, idx) => (
                            <li key={idx} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-emerald text-sm md:text-base">{event.title}</span>
                                    <span className={`text-xs md:text-xs px-2 py-0.5 rounded border font-semibold
                                        ${event.type === 'special' ? 'bg-goldLight text-gold border-gold/30' : event.type === 'other' ? 'bg-grayLight text-grayWarm border-grayLight' : 'bg-greenLight text-green border-green/30'}`}>{event.type === 'special' ? 'Special' : event.type === 'other' ? 'Other' : 'Regular'}</span>
                                    <span className={`text-xs md:text-xs px-2 py-0.5 rounded border font-semibold
                                        ${event.state === 'Published' ? 'bg-gold text-green border-gold/30' : 'bg-grayLight text-grayWarm border-grayLight'}`}>{event.state}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs md:text-sm text-grayWarm">{event.date}</span>
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => handleEditEvent(events.findIndex(e => e === event))} className="px-2 py-1 rounded bg-goldLight text-green text-xs font-semibold border border-gold/30 hover:bg-gold transition" title="Edit event">Edit</button>
                                            <button onClick={() => handleDeleteEvent(events.findIndex(e => e === event))} className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold border border-red-200 hover:bg-red-200 transition" title="Delete event">Delete</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
