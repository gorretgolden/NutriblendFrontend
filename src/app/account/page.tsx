// app/account/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MyAccount from "@/components/accounts/MyAccountManagement";
import { FiUser, FiBox, FiHeart, FiStar, FiMail, FiSettings, FiLogOut } from "react-icons/fi";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { fetchUserProfile } from "@/lib/features/auth/authSlice";
import { apiClient, getImageUrl, formatPrice } from "@/lib/api/client";
import { toast } from "sonner";
import Image from "next/image";

// ============================================================
// Sidebar items config
// ============================================================
const sidebarItems = [
  { key: "overview", label: "Account Overview", icon: FiUser },
  { key: "orders", label: "Orders", icon: FiBox },
  { key: "wishlist", label: "My Lists", icon: FiHeart },
  { key: "reviews", label: "Reviews", icon: FiStar },
  { key: "messages", label: "Messages", icon: FiMail },
  { key: "account", label: "Account Management", icon: FiSettings },
];

// ============================================================
// Account Overview (inline – dynamic)
// ============================================================
function AccountOverview() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Account Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <FiUser className="text-green-600 w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.first_name || user?.name?.split(' ')[0] || ''} {user?.last_name || (user?.name?.split(' ').slice(1).join(' ') || '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <FiMail className="text-green-600 w-5 h-5" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
              </div>
            </div>
            {(user?.phone || user?.contact) && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <svg className="text-green-600 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{user?.phone || user?.contact}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Book */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Default Shipping Address
          </h3>
          <div className="p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">
              {user?.address || "No default shipping address set."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Dynamic Orders
// ============================================================
function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.getOrders();
        if (response.status && response.data) {
          const data = response.data;
          setOrders(Array.isArray(data) ? data : (data as any).data || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <FiBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">You have no orders yet.</p>
        <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-gray-50 rounded-xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-bold text-gray-800">Order #{order.order_number}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            {order.items && order.items.length > 0 && (
              <div className="space-y-2 mb-3">
                {order.items.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">{item.quantity}x</span>
                    <span className="text-gray-800 font-medium truncate">
                      {item.product?.name || "Product"}
                    </span>
                    <span className="text-gray-500 ml-auto">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-gray-400">+{order.items.length - 3} more items</p>
                )}
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-800">
                Total: {formatPrice(order.total_amount)}
              </span>
              {(order.status === "pending" || order.status === "processing") && (
                <button
                  onClick={async () => {
                    try {
                      await apiClient.cancelOrder(order.order_number);
                      toast.success("Order cancelled successfully");
                      setOrders(prev => prev.map(o =>
                        o.id === order.id ? { ...o, status: "cancelled" } : o
                      ));
                    } catch {
                      toast.error("Failed to cancel order");
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Dynamic Wishlist
// ============================================================
function WishlistSection() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await apiClient.getWishlist();
      if (response.status && response.data) {
        setItems(Array.isArray(response.data) ? response.data : []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
        <p className="text-gray-400 text-sm mt-1">Browse products and add them to your wishlist.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => {
          const product = item.product || item;
          const imageUrl = getImageUrl(
            product.product_images?.[0]?.image_url ||
            product.product_images?.[0]?.image_path ||
            (Array.isArray(product.images) ? product.images[0] : null)
          );

          return (
            <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative w-full h-36 bg-white rounded-lg overflow-hidden mb-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiHeart className="w-12 h-12" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-green-600 mb-3">
                {formatPrice(product.price)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await apiClient.addToCart({ product_id: product.id, quantity: 1 });
                      toast.success("Added to cart!");
                    } catch {
                      toast.error("Failed to add to cart");
                    }
                  }}
                  className="flex-1 bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={async () => {
                    try {
                      await apiClient.removeFromWishlist(product.id);
                      setItems(prev => prev.filter(i => i.id !== item.id));
                      toast.success("Removed from wishlist");
                    } catch {
                      toast.error("Failed to remove");
                    }
                  }}
                  className="px-3 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Dynamic Reviews (user's own reviews)
// ============================================================
function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.getMyReviews();
        if (response.status && response.data) {
          setReviews(Array.isArray(response.data) ? response.data : []);
        }
      } catch {
        // silently fail — endpoint may not exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">You haven't written any reviews yet.</p>
        <p className="text-gray-400 text-sm mt-1">
          Purchase products and share your experience with others.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review: any) => (
          <div key={review.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">{review.product_name}</p>
            <p className="text-sm text-gray-600">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Dynamic Messages / Notifications
// ============================================================
function MessagesSection() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiClient.getNotifications();
        if (response.status && response.data) {
          const data = response.data;
          setMessages(Array.isArray(data) ? data : (data as any).data || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-16">
        <FiMail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No messages yet.</p>
        <p className="text-gray-400 text-sm mt-1">
          Notifications about your orders and account will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        {messages.some((m: any) => !m.read_at) && (
          <button
            onClick={async () => {
              try {
                await apiClient.markAllAsRead();
                setMessages(prev => prev.map(m => ({ ...m, read_at: new Date().toISOString() })));
                toast.success("All messages marked as read");
              } catch {
                toast.error("Failed to mark all as read");
              }
            }}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {messages.map((msg: any) => {
          const notifData = msg.data || {};
          const isRead = !!msg.read_at;

          return (
            <div
              key={msg.id}
              className={`rounded-xl p-4 border transition-shadow hover:shadow-md cursor-pointer ${isRead ? "bg-white border-gray-100" : "bg-green-50 border-green-200"
                }`}
              onClick={async () => {
                if (!isRead) {
                  try {
                    await apiClient.markAsRead(msg.id);
                    setMessages(prev =>
                      prev.map(m => m.id === msg.id ? { ...m, read_at: new Date().toISOString() } : m)
                    );
                  } catch {
                    // silently fail
                  }
                }
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!isRead && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {notifData.title || notifData.subject || msg.type?.split("\\").pop() || "Notification"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notifData.message || notifData.body || notifData.description || "You have a new notification."}
                  </p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Main Account Page
// ============================================================
const AccountPage = () => {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeSection, setActiveSection] = useState(initialTab);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Sync tab with URL when searchParams change
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveSection(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <MyAccount />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "reviews":
        return <ReviewsSection />;
      case "messages":
        return <MessagesSection />;
      case "overview":
      default:
        return <AccountOverview />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              {user && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {(user.first_name?.[0] || user.name?.[0] || "").toUpperCase()}
                    {(user.last_name?.[0] || user.name?.split(' ')[1]?.[0] || "").toUpperCase()}
                  </div>
                  <p className="text-center font-semibold text-gray-800">
                    {user.first_name || user.name?.split(' ')[0] || ''} {user.last_name || (user.name?.split(' ').slice(1).join(' ') || '')}
                  </p>
                  <p className="text-center text-sm text-gray-500">{user.email}</p>
                </div>
              )}
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${activeSection === item.key
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow p-4 md:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
