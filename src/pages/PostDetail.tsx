import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Heart, MessageCircle, Repeat, Share2, Send } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import './PostDetail.css';

export function PostDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState('');

    const currentUser = useStore((state) => state.currentUser);
    const posts = useStore((state) => state.posts);
    const users = useStore((state) => state.users);
    const movies = useStore((state) => state.movies);
    const likePost = useStore((state) => state.likePost);
    const repostPost = useStore((state) => state.repostPost);
    const addComment = useStore((state) => state.addComment);

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="post-not-found">
                <h2>Post not found</h2>
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    const author = users.find(u => u.id === post.user_id);
    const movie = post.movie_id ? movies.find(m => m.id === post.movie_id) : null;
    const isLiked = currentUser.liked_posts?.includes(post.id);
    const isReposted = currentUser.reposted_posts?.includes(post.id);

    const handleLike = () => likePost(post.id);
    const handleRepost = () => repostPost(post.id);

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        addComment(post.id, commentText);
        setCommentText('');
    };

    return (
        <div className="post-detail-container">
            <div className="post-detail-header">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2>Post</h2>
            </div>

            <div className="post-detail-card">
                <div className="post-header" onClick={() => navigate(`/profile/${author?.id}`)} style={{ cursor: 'pointer' }}>
                    <img src={author?.avatar} alt={author?.name} className="author-avatar hover:opacity-80 transition-opacity" />
                    <div className="post-meta">
                        <span className="author-name hover:text-violet-400 transition-colors">{author?.name}</span>
                        <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <p className="post-content">{post.content}</p>

                {movie && (
                    <div className="post-movie-card">
                        <img src={movie.poster} alt={movie.title} className="post-movie-poster" />
                        <div className="post-movie-info">
                            <h4>{movie.title}</h4>
                            <p>{movie.release_year} • {movie.duration_mins} min</p>
                        </div>
                    </div>
                )}

                <div className="post-stats">
                    <span>{post.likes} Likes</span>
                    <span className="dot">•</span>
                    <span>{post.reposts} Reposts</span>
                    <span className="dot">•</span>
                    <span>{post.comments.length} Comments</span>
                </div>

                <div className="post-actions">
                    <button
                        className={clsx('action-btn', isLiked && 'liked')}
                        onClick={handleLike}
                    >
                        <Heart className={clsx('w-5 h-5', isLiked && 'fill-current')} />
                    </button>
                    <button className="action-btn">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                        className={clsx('action-btn', isReposted && 'reposted')}
                        onClick={handleRepost}
                    >
                        <Repeat className="w-5 h-5" />
                    </button>
                    <button className="action-btn">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="comments-section">
                <h3>Comments</h3>

                <form onSubmit={handleComment} className="comment-form">
                    <img src={currentUser.avatar} alt={currentUser.name} className="comment-avatar" />
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Post your reply..."
                        className="comment-input"
                    />
                    <button type="submit" disabled={!commentText.trim()} className="comment-submit-btn">
                        <Send className="w-4 h-4" />
                    </button>
                </form>

                <div className="comments-list">
                    {post.comments.map(comment => {
                        const commentAuthor = users.find(u => u.id === comment.user_id);
                        return (
                            <div key={comment.id} className="comment-item">
                                <img
                                    src={commentAuthor?.avatar}
                                    alt={commentAuthor?.name}
                                    className="comment-author-avatar cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => navigate(`/profile/${commentAuthor?.id}`)}
                                />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span
                                            className="comment-author-name cursor-pointer hover:text-violet-400 transition-colors"
                                            onClick={() => navigate(`/profile/${commentAuthor?.id}`)}
                                        >
                                            {commentAuthor?.name}
                                        </span>
                                        <span className="comment-time">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
