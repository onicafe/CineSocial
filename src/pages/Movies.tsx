import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, Film } from 'lucide-react';
import { MovieCard } from '../components/Movies/MovieCard';
import clsx from 'clsx';
import './Movies.css';

export function Movies() {
    const movies = useStore((state) => state.movies);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [minRating, setMinRating] = useState<number | null>(null);

    // Extract unique genres
    const genres = useMemo(() => {
        const genreSet = new Set<string>();
        movies.forEach(movie => {
            movie.genres.forEach(genre => genreSet.add(genre));
        });
        return Array.from(genreSet).sort();
    }, [movies]);

    // Filter movies
    const filteredMovies = useMemo(() => {
        return movies.filter(movie => {
            // Search filter
            if (searchQuery && !movie.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Genre filter
            if (selectedGenre && !movie.genres.includes(selectedGenre)) {
                return false;
            }

            // Rating filter
            if (minRating !== null && movie.rating_imdb < minRating) {
                return false;
            }

            return true;
        });
    }, [movies, searchQuery, selectedGenre, minRating]);

    const ratingFilters = [
        { label: 'All Ratings', value: null },
        { label: '8.0+', value: 8.0 },
        { label: '7.0+', value: 7.0 },
        { label: '6.0+', value: 6.0 },
    ];

    return (
        <div className="movies-container">
            <div className="movies-header">
                <h1 className="movies-title">Discover Movies</h1>
                <p className="movies-subtitle">Browse our collection and find your next favorite film</p>
            </div>

            {/* Search & Filters */}
            <div className="search-filter-section">
                <div className="search-input-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-group">
                    <button
                        onClick={() => setSelectedGenre(null)}
                        className={clsx('filter-btn', selectedGenre === null && 'active')}
                    >
                        All Genres
                    </button>
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={clsx('filter-btn', selectedGenre === genre && 'active')}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="filter-group">
                    {ratingFilters.map((filter) => (
                        <button
                            key={filter.label}
                            onClick={() => setMinRating(filter.value)}
                            className={clsx('filter-btn', minRating === filter.value && 'active')}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Movies Grid */}
            <div className="movies-grid">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <div className="empty-state">
                        <Film className="empty-icon" />
                        <p className="empty-message">No movies found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
