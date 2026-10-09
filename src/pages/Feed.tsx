import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PostCard } from '../components/Feed/PostCard';
import { CreatePost } from '../components/Feed/CreatePost';
import { MovieCard } from '../components/Movies/MovieCard';
import './Feed.css';

export function Feed() {
    const navigate = useNavigate();
    const posts = useStore((state) => state.posts);
    const movies = useStore((state) => state.movies);
    const suggestions = useStore((state) => state.suggestions);
    const currentUser = useStore((state) => state.currentUser);
    const users = useStore((state) => state.users);

    // Filter suggestions for current user
    const mySuggestions = suggestions.filter(s => s.to_user_id === currentUser.id && s.status === 'pending');

    return (
        <div className="feed-container">
            {/* Main Feed */}
            <div className="feed-main">
                <CreatePost />
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>

            {/* Right Sidebar (Suggestions & Trending) */}
            <div className="feed-sidebar">
                {/* Pending Suggestions */}
                {mySuggestions.length > 0 && (
                    <div>
                        <h3 className="feed-section-title">
                            <span className="feed-section-dot" />
                            For You
                        </h3>
                        <div className="suggestions-list">
                            {mySuggestions.map(suggestion => {
                                const movie = movies.find(m => m.id === suggestion.movie_id);
                                const sender = users.find(u => u.id === suggestion.from_user_id);
                                if (!movie) return null;
                                return (
                                    <div key={suggestion.id} className="suggestion-item">
                                        <div className="suggestion-badge">
                                            GIFT
                                        </div>
                                        <MovieCard movie={movie} />
                                        <div className="suggestion-footer">
                                            From <span
                                                className="text-violet-400 hover:underline cursor-pointer"
                                                onClick={() => sender && navigate(`/profile/${sender.id}`)}
                                            >
                                                {sender?.name || 'Friend'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Trending Movies */}
                <div>
                    <h3 className="feed-section-title">Trending Now</h3>
                    <div className="trending-grid">
                        {movies.slice(0, 2).map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
