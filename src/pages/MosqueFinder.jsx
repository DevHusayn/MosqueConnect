import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';



function SetViewOnClick({ coords }) {
    const map = useMap();
    if (coords) map.setView(coords, 14);
    return null;
}

export default function MosqueFinder() {
    // ...existing code...
    const [editMode, setEditMode] = useState(false);
    const [editMosque, setEditMosque] = useState(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userCoords, setUserCoords] = useState(null);
    const [selectedMosque, setSelectedMosque] = useState(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualMosque, setManualMosque] = useState({ name: '', address: '', lat: '', lng: '' });
    const suggestionTimeout = useRef();

    // Autocomplete suggestions for location
    const handleQueryChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setShowSuggestions(!!value);
        setSuggestions([]);
        if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
        if (!value.trim()) return;
        suggestionTimeout.current = setTimeout(async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&addressdetails=1&limit=5`;
                const res = await fetch(url);
                const data = await res.json();
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            }
        }, 350);
    };

    // Real search handler using Nominatim and Overpass API
    const handleSearch = async (e, suggestion) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setMosques([]);
        setUserCoords(null);
        setShowSuggestions(false);
        let lat, lon;
        if (suggestion) {
            lat = suggestion.lat;
            lon = suggestion.lon;
            setQuery(suggestion.display_name);
        } else {
            if (!query.trim()) {
                setError('Please enter a location.');
                setLoading(false);
                return;
            }
            try {
                // 1. Geocode the location using Nominatim
                const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
                const geoRes = await fetch(nominatimUrl);
                const geoData = await geoRes.json();
                if (!geoData.length) {
                    setError('Location not found. Try a different search.');
                    setLoading(false);
                    return;
                }
                lat = geoData[0].lat;
                lon = geoData[0].lon;
            } catch {
                setError('Error searching for location.');
                setLoading(false);
                return;
            }
        }
        setUserCoords([parseFloat(lat), parseFloat(lon)]);
        try {
            // 2. Search for mosques nearby using Overpass API
            const overpassQuery = `
                                [out:json][timeout:25];
                                (
                                    node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                    way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                    relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                );
                                out center;
                        `;
            const overpassUrl = 'https://overpass-api.de/api/interpreter';
            const overpassRes = await fetch(overpassUrl, {
                method: 'POST',
                body: overpassQuery,
                headers: { 'Content-Type': 'text/plain' },
            });
            const overpassData = await overpassRes.json();
            const mosquesFound = (overpassData.elements || []).map((el) => ({
                name: el.tags.name || 'Unnamed Mosque',
                address: el.tags['addr:full'] || el.tags['addr:street'] || '',
                lat: el.lat || (el.center && el.center.lat),
                lng: el.lon || (el.center && el.center.lon),
                tags: el.tags,
            })).filter(m => m.lat && m.lng);
            setMosques(mosquesFound);
            setLoading(false);
        } catch (err) {
            setError('Error searching for mosques. Please try again.');
            setLoading(false);
        }
    };

    const handleUseLocation = () => {
        setLoading(true);
        setError(null);
        setMosques([]);
        // Do not reset userCoords until geolocation is retrieved
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setUserCoords([lat, lon]);
            try {
                // Overpass API search for mosques near user's location
                const overpassQuery = `
                                        [out:json][timeout:25];
                                        (
                                            node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                            way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                            relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lon});
                                        );
                                        out center;
                                `;
                const overpassUrl = 'https://overpass-api.de/api/interpreter';
                const overpassRes = await fetch(overpassUrl, {
                    method: 'POST',
                    body: overpassQuery,
                    headers: { 'Content-Type': 'text/plain' },
                });
                const overpassData = await overpassRes.json();
                const mosquesFound = (overpassData.elements || []).map((el) => ({
                    name: el.tags.name || 'Unnamed Mosque',
                    address: el.tags['addr:full'] || el.tags['addr:street'] || '',
                    lat: el.lat || (el.center && el.center.lat),
                    lng: el.lon || (el.center && el.center.lon),
                    tags: el.tags,
                })).filter(m => m.lat && m.lng);
                setMosques(mosquesFound);
                setLoading(false);
            } catch (err) {
                setError('Error searching for mosques. Please try again.');
                setLoading(false);
            }
        }, () => {
            setError('Unable to retrieve your location.');
            setLoading(false);
        });
    };

    return (
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 font-sans relative">
            <h1 className="text-2xl font-bold text-emerald mb-6">Find Mosques Near You</h1>
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 mb-4 relative bg-white rounded-xl shadow-card border border-grayLight p-4">
                <div className="flex-1 min-w-[200px] relative">
                    <input
                        type="text"
                        className="w-full border border-base-sand rounded-lg px-4 py-2 text-emerald bg-base focus:ring-2 focus:ring-gold outline-none transition-all duration-300 text-base shadow-sm"
                        style={{ maxWidth: '100%', width: '100%', minWidth: '200px' }}
                        placeholder="Enter your city or area..."
                        value={query}
                        onChange={handleQueryChange}
                        onFocus={e => {
                            setShowSuggestions(!!query);
                            e.target.style.width = '100%';
                            e.target.style.maxWidth = '600px';
                        }}
                        onBlur={e => {
                            e.target.style.maxWidth = '100%';
                        }}
                        autoComplete="off"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-30 left-0 right-0 bg-white border border-base-sand rounded shadow-lg mt-1 max-h-56 overflow-y-auto">
                            {suggestions.map((s, i) => (
                                <li
                                    key={s.place_id}
                                    className="px-4 py-2 hover:bg-gold hover:text-emerald cursor-pointer text-sm"
                                    onMouseDown={() => handleSearch(null, s)}
                                >
                                    {s.display_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button type="submit" className="bg-emerald text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gold hover:text-emerald transition">
                        Search
                    </button>
                    <button type="button" onClick={handleUseLocation} className="bg-gold text-emerald px-4 py-2 rounded-lg font-semibold shadow hover:bg-emerald hover:text-white transition">
                        Use My Location
                    </button>
                    <button type="button" onClick={() => setShowManualModal(true)} className="bg-base-sand text-emerald px-4 py-2 rounded-lg font-semibold shadow hover:bg-gold hover:text-emerald transition">
                        Add Mosque
                    </button>
                </div>
            </form>
            {loading && <div className="text-gold font-semibold mb-4">Searching for mosques...</div>}
            {/* Only show error outside modal if not in manual modal */}
            {error && !showManualModal && <div className="text-red-600 mb-4">{error}</div>}
            {/* Map removed as requested */}
            {mosques.length > 0 && (
                <div className="bg-white rounded-xl shadow-card border border-grayLight p-6">
                    <h2 className="text-lg font-bold text-emerald mb-4">Nearby Mosques</h2>
                    <ul className="space-y-3">
                        {mosques.map((m, i) => (
                            <li key={i} className="border-b border-base-sand pb-2 last:border-b-0 cursor-pointer hover:bg-base-sand/30 rounded px-2" onClick={() => setSelectedMosque(m)}>
                                <div className="font-semibold text-emerald">{m.name}</div>
                                <div className="text-sm text-grayWarm">{m.address}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Manual Mosque Entry Modal */}
            {showManualModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative z-50">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-emerald text-xl" onClick={() => { setShowManualModal(false); setError(null); }}>&times;</button>
                        <h3 className="text-xl font-bold text-emerald mb-4">Add Mosque</h3>
                        <form onSubmit={async e => {
                            e.preventDefault();
                            if (!manualMosque.name) return;
                            let lat = manualMosque.lat;
                            let lng = manualMosque.lng;
                            let geocodeError = null;
                            // If lat/lng not provided, try to geocode address
                            if ((!lat || !lng) && manualMosque.address) {
                                try {
                                    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualMosque.address)}&limit=1`;
                                    const res = await fetch(url);
                                    const data = await res.json();
                                    if (data.length) {
                                        lat = data[0].lat;
                                        lng = data[0].lon;
                                    } else {
                                        geocodeError = 'Address not found. Please enter a more specific address or provide coordinates.';
                                    }
                                } catch {
                                    geocodeError = 'Error looking up address.';
                                }
                            }
                            if (!lat || !lng) {
                                setError(geocodeError || 'Please provide a valid address or coordinates.');
                                return;
                            }
                            setMosques(prev => [
                                ...prev,
                                {
                                    name: manualMosque.name,
                                    address: manualMosque.address,
                                    lat: parseFloat(lat),
                                    lng: parseFloat(lng),
                                    tags: { manual: true },
                                },
                            ]);
                            setShowManualModal(false);
                            setManualMosque({ name: '', address: '', lat: '', lng: '' });
                            setError(null);
                        }}>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold mb-1">Mosque Name*</label>
                                <input type="text" className="w-full border rounded px-3 py-2" value={manualMosque.name} onChange={e => setManualMosque(m => ({ ...m, name: e.target.value }))} required />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold mb-1">Address*</label>
                                <input type="text" className="w-full border rounded px-3 py-2" value={manualMosque.address} onChange={e => setManualMosque(m => ({ ...m, address: e.target.value }))} required />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold mb-1">Latitude (optional)</label>
                                <input type="number" step="any" className="w-full border rounded px-3 py-2" value={manualMosque.lat} onChange={e => setManualMosque(m => ({ ...m, lat: e.target.value }))} />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-semibold mb-1">Longitude (optional)</label>
                                <input type="number" step="any" className="w-full border rounded px-3 py-2" value={manualMosque.lng} onChange={e => setManualMosque(m => ({ ...m, lng: e.target.value }))} />
                            </div>
                            <div className="text-xs text-gray-500 mb-2">If latitude/longitude are not provided, they will be auto-filled from the address.</div>
                            {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="bg-emerald text-white px-4 py-2 rounded font-semibold hover:bg-gold hover:text-emerald transition">Add</button>
                                <button type="button" className="bg-gold text-emerald px-4 py-2 rounded font-semibold hover:bg-emerald hover:text-white transition" onClick={() => { setShowManualModal(false); setError(null); }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Mosque Info Modal */}
            {selectedMosque && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative z-50">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-emerald text-xl" onClick={() => { setSelectedMosque(null); setEditMode(false); setEditMosque(null); }}>&times;</button>
                        {!editMode ? (
                            <>
                                <h3 className="text-xl font-bold text-emerald mb-2">{selectedMosque.name}</h3>
                                <div className="mb-2 text-grayWarm">{selectedMosque.address}</div>
                                {selectedMosque.tags && (
                                    <div className="mb-2 text-sm">
                                        {selectedMosque.tags['contact:phone'] && <div><span className="font-semibold">Phone:</span> {selectedMosque.tags['contact:phone']}</div>}
                                        {selectedMosque.tags['website'] && <div><span className="font-semibold">Website:</span> <a href={selectedMosque.tags['website']} className="text-gold underline" target="_blank" rel="noopener noreferrer">{selectedMosque.tags['website']}</a></div>}
                                        {selectedMosque.tags['operator'] && <div><span className="font-semibold">Operator:</span> {selectedMosque.tags['operator']}</div>}
                                        {selectedMosque.tags['denomination'] && <div><span className="font-semibold">Denomination:</span> {selectedMosque.tags['denomination']}</div>}
                                    </div>
                                )}
                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${selectedMosque.lat},${selectedMosque.lng}`} target="_blank" rel="noopener noreferrer" className="bg-emerald text-white px-4 py-2 rounded font-semibold hover:bg-gold hover:text-emerald transition">Open in Maps</a>
                                    <button className="bg-gold text-emerald px-4 py-2 rounded font-semibold hover:bg-emerald hover:text-white transition" onClick={() => { setSelectedMosque(null); setEditMode(false); setEditMosque(null); }}>Close</button>
                                    {selectedMosque.tags && selectedMosque.tags.manual && (
                                        <>
                                            <button className="bg-base-sand text-emerald px-4 py-2 rounded font-semibold hover:bg-gold hover:text-emerald transition" onClick={() => { setEditMode(true); setEditMosque({ ...selectedMosque }); }}>Edit</button>
                                            <button className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-800 transition" onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this mosque?')) {
                                                    setMosques(mosques.filter(m => m !== selectedMosque));
                                                    setSelectedMosque(null);
                                                    setEditMode(false);
                                                    setEditMosque(null);
                                                }
                                            }}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <form onSubmit={e => {
                                e.preventDefault();
                                if (!editMosque.name || !editMosque.lat || !editMosque.lng) return;
                                setMosques(mosques.map(m => m === selectedMosque ? { ...editMosque, tags: { manual: true } } : m));
                                setSelectedMosque({ ...editMosque, tags: { manual: true } });
                                setEditMode(false);
                                setEditMosque(null);
                            }}>
                                <h3 className="text-xl font-bold text-emerald mb-4">Edit Mosque</h3>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Mosque Name*</label>
                                    <input type="text" className="w-full border rounded px-3 py-2" value={editMosque.name} onChange={e => setEditMosque(m => ({ ...m, name: e.target.value }))} required />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Address</label>
                                    <input type="text" className="w-full border rounded px-3 py-2" value={editMosque.address} onChange={e => setEditMosque(m => ({ ...m, address: e.target.value }))} />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Latitude*</label>
                                    <input type="number" step="any" className="w-full border rounded px-3 py-2" value={editMosque.lat} onChange={e => setEditMosque(m => ({ ...m, lat: e.target.value }))} required />
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Longitude*</label>
                                    <input type="number" step="any" className="w-full border rounded px-3 py-2" value={editMosque.lng} onChange={e => setEditMosque(m => ({ ...m, lng: e.target.value }))} required />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button type="submit" className="bg-emerald text-white px-4 py-2 rounded font-semibold hover:bg-gold hover:text-emerald transition">Save</button>
                                    <button type="button" className="bg-gold text-emerald px-4 py-2 rounded font-semibold hover:bg-emerald hover:text-white transition" onClick={() => { setEditMode(false); setEditMosque(null); }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
