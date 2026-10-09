import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, Check } from 'lucide-react';
import './Notifications.css';

export function Notifications() {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const users = useStore((state) => state.users);
    const notifications = useStore((state) => state.notifications);
    const markNotificationRead = useStore((state) => state.markNotificationRead);
    const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead);

    // Filter notifications for current user
    const myNotifications = notifications
        .filter(n => n.user_id === currentUser.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const handleNotificationClick = (notification: any) => {
        markNotificationRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Bell className="w-6 h-6" />
                    Notifications
                </h1>
                {myNotifications.some(n => !n.read) && (
                    <button onClick={markAllNotificationsRead} className="mark-all-btn flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-list">
                {myNotifications.length === 0 ? (
                    <div className="empty-notifications">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    myNotifications.map(notification => {
                        const relatedUser = notification.related_user_id
                            ? users.find(u => u.id === notification.related_user_id)
                            : null;

                        return (
                            <div
                                key={notification.id}
                                className={`notification-item glass-panel ${!notification.read ? 'unread' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                {relatedUser && (
                                    <img
                                        src={relatedUser.avatar}
                                        alt={relatedUser.name}
                                        className="notification-avatar hover:opacity-80 transition-opacity cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${relatedUser.id}`);
                                        }}
                                    />
                                )}
                                <div className="notification-content">
                                    <p className="notification-text">{notification.content}</p>
                                    <p className="notification-time">
                                        {new Date(notification.created_at).toLocaleDateString()} • {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {!notification.read && <div className="notification-dot" />}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
