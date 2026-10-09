import { Heart, MessageCircle, Share2, Play, Repeat } from 'lucide-react';
import type { Post } from '../../types';
import { useStore } from '../../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import './PostCard.css';

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const navigate = useNavigate();
    const currentUser = useStore((state) => state.currentUser);
    const friends = useStore((state) => state.friends);
    const movies = useStore((state) => state.movies);
    const likePost = useStore((state) => state.likePost);
    const repostPost = useStore((state) => state.repostPost);

    const users = [currentUser, ...friends];

    const author = users.find(u => u.id === post.user_id);
    const movie = post.movie_id ? movies.find(m => m.id === post.movie_id) : undefined;

    const isLiked = currentUser.liked_posts?.includes(post.id);
    const isReposted = currentUser.reposted_posts?.includes(post.id);

    if (!author) return null;

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        likePost(post.id);
    };

    const handleRepost = (e: React.MouseEvent) => {
        e.stopPropagation();
        repostPost(post.id);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(url);
        // Optional: You could add a toast notification here
        alert('Link copied to clipboard!');
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/post/${post.id}`);
    };

    return (
        <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
            {/* Header */}
            <div className="post-header" onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${author.id}`);
            }} style={{ cursor: 'pointer' }}>
                <img src={author.avatar} alt={author.name} className="post-avatar hover:opacity-80 transition-opacity cursor-pointer" />
                <div>
                    <h4 className="post-author-name hover:text-violet-400 transition-colors cursor-pointer">{author.name}</h4>
                    <span className="post-time">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>

            {/* Content */}
            <p className="post-content">{post.content}</p>

            {/* Media / Movie Context */}
            {movie && (
                <div className="post-media-container">
                    {post.media_url ? (
                        <div className="post-media-wrapper">
                            <img src={post.media_url} alt="Post media" className="post-image" />
                            {post.scene_timestamp && (
                                <div className="scene-timestamp">
                                    <Play className="w-3 h-3 fill-white" />
                                    Scene at {post.scene_timestamp}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="movie-embed">
                            <img src={movie.poster} alt={movie.title} className="embed-poster" />
                            <div className="embed-info">
                                <h5 className="embed-title">{movie.title}</h5>
                                <span className="embed-meta">{movie.release_year} • {movie.duration_mins}m</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="post-actions">
                <button
                    className={clsx('action-btn like group', isLiked && 'active')}
                    onClick={handleLike}
                >
                    <Heart className={clsx('action-icon group-hover:fill-rose-500', isLiked && 'fill-rose-500 text-rose-500')} />
                    <span className={clsx(isLiked && 'text-rose-500')}>{post.likes}</span>
                </button>

                <button
                    className="action-btn comment group"
                    onClick={handleComment}
                >
                    <MessageCircle className="action-icon group-hover:text-blue-400" />
                    <span className="group-hover:text-blue-400">{post.comments.length}</span>
                </button>

                <button
                    className={clsx('action-btn repost group', isReposted && 'active')}
                    onClick={handleRepost}
                >
                    <Repeat className={clsx('action-icon group-hover:text-green-500', isReposted && 'text-green-500')} />
                    <span className={clsx(isReposted && 'text-green-500')}>{post.reposts}</span>
                </button>

                <button className="action-btn share group" onClick={handleShare}>
                    <Share2 className="action-icon group-hover:text-violet-400" />
                </button>
            </div>
        </div>
    );
}
