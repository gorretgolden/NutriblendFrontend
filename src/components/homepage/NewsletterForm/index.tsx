'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await apiClient.subscribeToNewsletter(email);
      if (res.status) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full md:w-[420px] text-center md:text-left">
        <p className="text-white font-bold text-base mb-1">🎉 You&apos;re subscribed!</p>
        <p className="text-green-200 text-sm">Thank you — watch your inbox for deals and tips.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-auto flex-shrink-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full md:w-[420px]"
      >
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-white text-[#009E3C] font-black text-sm rounded-xl hover:bg-gray-50 transition-all shadow-md flex-shrink-0 whitespace-nowrap disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-300 text-[11px] mt-1">Something went wrong. Please try again.</p>
      )}
      <p className="text-green-200/70 text-[11px] mt-2 text-center sm:text-left">
        No spam, ever. Unsubscribe at any time.
      </p>
    </div>
  );
}
