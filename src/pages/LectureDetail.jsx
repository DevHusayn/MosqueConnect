import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function LectureDetail({ lectures }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const lecture = lectures.find(l => String(l.id) === id);
    if (!lecture) return <div className="max-w-2xl mx-auto py-10 px-4">Lecture not found.</div>;
    return (
        <div className="max-w-2xl mx-auto py-10 px-4 font-sans">
            <button onClick={() => navigate(-1)} className="mb-4 text-emerald hover:underline">&larr; Back to Lectures</button>
            <h1 className="text-2xl font-bold text-emerald mb-2">{lecture.title}</h1>
            <div className="text-xs text-grayWarm mb-4">Posted: {lecture.date}</div>
            <div className="bg-white rounded-xl shadow p-6 border border-base-sand text-gray-700 whitespace-pre-line">{lecture.content}</div>
        </div>
    );
}
