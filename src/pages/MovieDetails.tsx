import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Play, Share2, ArrowLeft, Users, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import './MovieDetails.css';

export function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const movies = useStore((state) => state.movies);
    const suggestions = useStore((state) => state.suggestions);
    const friends = useStore((state) => state.friends);
    const currentUser = useStore((state) => state.currentUser);

    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return <div className="text-center py-20">Movie not found</div>;
    }

    // Find friends who recommended this movie
    const friendRecommendations = suggestions
        .filter(s => s.movie_id === movie.id && s.to_user_id === currentUser.id)
        .map(s => friends.find(f => f.id === s.from_user_id))
        .filter(Boolean);

    const handleSuggest = () => {
        navigate('/chat?suggest=' + movie.id);
    };

    return (
        <div className="movie-details-container">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="back-button"
            >
                <ArrowLeft className="icon-back" />
                <span className="font-medium">Back</span>
            </button>

            {/* Hero Section with Backdrop */}
            <div className="hero-section">
                {/* Backdrop Image */}
                <div className="hero-backdrop">
                    <img
                        src={movie.backdrop}
                        alt={movie.title}
                        className="backdrop-image"
                    />
                    <div className="backdrop-overlay" />
                </div>

                {/* Content Overlay */}
                <div className="hero-content">
                    <h1 className="movie-title-hero">{movie.title}</h1>

                    {/* Rating Pills */}
                    <div className="rating-pills">
                        <div className="pill pill-imdb">
                            <Star className="pill-icon" style={{ color: '#facc15', fill: '#facc15' }} />
                            <span className="font-bold text-yellow">{movie.rating_imdb}</span>
                            <span className="text-sm" style={{ color: '#e5e7eb' }}>IMDb</span>
                        </div>
                        <div className="pill pill-rotten">
                            <span className="text-xl">🍅</span>
                            <span className="font-bold text-red">{movie.rating_rotten}%</span>
                            <span className="text-sm" style={{ color: '#e5e7eb' }}>Rotten</span>
                        </div>
                        <div className="pill pill-app">
                            <Star className="pill-icon" style={{ color: '#c4b5fd', fill: '#c4b5fd' }} />
                            <span className="font-bold text-violet">{movie.rating_app.toFixed(1)}</span>
                            <span className="text-sm" style={{ color: '#e5e7eb' }}>CineSocial</span>
                        </div>
                        <div className="pill pill-info">
                            <Clock className="pill-icon" style={{ color: '#d1d5db' }} />
                            <span>{movie.duration_mins} min</span>
                        </div>
                        <div className="pill pill-info">
                            <span>{movie.release_year}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hero-actions">
                        <button className="btn-hero btn-watch-now">
                            <Play className="w-5 h-5 fill-black" />
                            Watch Now
                        </button>
                        <button
                            onClick={handleSuggest}
                            className="btn-hero btn-suggest-friend"
                        >
                            <Share2 className="w-5 h-5" />
                            Suggest to Friend
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="details-grid">
                {/* Main Content - Left Column (2/3) */}
                <div className="main-content">
                    {/* Synopsis */}
                    <section className="section-card">
                        <h2 className="section-title">
                            <div className="title-accent"></div>
                            Synopsis
                        </h2>
                        <p className="synopsis-text">{movie.description}</p>
                    </section>

                    {/* Friend Recommendations */}
                    {friendRecommendations.length > 0 && (
                        <section className="section-card friend-recommendations">
                            <h2 className="section-title">
                                <Users className="w-6 h-6 text-violet" />
                                Recommended by Your Friends
                            </h2>
                            <div className="friends-grid">
                                {friendRecommendations.map((friend) => friend && (
                                    <div
                                        key={friend.id}
                                        className="friend-card cursor-pointer hover:bg-white/5 transition-colors"
                                        onClick={() => navigate(`/profile/${friend.id}`)}
                                    >
                                        <img
                                            src={friend.avatar}
                                            alt={friend.name}
                                            className="friend-avatar"
                                        />
                                        <div className="friend-info">
                                            <p className="font-medium hover:text-violet-400 transition-colors">{friend.name}</p>
                                            <p className="text-sm opacity-60">Suggested this to you</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Genres */}
                    <section className="section-card">
                        <h2 className="section-title">
                            <div className="title-accent"></div>
                            Genres
                        </h2>
                        <div className="genres-list">
                            {movie.genres.map(genre => (
                                <span key={genre} className="genre-tag">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar - Right Column (1/3) */}
                <div className="sidebar">
                    {/* Where to Watch */}
                    <section className="section-card">
                        <h3 className="section-title">
                            <Play className="w-5 h-5 text-violet" />
                            Where to Watch
                        </h3>
                        <div className="watch-list">
                            {movie.where_to_watch.map(({ platform, link }) => (
                                <a
                                    key={platform}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="watch-link group"
                                >
                                    <span className="watch-platform">{platform}</span>
                                    <ExternalLink className="w-4 h-4 text-violet group-hover:translate-x-1 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Movie Details */}
                    <section className="section-card">
                        <h3 className="section-title">Movie Details</h3>
                        <div className="details-list">
                            <div className="detail-item">
                                <span className="detail-label">Duration</span>
                                <span className="detail-value">{movie.duration_mins} min</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Release Year</span>
                                <span className="detail-value">{movie.release_year}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">IMDb Rating</span>
                                <span className="detail-value text-yellow">{movie.rating_imdb}/10</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Rotten Tomatoes</span>
                                <span className="detail-value text-red">{movie.rating_rotten}%</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">CineSocial Rating</span>
                                <span className="detail-value text-violet">{movie.rating_app.toFixed(1)}/10</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
