import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Movie, Post, Suggestion, StoreItem, Relationship, Notification, ChatMessage } from '../types';
import { MOCK_USER, MOCK_MOVIES, MOCK_FRIENDS, MOCK_POSTS, MOCK_SUGGESTIONS, MOCK_STORE_ITEMS, MOCK_RELATIONSHIPS, MOCK_CHAT_MESSAGES } from '../services/mockData';

interface AppState {
    currentUser: User;
    users: User[];
    friends: User[];
    movies: Movie[];
    posts: Post[];
    suggestions: Suggestion[];
    storeItems: StoreItem[];
    relationships: Relationship[];
    notifications: Notification[];
    chatMessages: ChatMessage[];

    // Actions
    setCurrentUser: (userId: string) => void;
    updateUser: (updates: Partial<User>) => void;
    addPost: (post: Post) => void;

    // Notification Actions
    addNotification: (notification: Notification) => void;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;

    // Chat Actions
    addChatMessage: (message: ChatMessage) => void;

    // Watchlist Actions
    addToWatchlist: (movie: Movie) => void;
    removeFromWatchlist: (movieId: string) => void;

    // Social Actions
    likePost: (postId: string) => void;
    repostPost: (postId: string) => void;
    addComment: (postId: string, content: string) => void;

    // Gamification Actions
    sendSuggestion: (toUserId: string, movieId: string, message?: string) => void;
    watchMovie: (movieId: string, suggestionId?: string) => void;
    buyItem: (itemId: string, cost: number) => boolean;

    // Helpers
    getRelationship: (userId1: string, userId2: string) => Relationship | undefined;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            currentUser: MOCK_USER,
            users: [MOCK_USER, ...MOCK_FRIENDS],
            friends: MOCK_FRIENDS,
            movies: MOCK_MOVIES,
            posts: MOCK_POSTS,
            suggestions: MOCK_SUGGESTIONS,
            storeItems: MOCK_STORE_ITEMS,
            relationships: MOCK_RELATIONSHIPS,
            notifications: [],
            chatMessages: MOCK_CHAT_MESSAGES,

            setCurrentUser: (userId) => {
                const { users } = get();
                const user = users.find(u => u.id === userId);
                if (user) {
                    set({ currentUser: user });
                }
            },

            updateUser: (updates) => {
                const { currentUser, users } = get();
                const updatedUser = { ...currentUser, ...updates };
                const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
                set({ currentUser: updatedUser, users: updatedUsers });
            },

            addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

            addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),

            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            markAllNotificationsRead: () => {
                const { currentUser, notifications } = get();
                set({
                    notifications: notifications.map(n => n.user_id === currentUser.id ? { ...n, read: true } : n)
                });
            },

            addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),

            getRelationship: (userId1, userId2) => {
                const { relationships } = get();
                return relationships.find(r =>
                    (r.user1_id === userId1 && r.user2_id === userId2) ||
                    (r.user1_id === userId2 && r.user2_id === userId1)
                );
            },

            addToWatchlist: (movie) => {
                const { currentUser, users } = get();
                if (currentUser.watchlist.some(m => m.id === movie.id)) return;

                const updatedUser = { ...currentUser, watchlist: [...currentUser.watchlist, movie] };
                const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

                set({ currentUser: updatedUser, users: updatedUsers });
            },

            removeFromWatchlist: (movieId) => {
                const { currentUser, users } = get();
                const updatedUser = {
                    ...currentUser,
                    watchlist: currentUser.watchlist.filter(m => m.id !== movieId)
                };
                const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

                set({ currentUser: updatedUser, users: updatedUsers });
            },

            likePost: (postId) => {
                const { currentUser, posts, users } = get();
                const postIndex = posts.findIndex(p => p.id === postId);
                if (postIndex === -1) return;

                const isLiked = currentUser.liked_posts?.includes(postId);
                const updatedPosts = [...posts];
                const updatedUser = { ...currentUser };

                if (isLiked) {
                    // Unlike
                    updatedPosts[postIndex] = { ...updatedPosts[postIndex], likes: updatedPosts[postIndex].likes - 1 };
                    updatedUser.liked_posts = (updatedUser.liked_posts || []).filter(id => id !== postId);
                } else {
                    // Like
                    updatedPosts[postIndex] = { ...updatedPosts[postIndex], likes: updatedPosts[postIndex].likes + 1 };
                    updatedUser.liked_posts = [...(updatedUser.liked_posts || []), postId];
                }

                const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
                set({ posts: updatedPosts, currentUser: updatedUser, users: updatedUsers });
            },

            repostPost: (postId) => {
                console.log('repostPost called for:', postId);
                const { currentUser, posts, users } = get();
                const postIndex = posts.findIndex(p => p.id === postId);
                if (postIndex === -1) {
                    console.error('Post not found:', postId);
                    return;
                }

                const isReposted = currentUser.reposted_posts?.includes(postId);
                const updatedPosts = [...posts];
                const updatedUser = { ...currentUser };

                if (isReposted) {
                    // Un-repost
                    console.log('Un-reposting');
                    updatedPosts[postIndex] = { ...updatedPosts[postIndex], reposts: Math.max(0, updatedPosts[postIndex].reposts - 1) };
                    updatedUser.reposted_posts = (updatedUser.reposted_posts || []).filter(id => id !== postId);
                } else {
                    // Repost
                    console.log('Reposting');
                    updatedPosts[postIndex] = { ...updatedPosts[postIndex], reposts: updatedPosts[postIndex].reposts + 1 };
                    updatedUser.reposted_posts = [...(updatedUser.reposted_posts || []), postId];
                }

                const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

                set({ posts: updatedPosts, currentUser: updatedUser, users: updatedUsers });
            },

            addComment: (postId, content) => {
                const { currentUser, posts } = get();
                const postIndex = posts.findIndex(p => p.id === postId);
                if (postIndex === -1) return;

                const newComment = {
                    id: `c${Date.now()}`,
                    user_id: currentUser.id,
                    content,
                    created_at: new Date().toISOString()
                };

                const updatedPosts = [...posts];
                updatedPosts[postIndex] = {
                    ...updatedPosts[postIndex],
                    comments: [...updatedPosts[postIndex].comments, newComment]
                };

                set({ posts: updatedPosts });
            },

            sendSuggestion: (toUserId, movieId, message) => {
                const { currentUser, movies, suggestions, relationships } = get();
                const movie = movies.find(m => m.id === movieId);
                if (!movie) return;

                const cost = movie.duration_mins;

                // Find relationship
                const relIndex = relationships.findIndex(r =>
                    (r.user1_id === currentUser.id && r.user2_id === toUserId) ||
                    (r.user1_id === toUserId && r.user2_id === currentUser.id)
                );

                if (relIndex === -1) {
                    console.error("No relationship found between users");
                    return;
                }

                const rel = relationships[relIndex];
                const isUser1 = rel.user1_id === currentUser.id;
                const currentBalance = isUser1 ? rel.rp_balance_1 : rel.rp_balance_2;

                if (currentBalance < cost) {
                    alert("Not enough RP with this friend to suggest this movie!");
                    return;
                }

                // Update Relationship Balance
                const updatedRel = { ...rel };
                if (isUser1) {
                    updatedRel.rp_balance_1 -= cost;
                } else {
                    updatedRel.rp_balance_2 -= cost;
                }

                const updatedRelationships = [...relationships];
                updatedRelationships[relIndex] = updatedRel;

                const newSuggestion: Suggestion = {
                    id: `s${Date.now()}`,
                    from_user_id: currentUser.id,
                    to_user_id: toUserId,
                    movie_id: movieId,
                    status: 'pending',
                    rp_cost: cost,
                    created_at: new Date().toISOString(),
                    message: message // Add custom message
                };

                // Create Notification for the recipient
                const newNotification: Notification = {
                    id: `n${Date.now()}`,
                    user_id: toUserId,
                    type: 'suggestion',
                    content: `${currentUser.name} suggested you watch "${movie.title}"`,
                    read: false,
                    created_at: new Date().toISOString(),
                    link: '/chat',
                    related_user_id: currentUser.id
                };

                // Create Chat Message for the suggestion
                const newChatMessage: ChatMessage = {
                    id: `msg${Date.now()}`,
                    senderId: currentUser.id,
                    receiverId: toUserId,
                    text: message || `I suggest you watch ${movie.title}!`,
                    timestamp: new Date().toISOString(),
                    suggestion: movie
                };

                set({
                    relationships: updatedRelationships,
                    suggestions: [...suggestions, newSuggestion],
                    notifications: [newNotification, ...get().notifications],
                    chatMessages: [...get().chatMessages, newChatMessage]
                });
            },

            watchMovie: (movieId, suggestionId) => {
                const { currentUser, movies, suggestions, friends, relationships } = get();
                const movie = movies.find(m => m.id === movieId);
                if (!movie) return;

                const duration = movie.duration_mins;
                let earnedCP = duration;

                // If it was a suggestion
                if (suggestionId) {
                    const suggestion = suggestions.find(s => s.id === suggestionId);
                    if (suggestion && suggestion.status === 'pending') {

                        // Find relationship
                        const relIndex = relationships.findIndex(r =>
                            (r.user1_id === suggestion.from_user_id && r.user2_id === currentUser.id) ||
                            (r.user1_id === currentUser.id && r.user2_id === suggestion.from_user_id)
                        );

                        if (relIndex !== -1) {
                            const rel = relationships[relIndex];
                            const isWatcherUser1 = rel.user1_id === currentUser.id;

                            // Watcher earns RP back into THEIR balance with the suggester
                            const updatedRel = { ...rel };
                            if (isWatcherUser1) {
                                updatedRel.rp_balance_1 += suggestion.rp_cost;
                            } else {
                                updatedRel.rp_balance_2 += suggestion.rp_cost;
                            }

                            const updatedRelationships = [...relationships];
                            updatedRelationships[relIndex] = updatedRel;
                            set({ relationships: updatedRelationships });
                        }

                        // Mark suggestion as watched
                        const updatedSuggestions = suggestions.map(s =>
                            s.id === suggestionId ? { ...s, status: 'watched' as const } : s
                        );

                        // Reward the suggester (Friend) with CP
                        const friendIndex = friends.findIndex(f => f.id === suggestion.from_user_id);
                        if (friendIndex !== -1) {
                            const updatedFriends = [...friends];
                            updatedFriends[friendIndex] = {
                                ...updatedFriends[friendIndex],
                                cp_balance: updatedFriends[friendIndex].cp_balance + duration
                            };
                            set({ friends: updatedFriends });
                        }

                        set({ suggestions: updatedSuggestions });
                    }
                }

                // Update User History & CP
                const updatedUser = {
                    ...currentUser,
                    cp_balance: currentUser.cp_balance + earnedCP,
                    history: [...currentUser.history, { movie_id: movieId, watched_at: new Date().toISOString(), rp_earned: 0 }]
                };

                set({ currentUser: updatedUser });
            },

            buyItem: (_itemId, cost) => {
                const { currentUser } = get();
                if (currentUser.cp_balance >= cost) {
                    set({ currentUser: { ...currentUser, cp_balance: currentUser.cp_balance - cost } });
                    return true;
                }
                return false;
            }
        }),
        {
            name: 'movie-social-storage-v3', // Changed to force reset for new types
            storage: createJSONStorage(() => localStorage),
        }
    )
);
