import React, { useContext } from 'react';
import { ModalContext } from './ModalProvider';

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}


export default function Calendar({ isAdmin, events = [], onAddEvent, onEditEvent, onDeleteEvent }) {
    const today = new Date();
    const [selected, setSelected] = React.useState(null);
    const { showModal, hideModal } = useContext(ModalContext);

    const days = getDaysInMonth(today.getFullYear(), today.getMonth());
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    // Filter events for current month
    const monthStr = today.toISOString().slice(0, 7);
    const monthEvents = events.filter(e => e.date.startsWith(monthStr));

    function handleAddEvent(day) {
        if (!isAdmin || !onAddEvent) return;
        const date = new Date(today.getFullYear(), today.getMonth(), day).toISOString().slice(0, 10);
        onAddEvent(date);
    }

    function handleEditEvent(idx) {
        if (!isAdmin || !onEditEvent) return;
        onEditEvent(events.findIndex(e => e === monthEvents[idx]));
    }

    function handleDeleteEvent(idx) {
        if (!isAdmin || !onDeleteEvent) return;
        onDeleteEvent(events.findIndex(e => e === monthEvents[idx]));
    }

    return (
        <div className="font-sans">
            <div className="grid grid-cols-7 gap-3 mb-6 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="font-bold text-lg text-emerald tracking-tight" style={{ color: '#0F3D2E' }}>{d}</div>
                ))}
                {Array(firstDay).fill(null).map((_, i) => <div key={i}></div>)}
                {Array(days).fill(null).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(today.getFullYear(), today.getMonth(), day).toISOString().slice(0, 10);
                    const event = events.find(e => e.date === date);
                    const isToday = date === today.toISOString().slice(0, 10);
                    return (
                        <button
                            aria-label={event ? `View event: ${event.title}` : isAdmin ? 'Add event' : `Day ${day}`}
                            key={day}
                            className={`relative rounded-xl w-full h-16 flex flex-col items-center justify-center font-semibold text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                                ${isToday ? 'bg-gold/20 border-2 border-gold text-gold shadow-md' : 'bg-base-offwhite border border-base-sand text-emerald'}
                                ${event ? (event.type === 'special' ? 'bg-goldLight/80 text-gold' : event.type === 'other' ? 'bg-grayLight/80 text-grayWarm' : 'bg-greenLight/80 text-emerald') : ''}
                                ${selected === day ? 'ring-2 ring-gold scale-105 z-10' : ''}
                                hover:bg-gold/10 transition-all duration-150`}
                            onClick={() => {
                                setSelected(day);
                                if (event) {
                                    showModal(
                                        <div>
                                            <h2 className="text-lg font-bold text-emerald mb-2">{event.title}</h2>
                                            <div className="mb-2"><span className="font-semibold">Type:</span> <span className={event.type === 'special' ? 'text-gold' : event.type === 'other' ? 'text-grayWarm' : 'text-emerald'}>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span></div>
                                            <div className="mb-2"><span className="font-semibold">Date:</span> {event.date}</div>
                                            <div className="mb-2"><span className="font-semibold">Status:</span> {event.state}</div>
                                            {isAdmin && <button onClick={() => { hideModal(); onEditEvent && onEditEvent(events.findIndex(e => e === event)); }} className="mt-2 px-4 py-2 rounded bg-gold text-emerald font-semibold border border-gold/30 shadow hover:bg-goldLight transition">Edit</button>}
                                        </div>
                                    );
                                } else if (isAdmin) {
                                    handleAddEvent(day);
                                }
                            }}
                            title={event ? event.title : (isAdmin ? 'Add event' : '')}
                        >
                            <span className="z-10 font-bold text-lg text-emerald drop-shadow-sm" style={{ color: '#0F3D2E' }}>{day}</span>
                            {/* Event dots */}
                            {event && (
                                <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full
                                    ${event.type === 'special' ? 'bg-gold' : event.type === 'other' ? 'bg-grayWarm' : 'bg-emerald'}`}></span>
                            )}
                            {/* Admin event state badge */}
                            {isAdmin && event && (
                                <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded font-bold border border-base-sand bg-white text-emerald shadow-sm
                                    ${event.state === 'Published' ? 'bg-gold text-emerald' : 'bg-base-sand text-grayWarm'}`}>{event.state}</span>
                            )}
                        </button>
                    );
                })}
            </div>
            {/* Event List for current month */}
            <div className="mt-10">
                <h2 className="text-lg font-bold text-emerald mb-4">This Month's Events</h2>
                <div className="bg-white rounded-xl shadow-card border border-grayLight p-4">
                    {monthEvents.length === 0 ? (
                        <div className="text-grayWarm text-sm">No events scheduled for this month.</div>
                    ) : (
                        <ul className="divide-y divide-base-sand">
                            {monthEvents.sort((a, b) => a.date.localeCompare(b.date)).map((event, idx) => (
                                <li key={idx} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-emerald">{event.title}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold
                                            ${event.type === 'special' ? 'bg-goldLight text-gold border-gold/30' : 'bg-greenLight text-emerald border-emerald/30'}`}>{event.type === 'special' ? 'Special' : 'Regular'}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded border font-semibold
                                            ${event.state === 'Published' ? 'bg-gold text-emerald border-gold/30' : 'bg-base-sand text-grayWarm border-base-sand'}`}>{event.state}</span>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleEditEvent(idx)} className="ml-2 px-2 py-1 rounded bg-goldLight text-emerald text-xs font-semibold border border-gold/30 hover:bg-gold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" title="Edit event" aria-label="Edit event">Edit</button>
                                                <button onClick={() => handleDeleteEvent(idx)} className="ml-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold border border-red-200 hover:bg-red-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2" title="Delete event" aria-label="Delete event">Delete</button>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-sm text-grayWarm">{event.date}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div >
    );
}
