import { Play, Plus, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import { useStore } from '../../store/useStore';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
    onSuggest?: () => void;
}

export function MovieCard({ movie, onSuggest }: MovieCardProps) {
    const currentUser = useStore((state) => state.currentUser);
    const isWatched = currentUser.history.some(h => h.movie_id === movie.id);

    return (
        <Link to={`/movies/${movie.id}`} className="movie-card">
            <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
            />

            {/* Overlay */}
            <div className="movie-overlay">
                <h3 className="movie-title">{movie.title}</h3>

                <div className="movie-meta">
                    <span className="meta-item">
                        <Star className="star-icon" />
                        {movie.rating_imdb}
                    </span>
                    <span>•</span>
                    <span className="meta-item">
                        <Clock className="clock-icon" />
                        {movie.duration_mins}m
                    </span>
                </div>

                <div className="movie-actions">
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSuggest?.(); }}
                        className="btn-suggest"
                    >
                        <Plus className="w-3 h-3" />
                        Suggest
                    </button>
                    {/* Watch Button (Mock) */}
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="btn-watch"
                    >
                        <Play className="w-4 h-4 fill-white" />
                    </button>
                </div>
            </div>

            {/* Watched Badge */}
            {isWatched && (
                <div className="watched-badge">
                    WATCHED
                </div>
            )}
        </Link>
    );
}
