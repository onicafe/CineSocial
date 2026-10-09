export interface User {
    id: string;
    name: string;
    avatar: string;
    // rp_balance: number; // REMOVED: RP is now per-relationship
    cp_balance: number; // Currency Points (Global)
    badges: Badge[];
    watchlist: Movie[];
    history: WatchHistory[];
    friends: string[]; // User IDs
    liked_posts: string[]; // Post IDs
    reposted_posts: string[]; // Post IDs
    status?: 'online' | 'offline';
}

export interface Relationship {
    id: string;
    user1_id: string;
    user2_id: string;
    rp_balance_1: number; // User 1's RP balance with User 2
    rp_balance_2: number; // User 2's RP balance with User 1
}

export interface Movie {
    id: string;
    title: string;
    poster: string;
    backdrop: string;
    duration_mins: number;
    description: string;
    rating_imdb: number;
    rating_rotten: number;
    rating_app: number; // Average rating from app users
    genres: string[];
    release_year: number;
    where_to_watch: Array<{ platform: string; link: string }>;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked_at?: string;
}

export interface WatchHistory {
    movie_id: string;
    watched_at: string;
    rp_earned: number;
}

export interface Suggestion {
    id: string;
    from_user_id: string;
    to_user_id: string;
    movie_id: string;
    status: 'pending' | 'watched' | 'rejected';
    rp_cost: number;
    created_at: string;
    message?: string;
}

export interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export interface Post {
    id: string;
    user_id: string;
    movie_id?: string;
    content: string;
    media_url?: string;
    media_type?: 'image' | 'video' | 'gif';
    scene_timestamp?: string; // e.g., "1:08:26"
    likes: number;
    comments: Comment[];
    reposts: number;
    created_at: string;
    is_global_recommendation?: boolean; // Curator mode
}

export interface StoreItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'frame' | 'theme' | 'badge';
    preview_url: string;
    purchased?: boolean;
}

export interface Notification {
    id: string;
    user_id: string; // Who receives the notification
    type: 'suggestion' | 'like' | 'comment' | 'system';
    content: string;
    read: boolean;
    created_at: string;
    link?: string; // e.g., "/chat" or "/movies/m1"
    related_user_id?: string; // Who triggered it
}

export interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
    suggestion?: Movie; // If it's a suggestion card
}
