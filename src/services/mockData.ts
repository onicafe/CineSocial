import type { Movie, User, Post, Suggestion, StoreItem, Relationship } from '../types';

export const MOCK_MOVIES: Movie[] = [
    {
        id: 'm1',
        title: 'Inception',
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        duration_mins: 148,
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        rating_imdb: 8.8,
        rating_rotten: 87,
        rating_app: 9.2,
        genres: ['Sci-Fi', 'Action', 'Thriller'],
        release_year: 2010,
        where_to_watch: [
            { platform: 'Netflix', link: 'https://www.netflix.com' },
            { platform: 'HBO Max', link: 'https://www.hbomax.com' }
        ]
    },
    {
        id: 'm2',
        title: 'The Grand Budapest Hotel',
        poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/q1NXVBTqFNEXweLeFTuf0Kjza2k.jpg',
        duration_mins: 99,
        description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
        rating_imdb: 8.1,
        rating_rotten: 92,
        rating_app: 8.7,
        genres: ['Comedy', 'Drama'],
        release_year: 2014,
        where_to_watch: [
            { platform: 'Disney+', link: 'https://www.disneyplus.com' },
            { platform: 'Hulu', link: 'https://www.hulu.com' }
        ]
    },
    {
        id: 'm3',
        title: 'Hereditary',
        poster: 'https://image.tmdb.org/t/p/w500/p9fopCfUgn7WbH7e8602qQyF681.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/4s2d3xdyq571n2Yyq5pRcPu64h.jpg',
        duration_mins: 127,
        description: 'A grieving family is haunted by tragic and disturbing occurrences.',
        rating_imdb: 7.3,
        rating_rotten: 89,
        rating_app: 8.1,
        genres: ['Horror', 'Drama'],
        release_year: 2018,
        where_to_watch: [
            { platform: 'Prime Video', link: 'https://www.amazon.com/primevideo' }
        ]
    }
];

export const MOCK_USER: User = {
    id: 'u1',
    name: 'Jordan Filmbuff',
    avatar: 'https://i.pravatar.cc/150?u=u1_new',
    cp_balance: 450,
    badges: [
        { id: 'b1', name: 'Fresh Face', icon: '👋', description: 'Joined recently' }
    ],
    watchlist: [
        {
            id: 'm2',
            title: 'The Grand Budapest Hotel',
            poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/q1NXVBTqFNEXweLeFTuf0Kjza2k.jpg',
            duration_mins: 99,
            description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious years under an exceptional concierge.',
            rating_imdb: 8.1,
            rating_rotten: 92,
            rating_app: 8.7,
            genres: ['Comedy', 'Drama'],
            release_year: 2014,
            where_to_watch: [
                { platform: 'Disney+', link: 'https://www.disneyplus.com' },
                { platform: 'Hulu', link: 'https://www.hulu.com' }
            ]
        }
    ],
    history: [],
    friends: ['u2', 'u3'],
    liked_posts: [],
    reposted_posts: []
};

export const MOCK_FRIENDS: User[] = [
    {
        id: 'u2',
        name: 'Sarah Connor',
        avatar: 'https://i.pravatar.cc/150?u=u2',
        cp_balance: 100,
        badges: [],
        watchlist: [],
        history: [],
        friends: ['u1', 'u3'],
        status: 'online',
        liked_posts: [],
        reposted_posts: []
    },
    {
        id: 'u3',
        name: 'John Wick',
        avatar: 'https://i.pravatar.cc/150?u=u3',
        cp_balance: 1200,
        badges: [],
        watchlist: [],
        history: [],
        friends: ['u1', 'u2'],
        status: 'offline',
        liked_posts: [],
        reposted_posts: []
    }
];

export const MOCK_RELATIONSHIPS: Relationship[] = [
    {
        id: 'r1',
        user1_id: 'u1', // Jordan
        user2_id: 'u2', // Sarah
        rp_balance_1: 1000,
        rp_balance_2: 1000
    },
    {
        id: 'r2',
        user1_id: 'u1', // Jordan
        user2_id: 'u3', // John
        rp_balance_1: 1000,
        rp_balance_2: 1000
    },
    {
        id: 'r3',
        user1_id: 'u2', // Sarah
        user2_id: 'u3', // John
        rp_balance_1: 1000,
        rp_balance_2: 1000
    }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        user_id: 'u2',
        movie_id: 'm3',
        content: 'This scene absolutely destroyed me. I can\'t sleep!',
        scene_timestamp: '1:32:15',
        likes: 24,
        comments: [
            {
                id: 'c1',
                user_id: 'u1',
                content: 'Totally agree! The acting was phenomenal.',
                created_at: new Date(Date.now() - 3600000).toISOString()
            }
        ],
        reposts: 12,
        created_at: new Date().toISOString(),
        media_type: 'image',
        media_url: 'https://image.tmdb.org/t/p/original/4s2d3xdyq571n2Yyq5pRcPu64h.jpg'
    }
];

export const MOCK_SUGGESTIONS: Suggestion[] = [];

export const MOCK_CHAT_MESSAGES: any[] = [
    {
        id: 'msg1',
        senderId: 'u2', // Sarah
        receiverId: 'u1', // Jordan
        text: 'Hey Jordan! Welcome to the app.',
        timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'msg2',
        senderId: 'u1', // Jordan
        receiverId: 'u2', // Sarah
        text: 'Thanks Sarah! Loving the design so far.',
        timestamp: new Date(Date.now() - 86300000).toISOString()
    }
];

export const MOCK_STORE_ITEMS: StoreItem[] = [
    {
        id: 'item1',
        name: 'Neon Frame',
        description: 'A glowing neon frame for your avatar.',
        cost: 500,
        type: 'frame',
        preview_url: 'https://i.pravatar.cc/150?u=item1'
    },
    {
        id: 'item2',
        name: 'Dark Mode Pro',
        description: 'An even darker theme for late night watching.',
        cost: 1000,
        type: 'theme',
        preview_url: 'https://i.pravatar.cc/150?u=item2'
    },
    {
        id: 'item3',
        name: 'Cinephile Badge',
        description: 'Show off your love for cinema.',
        cost: 300,
        type: 'badge',
        preview_url: 'https://i.pravatar.cc/150?u=item3'
    }
];
