import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Film, User, ShoppingBag, LogOut, Wallet, Star, MessageSquare, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';
import './Sidebar.css';

export function Sidebar() {
    const currentUser = useStore((state) => state.currentUser);
    const notifications = useStore((state) => state.notifications);
    const navigate = useNavigate();

    const unreadCount = notifications.filter(n => n.user_id === currentUser.id && !n.read).length;

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <aside className="sidebar glass-panel">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon-wrapper">
                    <Film className="logo-icon" />
                </div>
                <h1 className="logo-text">CineSocial</h1>
            </div>

            {/* Wallet Card */}
            <div className="wallet-card">
                <div className="wallet-glow" />

                <div className="wallet-header">
                    <span className="wallet-label">Your Balance</span>
                    <Wallet className="wallet-icon" />
                </div>

                <div className="space-y-2 relative z-10">
                    <div className="wallet-balance-row">
                        <div className="currency-indicator">
                            <div className="dot cp" />
                            <span className="currency-name">CP</span>
                        </div>
                        <span className="currency-value cp">{currentUser.cp_balance}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="nav-menu">
                <NavLink to="/" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <Home className="nav-icon" />
                    <span className="font-medium">Feed</span>
                </NavLink>
                <NavLink to="/movies" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <Film className="nav-icon" />
                    <span className="font-medium">Discover</span>
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <MessageSquare className="nav-icon" />
                    <span className="font-medium">Social</span>
                </NavLink>
                <NavLink to="/notifications" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <div className="relative">
                        <Bell className="nav-icon" />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
                    </div>
                    <span className="font-medium">Notifications</span>
                </NavLink>
                <NavLink to="/store" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <ShoppingBag className="nav-icon" />
                    <span className="font-medium">Store</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => clsx('nav-item', isActive && 'active')}>
                    <User className="nav-icon" />
                    <span className="font-medium">Profile</span>
                </NavLink>
            </nav>

            {/* User Mini Profile */}
            <div className="user-mini-profile">
                <div
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/profile')}
                >
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="mini-avatar"
                    />
                    <div className="mini-info">
                        <p className="mini-name">{currentUser.name}</p>
                        <div className="mini-badges">
                            <Star className="mini-star" />
                            <span>{currentUser.badges.length} Badges</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
