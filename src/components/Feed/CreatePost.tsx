import { useState } from 'react';
import { Image, Film, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

export function CreatePost() {
    const [content, setContent] = useState('');
    const currentUser = useStore((state) => state.currentUser);
    const addPost = useStore((state) => state.addPost);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        addPost({
            id: `p${Date.now()}`,
            user_id: currentUser.id,
            content,
            likes: 0,
            comments: [],
            reposts: 0,
            created_at: new Date().toISOString()
        });
        setContent('');
    };

    return (
        <div className="create-post-card">
            <form onSubmit={handleSubmit}>
                <div className="create-post-header">
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="create-post-avatar cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/profile')}
                    />
                    <div className="create-post-input-wrapper">
                        <textarea
                            placeholder="What did you watch recently?"
                            className="create-post-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={2}
                        />
                    </div>
                </div>

                <div className="create-post-actions">
                    <div className="action-group">
                        <button type="button" className="media-btn">
                            <Image className="media-icon" />
                        </button>
                        <button type="button" className="media-btn">
                            <Film className="media-icon" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="post-submit-btn"
                    >
                        <Send className="send-icon" />
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
