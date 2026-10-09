import { useStore } from '../store/useStore';
import { Film, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Watchlist.css';

export function Watchlist() {
    const currentUser = useStore((state) => state.currentUser);
    const removeFromWatchlist = useStore((state) => state.removeFromWatchlist);
    const watchMovie = useStore((state) => state.watchMovie);

    const handleWatch = (movieId: string) => {
        watchMovie(movieId);
        removeFromWatchlist(movieId);
    };

    return (
        <div className="watchlist-container">
            <div className="watchlist-header">
                <h1>My Watchlist</h1>
                <p>{currentUser.watchlist.length} movies to watch</p>
            </div>

            {currentUser.watchlist.length === 0 ? (
                <div className="empty-watchlist">
                    <Film className="w-16 h-16 text-gray-600 mb-4" />
                    <h2>Your watchlist is empty</h2>
                    <p>Start adding movies from suggestions or the discovery page!</p>
                    <Link to="/discovery" className="browse-btn">
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <div className="watchlist-grid">
                    {currentUser.watchlist.map((movie) => (
                        <div key={movie.id} className="watchlist-card">
                            <img src={movie.poster} alt={movie.title} className="watchlist-poster" />
                            <div className="watchlist-content">
                                <h3>{movie.title}</h3>
                                <div className="watchlist-meta">
                                    <span>{movie.release_year}</span>
                                    <span className="dot">•</span>
                                    <span>{movie.duration_mins} min</span>
                                </div>
                                <div className="watchlist-actions">
                                    <button
                                        onClick={() => handleWatch(movie.id)}
                                        className="action-btn watch-btn"
                                        title="Mark as Watched"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Watched</span>
                                    </button>
                                    <button
                                        onClick={() => removeFromWatchlist(movie.id)}
                                        className="action-btn remove-btn"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
