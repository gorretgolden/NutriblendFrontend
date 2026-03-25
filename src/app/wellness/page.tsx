'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface WellnessAnswer {
    id: number;
    name: string;
    subject: string;
    question: string;
    answer: string;
    respondent?: { name: string };
    answered_at: string;
}

export default function WellnessPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', question: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState<WellnessAnswer[]>([]);

    useEffect(() => {
        apiClient.getWellnessAnswers().then((res) => {
            if (res.status && res.data?.data) {
                setAnswers(res.data.data);
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await apiClient.submitWellnessQuestion(form);
            if (res.status) {
                setSubmitted(true);
                setForm({ name: '', email: '', subject: '', question: '' });
            } else {
                setError(res.message || 'Failed to submit question. Please try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask Our Wellness Experts</h1>
                    <p className="text-gray-500">Have a health or nutrition question? Submit it below and our experts will answer you.</p>
                </div>

                {/* Submit Form */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">✅</div>
                            <h2 className="text-xl font-semibold text-green-600 mb-2">Question Submitted!</h2>
                            <p className="text-gray-500">Our wellness experts will review your question and respond soon.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Ask Another Question
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. Vitamin D dosage for adults"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Question *</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.question}
                                    onChange={e => setForm({ ...form, question: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Describe your health or nutrition question in detail..."
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                            >
                                {submitting ? 'Submitting...' : 'Submit Question'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Answered Questions */}
                {answers.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Expert Answers</h2>
                        <div className="space-y-4">
                            {answers.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-1">{item.subject}</h3>
                                    <p className="text-sm text-gray-500 mb-3">Asked by {item.name}</p>
                                    <p className="text-gray-600 italic mb-4">&ldquo;{item.question}&rdquo;</p>
                                    <div className="border-t pt-3">
                                        <p className="text-sm font-medium text-green-600 mb-1">
                                            Expert Answer {item.respondent ? `— ${item.respondent.name}` : ''}
                                        </p>
                                        <p className="text-gray-700 text-sm">{item.answer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
