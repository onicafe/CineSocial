import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Send, Film, X, MessageSquare, PlusCircle, Bookmark, Check } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SuggestionModal } from '../components/Movies/SuggestionModal';
import clsx from 'clsx';
import './Chat.css';
import type { Movie } from '../types';

export function Chat() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const suggestMovieId = searchParams.get('suggest');

    const currentUser = useStore((state) => state.currentUser);
    const users = useStore((state) => state.users);
    const movies = useStore((state) => state.movies);
    const chatMessages = useStore((state) => state.chatMessages);
    const addChatMessage = useStore((state) => state.addChatMessage);
    const sendSuggestion = useStore((state) => state.sendSuggestion);
    const addToWatchlist = useStore((state) => state.addToWatchlist);

    const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
    const [suggestionMovie, setSuggestionMovie] = useState<Movie | null>(null);
    const [addedToWatchlistIds, setAddedToWatchlistIds] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize suggestion if present in URL
    useEffect(() => {
        if (suggestMovieId) {
            const movie = movies.find(m => m.id === suggestMovieId);
            if (movie) {
                setSuggestionMovie(movie);
            }
        }
    }, [suggestMovieId, movies]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, selectedFriendId]);

    const availableFriends = users.filter(u => currentUser.friends.includes(u.id));
    const selectedFriend = users.find(u => u.id === selectedFriendId);

    const conversationMessages = chatMessages.filter(msg =>
        (msg.senderId === currentUser.id && msg.receiverId === selectedFriendId) ||
        (msg.senderId === selectedFriendId && msg.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!message.trim() && !suggestionMovie) || !selectedFriendId) return;

        if (suggestionMovie) {
            sendSuggestion(selectedFriendId, suggestionMovie.id, message);
            setSuggestionMovie(null);
        } else {
            addChatMessage({
                id: `msg${Date.now()}`,
                senderId: currentUser.id,
                receiverId: selectedFriendId,
                text: message,
                timestamp: new Date().toISOString()
            });
        }

        setMessage('');
    };

    const handleAddToWatchlist = (movie: Movie) => {
        addToWatchlist(movie);
        setAddedToWatchlistIds(prev => [...prev, movie.id]);

        // Show toast or feedback (optional, using temporary state for button feedback)
        setTimeout(() => {
            setAddedToWatchlistIds(prev => prev.filter(id => id !== movie.id));
        }, 2000);
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h2>Messages</h2>
                </div>
                <div className="friends-list">
                    {availableFriends.map(friend => (
                        <div
                            key={friend.id}
                            className={clsx('friend-item', selectedFriendId === friend.id && 'active')}
                            onClick={() => setSelectedFriendId(friend.id)}
                        >
                            <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                            <div className="friend-info">
                                <span className="friend-name">{friend.name}</span>
                                <span className="friend-status">Online</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-main">
                {selectedFriend ? (
                    <>
                        <div className="chat-header" onClick={() => navigate(`/profile/${selectedFriend.id}`)} style={{ cursor: 'pointer' }}>
                            <img src={selectedFriend.avatar} alt={selectedFriend.name} className="header-avatar hover:opacity-80 transition-opacity" />
                            <div className="header-info">
                                <h3 className="hover:text-violet-400 transition-colors">{selectedFriend.name}</h3>
                                <span>Online</span>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {conversationMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        'message-bubble',
                                        msg.senderId === currentUser.id ? 'sent' : 'received',
                                        msg.suggestion && 'has-suggestion'
                                    )}
                                >
                                    {msg.text && <p className="message-text">{msg.text}</p>}
                                    {msg.suggestion && (
                                        <div className="suggestion-card">
                                            <div className="suggestion-card-header">
                                                <Film className="w-4 h-4 text-violet-400" />
                                                <span>Movie Suggestion</span>
                                            </div>
                                            <div className="suggestion-card-content">
                                                <img src={msg.suggestion.poster} alt="" className="suggestion-poster" />
                                                <div className="suggestion-details">
                                                    <h4>{msg.suggestion.title}</h4>
                                                    <div className="suggestion-meta">
                                                        <span>{msg.suggestion.release_year}</span>
                                                        <span className="dot">•</span>
                                                        <span>{msg.suggestion.duration_mins} min</span>
                                                    </div>
                                                    <div className="suggestion-cost">
                                                        Earn {msg.suggestion.duration_mins} CP
                                                    </div>

                                                    {msg.senderId !== currentUser.id && (
                                                        <button
                                                            className={clsx(
                                                                "add-watchlist-btn",
                                                                addedToWatchlistIds.includes(msg.suggestion.id) && "added"
                                                            )}
                                                            onClick={() => msg.suggestion && handleAddToWatchlist(msg.suggestion)}
                                                            disabled={addedToWatchlistIds.includes(msg.suggestion.id)}
                                                        >
                                                            {addedToWatchlistIds.includes(msg.suggestion.id) ? (
                                                                <>
                                                                    <Check className="w-3 h-3" />
                                                                    Added
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Bookmark className="w-3 h-3" />
                                                                    Add to Watchlist
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            {suggestionMovie && (
                                <div className="suggestion-preview">
                                    <div className="preview-content">
                                        <Film className="w-4 h-4 text-violet-400" />
                                        <span className="preview-text">Suggesting: {suggestionMovie.title}</span>
                                    </div>
                                    <button onClick={() => setSuggestionMovie(null)} className="close-preview-btn">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <form onSubmit={handleSend} className="chat-form">
                                <button
                                    type="button"
                                    className="attach-btn"
                                    onClick={() => setIsSuggestionModalOpen(true)}
                                    title="Suggest Movie"
                                >
                                    <PlusCircle className="w-6 h-6 text-violet-400" />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="chat-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim() && !suggestionMovie}
                                    className="send-btn"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="empty-chat-state">
                        <MessageSquare className="empty-icon" />
                        <p>Select a friend to start messaging</p>
                    </div>
                )}
            </div>

            {selectedFriendId && (
                <SuggestionModal
                    isOpen={isSuggestionModalOpen}
                    onClose={() => setIsSuggestionModalOpen(false)}
                    friendId={selectedFriendId}
                />
            )}
        </div>
    );
}
