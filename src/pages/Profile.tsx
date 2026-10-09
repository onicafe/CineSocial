import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BadgeDisplay } from '../components/Gamification/BadgeDisplay';
import { Settings, X, Save } from 'lucide-react';
import { PostCard } from '../components/Feed/PostCard';
import clsx from 'clsx';
import './Profile.css';

export function Profile() {
    const { id } = useParams(); // Get user ID from URL
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const users = useStore((state) => state.users);
    const posts = useStore((state) => state.posts);
    const updateUser = useStore((state) => state.updateUser);

    // Determine which user to show
    const profileUser = id ? users.find(u => u.id === id) : currentUser;
    const isOwnProfile = !id || id === currentUser.id;

    // Redirect if user not found (invalid ID)
    useEffect(() => {
        if (id && !profileUser) {
            navigate('/');
        }
    }, [id, profileUser, navigate]);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(profileUser?.name || '');
    const [editAvatar, setEditAvatar] = useState(profileUser?.avatar || '');
    const [activeTab, setActiveTab] = useState<'posts' | 'watchlist' | 'likes' | 'reposts'>('posts');

    // Update local state when profileUser changes
    useEffect(() => {
        if (profileUser) {
            setEditName(profileUser.name);
            setEditAvatar(profileUser.avatar);
        }
    }, [profileUser]);

    if (!profileUser) return null;

    const userPosts = posts.filter(p => p.user_id === profileUser.id);
    const likedPosts = posts.filter(p => profileUser.liked_posts?.includes(p.id));
    const repostedPosts = posts.filter(p => profileUser.reposted_posts?.includes(p.id));

    const handleSave = () => {
        updateUser({
            name: editName,
            avatar: editAvatar
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditName(profileUser.name);
        setEditAvatar(profileUser.avatar);
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            {/* Edit Modal */}
            {isEditing && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <div className="modal-header">
                            <h2 className="text-xl font-bold">Edit Profile</h2>
                            <button onClick={handleCancel} className="close-btn">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="modal-body space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    value={editAvatar}
                                    onChange={(e) => setEditAvatar(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={handleCancel} className="btn-secondary">Cancel</button>
                                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="profile-header">
                <div className="profile-cover">
                    <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80" alt="Cover" />
                </div>
                <div className="profile-info">
                    <div className="profile-avatar-wrapper">
                        <img src={profileUser.avatar} alt={profileUser.name} className="profile-avatar" />
                        {isOwnProfile && (
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                <Settings className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="profile-details">
                        <h1>{profileUser.name}</h1>
                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-value">{profileUser.friends.length}</span>
                                <span className="stat-label">Friends</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{userPosts.length}</span>
                                <span className="stat-label">Posts</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{profileUser.cp_balance}</span>
                                <span className="stat-label">CP</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            {profileUser.badges.map(badge => (
                                <BadgeDisplay key={badge.id} badge={badge} size="sm" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    className={clsx('tab-btn', activeTab === 'posts' && 'active')}
                    onClick={() => setActiveTab('posts')}
                >
                    Posts
                </button>
                <button
                    className={clsx('tab-btn', activeTab === 'watchlist' && 'active')}
                    onClick={() => setActiveTab('watchlist')}
                >
                    Watchlist
                </button>
                <button
                    className={clsx('tab-btn', activeTab === 'likes' && 'active')}
                    onClick={() => setActiveTab('likes')}
                >
                    Likes
                </button>
                <button
                    className={clsx('tab-btn', activeTab === 'reposts' && 'active')}
                    onClick={() => setActiveTab('reposts')}
                >
                    Reposts
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' && (
                    <div className="posts-grid">
                        {userPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        {userPosts.length === 0 && <p className="empty-state">No posts yet.</p>}
                    </div>
                )}

                {activeTab === 'watchlist' && (
                    <div className="watchlist-grid-mini">
                        {profileUser.watchlist.map(movie => (
                            <div key={movie.id} className="mini-movie-card">
                                <img src={movie.poster} alt={movie.title} />
                            </div>
                        ))}
                        {profileUser.watchlist.length === 0 && <p className="empty-state">Watchlist is empty.</p>}
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div className="posts-grid">
                        {likedPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        {likedPosts.length === 0 && <p className="empty-state">No liked posts.</p>}
                    </div>
                )}

                {activeTab === 'reposts' && (
                    <div className="posts-grid">
                        {repostedPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        {repostedPosts.length === 0 && <p className="empty-state">No reposts yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
