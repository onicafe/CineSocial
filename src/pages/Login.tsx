import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Users, ArrowRight } from 'lucide-react';
import './Login.css';

export function Login() {
    const navigate = useNavigate();
    const users = useStore((state) => state.users);
    const setCurrentUser = useStore((state) => state.setCurrentUser);

    const handleLogin = (userId: string) => {
        setCurrentUser(userId);
        navigate('/');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-wrapper">
                        <div className="logo-icon">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="app-title">CineSocial</h1>
                    <p className="app-subtitle">Select a profile to continue</p>
                </div>

                <div className="users-grid">
                    {users.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleLogin(user.id)}
                            className="user-btn"
                        >
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="user-avatar"
                            />
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">
                                    {user.badges.length} Badges • {user.rp_balance} RP
                                </span>
                            </div>
                            <ArrowRight className="arrow-icon" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
