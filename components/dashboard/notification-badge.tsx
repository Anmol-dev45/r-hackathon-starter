"use client";

import { Bell, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    timestamp: string;
    read: boolean;
}

export function NotificationBadge() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Mock notifications - replace with real API call
        const mockNotifications: Notification[] = [
            {
                id: "1",
                title: "Complaint Forwarded",
                message: "Your complaint #TR-1234 has been forwarded to the relevant department",
                type: "info",
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                read: false,
            },
            {
                id: "2",
                title: "Status Updated",
                message: "Complaint #TR-5678 status changed to Under Review",
                type: "success",
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                read: false,
            },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const typeColors = {
        info: "border-l-blue-500 bg-blue-50",
        success: "border-l-green-500 bg-green-50",
        warning: "border-l-yellow-500 bg-yellow-50",
        error: "border-l-red-500 bg-red-50",
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${typeColors[notification.type]} ${!notification.read ? "bg-gray-50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        {formatTimeAgo(notification.timestamp)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
