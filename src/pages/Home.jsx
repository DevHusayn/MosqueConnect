import React, { useContext, useState } from 'react';
import { AdminContext } from '../App';
import PrayerTimes from '../components/PrayerTimes';
import AnnouncementList from '../components/AnnouncementList';

export default function Home() {
    const { isAdmin } = useContext(AdminContext);
    const [nextPrayer, setNextPrayer] = useState({ name: '', time: '', countdown: '' });
    const [hijri, setHijri] = useState('');
    const [gregorian, setGregorian] = useState('');
    React.useEffect(() => {
        async function fetchDate() {
            try {
                const d = new Date();
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                const dateStr = `${day}-${month}-${year}`;
                const res = await fetch('https://api.aladhan.com/v1/gToH?date=' + dateStr);
                const data = await res.json();
                if (data.code === 200) {
                    const h = data.data.hijri;
                    setHijri(`${h.day} ${h.month.en} ${h.year} AH`);
                    const g = data.data.gregorian;
                    setGregorian(`${g.day} ${g.month.en} ${g.year}`);
                } else {
                    setGregorian(d.toLocaleDateString());
                }
            } catch {
                const d = new Date();
                setGregorian(d.toLocaleDateString());
            }
        }
        fetchDate();
    }, []);
    return (
        <main className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-16 font-sans bg-base min-h-screen">
            {/* Date Display */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-2">
                <div className="bg-white border border-base-sand rounded-2xl px-8 py-3 text-emerald font-bold text-lg flex items-center gap-2 shadow-sm">
                    <span className="text-gold font-extrabold">Hijri:</span> {hijri || '...'}
                </div>
                <div className="bg-white border border-base-sand rounded-2xl px-8 py-3 text-emerald font-bold text-lg flex items-center gap-2 shadow-sm">
                    <span className="text-gold font-extrabold">Gregorian:</span> {gregorian || '...'}
                </div>
            </div>
            {/* Hero Prayer Widget */}
            <section className="bg-white rounded-3xl p-10 mb-8 flex flex-col gap-6 border border-base-sand shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-extrabold text-emerald tracking-tight">Today's Prayer Times</h1>
                </div>
                <PrayerTimes setNextPrayer={setNextPrayer} />
                <div className="text-gold font-semibold text-center mt-2 text-lg">
                    {nextPrayer.name ? (
                        <>Next: <span className="text-emerald font-bold">{nextPrayer.name}</span> in {nextPrayer.countdown}</>
                    ) : (
                        <>All prayers for today are complete.</>
                    )}
                </div>
            </section>

            {/* Announcements Section */}
            <section className="bg-white border border-base-sand rounded-3xl p-10 shadow-md">
                <h2 className="text-2xl font-extrabold text-emerald mb-8 tracking-tight">Announcements</h2>
                <AnnouncementList />
            </section>

            {/* Community Banner */}
            <div className="mt-16 text-center italic text-base text-emerald font-medium">
                “And cooperate in righteousness and piety...” <span className="text-gold">(Qur’an 5:2)</span>
            </div>
        </main>
    );
}
