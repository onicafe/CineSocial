import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Search, Film, Wallet } from 'lucide-react';
import clsx from 'clsx';
import './SuggestionModal.css';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    friendId: string;
}

export function SuggestionModal({ isOpen, onClose, friendId }: SuggestionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const movies = useStore((state) => state.movies);
    const currentUser = useStore((state) => state.currentUser);
    const getRelationship = useStore((state) => state.getRelationship);
    const sendSuggestion = useStore((state) => state.sendSuggestion);
    const friends = useStore((state) => state.friends);

    if (!isOpen) return null;

    const friend = friends.find(f => f.id === friendId);
    const relationship = getRelationship(currentUser.id, friendId);

    // Calculate current RP balance with this friend
    const myRpBalance = relationship
        ? (relationship.user1_id === currentUser.id ? relationship.rp_balance_1 : relationship.rp_balance_2)
        : 0;

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSend = () => {
        if (selectedMovieId) {
            sendSuggestion(friendId, selectedMovieId, message);
            onClose();
            setSelectedMovieId(null);
            setSearchQuery('');
            setMessage('');
        }
    };

    const selectedMovie = movies.find(m => m.id === selectedMovieId);
    const canAfford = selectedMovie ? myRpBalance >= selectedMovie.duration_mins : false;

    return (
        <div className="suggestion-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="suggestion-modal">
                <div className="modal-header">
                    <div className="modal-title">
                        <Film className="w-5 h-5 text-violet-400" />
                        Suggest to {friend?.name}
                    </div>
                    <button onClick={onClose} className="modal-close">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="modal-content">
                    {/* Wallet Info */}
                    <div className="wallet-info">
                        <span className="wallet-label">Your RP with {friend?.name}</span>
                        <div className="wallet-amount">
                            <Wallet className="w-5 h-5" />
                            {myRpBalance} RP
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="movie-search pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Message Input */}
                    <div className="message-input-container">
                        <textarea
                            placeholder="Add a personal note... (optional)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="suggestion-message-input"
                            rows={3}
                        />
                    </div>

                    {/* Movies Grid */}
                    <div className="movies-grid">
                        {filteredMovies.map(movie => (
                            <div
                                key={movie.id}
                                className={clsx('movie-select-card', selectedMovieId === movie.id && 'selected')}
                                onClick={() => setSelectedMovieId(movie.id)}
                            >
                                <img src={movie.poster} alt={movie.title} className="movie-select-poster" />
                                <div className="movie-select-info">
                                    <p className="movie-select-title">{movie.title}</p>
                                    <p className={clsx("movie-select-cost", myRpBalance < movie.duration_mins ? "text-red-400" : "text-violet-400")}>
                                        {movie.duration_mins} RP
                                    </p>
                                </div>
                                {selectedMovieId === movie.id && (
                                    <div className="absolute inset-0 border-2 border-violet-500 rounded-lg pointer-events-none" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="cancel-btn">
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!selectedMovieId || !canAfford}
                        className="confirm-btn"
                    >
                        <Film className="w-4 h-4" />
                        Send Suggestion
                    </button>
                </div>
            </div>
        </div>
    );
}
