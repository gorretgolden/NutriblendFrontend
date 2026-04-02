'use client';

import React, { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { FaEnvelope, FaPaperPlane, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

interface MessageThread {
  id: number;
  subject: string;
  body: string;
  sender_type: 'customer' | 'admin';
  is_read: boolean;
  created_at: string;
  replies_count: number;
  unread_replies_count: number;
  replies?: MessageReply[];
  admin?: { id: number; name: string } | null;
}

interface MessageReply {
  id: number;
  body: string;
  sender_type: 'customer' | 'admin';
  is_read: boolean;
  created_at: string;
  admin?: { id: number; name: string } | null;
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [replyBody, setReplyBody] = useState('');

  const fetchThreads = useCallback(async () => {
    try {
      const response = await apiClient.getMessages();
      if (response.status && response.data) {
        const raw = (response.data as any).data || response.data;
        setThreads(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const openThread = async (thread: MessageThread) => {
    try {
      const response = await apiClient.getMessage(thread.id);
      if (response.status && response.data) {
        setSelectedThread(response.data as MessageThread);
      }
    } catch {
      setSelectedThread(thread);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newBody.trim()) return;
    setSending(true);
    try {
      await apiClient.sendMessage({ subject: newSubject, body: newBody });
      setNewSubject('');
      setNewBody('');
      setShowCompose(false);
      await fetchThreads();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim() || !selectedThread) return;
    setSending(true);
    try {
      await apiClient.replyToMessage(selectedThread.id, replyBody);
      setReplyBody('');
      await openThread(selectedThread);
      await fetchThreads();
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    try {
      await apiClient.deleteMessage(id);
      setSelectedThread(null);
      await fetchThreads();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  // Thread detail view
  if (selectedThread) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedThread(null)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Messages</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">{selectedThread.subject}</h2>
            <p className="text-sm text-gray-500 mt-1">{formatDate(selectedThread.created_at)}</p>
          </div>

          {/* Original message */}
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-blue-600">Y</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800">You</span>
                  <span className="text-xs text-gray-400">{formatDate(selectedThread.created_at)}</span>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed">
                  {selectedThread.body}
                </div>
              </div>
            </div>

            {/* Replies */}
            {selectedThread.replies?.map((reply) => (
              <div key={reply.id} className={`flex gap-3 ${reply.sender_type === 'customer' ? '' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  reply.sender_type === 'admin' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <span className={`text-sm font-medium ${
                    reply.sender_type === 'admin' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {reply.sender_type === 'admin' ? 'A' : 'Y'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800">
                      {reply.sender_type === 'admin' ? (reply.admin?.name || 'NutriBlend Support') : 'You'}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(reply.created_at)}</span>
                  </div>
                  <div className={`rounded-xl p-4 text-gray-700 text-sm leading-relaxed ${
                    reply.sender_type === 'admin' ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    {reply.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply form */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleReply} className="flex gap-3">
              <input
                type="text"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={sending || !replyBody.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <FaPaperPlane className="w-4 h-4" />
                {sending ? 'Sending...' : 'Reply'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Compose view
  if (showCompose) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setShowCompose(false)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Messages</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">New Message</h2>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="What is your message about?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
              >
                <FaPaperPlane className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Thread list view
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-green-100 rounded-xl">
            <FaEnvelope className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Messages</h1>
            <p className="text-sm text-gray-500">Chat with our support team</p>
          </div>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <FaPaperPlane className="w-3.5 h-3.5" />
          New Message
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <FiLoader className="w-6 h-6 animate-spin mr-2" />
          <span>Loading messages...</span>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h3>
          <p className="text-sm text-gray-400 mb-6">Start a conversation with our support team</p>
          <button
            onClick={() => setShowCompose(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Send Your First Message
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => openThread(thread)}
              className={`w-full text-left p-5 rounded-2xl border transition-all hover:shadow-md ${
                !thread.is_read || (thread.unread_replies_count > 0)
                  ? 'bg-green-50 border-green-200 hover:border-green-300'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {(!thread.is_read || thread.unread_replies_count > 0) && (
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                    <h3 className="font-semibold text-gray-800 truncate">{thread.subject}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{thread.body}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-gray-400">{formatDate(thread.created_at)}</p>
                  {thread.replies_count > 0 && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {thread.replies_count} {thread.replies_count === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
