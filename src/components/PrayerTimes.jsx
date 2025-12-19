import React, { useEffect, useState } from 'react';

function getCurrentPrayer(times) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let current = null;
    for (let i = 0; i < times.length; i++) {
        const [h, m] = times[i].time.split(/:| /);
        const period = times[i].time.split(' ')[1];
        let hour = parseInt(h, 10);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        const minutes = hour * 60 + parseInt(m, 10);
        if (nowMinutes < minutes) return current || times[0].name;
        current = times[i].name;
    }
    return current || times[times.length - 1].name;
}

export default function PrayerTimes({ setNextPrayer }) {
    const [times, setTimes] = useState([
        { name: 'Fajr', time: '--:--' },
        { name: 'Dhuhr', time: '--:--' },
        { name: 'Asr', time: '--:--' },
        { name: 'Maghrib', time: '--:--' },
        { name: 'Isha', time: '--:--' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTimes() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Lagos&country=Nigeria&method=2');
                const data = await res.json();
                if (data.code === 200) {
                    const t = data.data.timings;
                    setTimes([
                        { name: 'Fajr', time: t.Fajr },
                        { name: 'Dhuhr', time: t.Dhuhr },
                        { name: 'Asr', time: t.Asr },
                        { name: 'Maghrib', time: t.Maghrib },
                        { name: 'Isha', time: t.Isha },
                    ]);
                } else {
                    setError('Could not fetch prayer times.');
                }
            } catch (e) {
                setError('Could not fetch prayer times.');
            }
            setLoading(false);
        }
        fetchTimes();
    }, []);


    // Calculate next prayer and countdown

    useEffect(() => {
        if (!setNextPrayer) return;
        if (loading || error) {
            setNextPrayer({ name: '', time: '', countdown: '' });
            return;
        }
        const now = new Date();
        let found = false;
        let nextName = '', nextTime = '', countdown = '';
        for (let i = 0; i < times.length; i++) {
            const [h, m] = times[i].time.split(/:| /);
            const period = times[i].time.split(' ')[1];
            let hour = parseInt(h, 10);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            const minutes = hour * 60 + parseInt(m, 10);
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            if (nowMinutes < minutes) {
                // Next prayer found
                const diff = minutes - nowMinutes;
                const hDiff = Math.floor(diff / 60);
                const mDiff = diff % 60;
                nextName = times[i].name;
                nextTime = times[i].time;
                countdown = `${hDiff > 0 ? hDiff + 'h ' : ''}${mDiff}m`;
                found = true;
                break;
            }
        }
        if (!found) {
            // After Isha, next is Fajr of next day
            // Calculate Fajr time for next day
            const fajr = times[0];
            const [h, m] = fajr.time.split(/:| /);
            const period = fajr.time.split(' ')[1];
            let hour = parseInt(h, 10);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            // Fajr tomorrow in minutes since midnight
            const fajrMinutes = hour * 60 + parseInt(m, 10) + 24 * 60;
            const nowMinutes = now.getHours() * 60 + now.getMinutes();
            const diff = fajrMinutes - nowMinutes;
            const hDiff = Math.floor(diff / 60);
            const mDiff = diff % 60;
            nextName = fajr.name;
            nextTime = fajr.time;
            countdown = `${hDiff > 0 ? hDiff + 'h ' : ''}${mDiff}m`;
        }
        setNextPrayer({ name: nextName, time: nextTime, countdown });
    }, [times, loading, error, setNextPrayer]);

    const currentPrayer = getCurrentPrayer(times);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-8">
            <span className="sr-only">Loading prayer times...</span>
            <span className="relative flex h-10 w-10 mb-3">
                <span className="animate-spin absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-gold via-emerald to-gold opacity-20"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 border-4 border-gold border-t-transparent border-b-transparent"></span>
            </span>
            <div className="text-gold font-semibold text-base">Loading prayer times...</div>
        </div>
    );
    if (error) return <div className="text-red-600 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {times.map(t => (
                <div
                    key={t.name}
                    className={`flex flex-col items-center p-5 rounded-2xl shadow-sm border border-base-sand bg-white transition-all duration-200
                        ${t.name === currentPrayer ? 'ring-2 ring-gold scale-105' : ''}
                    `}
                >
                    <span className={`font-bold text-lg ${t.name === currentPrayer ? 'text-gold' : 'text-emerald'}`}>{t.name}</span>
                    <span className={`text-2xl font-mono ${t.name === currentPrayer ? 'text-gold' : 'text-emerald'}`}>{t.time}</span>
                    {t.name === currentPrayer && <span className="text-xs text-gold font-bold mt-2">Current</span>}
                </div>
            ))}
        </div>
    );
}
