# CineSocial

![CineSocial Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80)

> The ultimate social network bridging movie discovery with meaningful social interactions and a unique gamified economy.

## 🎬 About the Project

**CineSocial** is an interactive, React-based social platform built for movie enthusiasts. It moves beyond standard movie tracking by introducing deep social features, direct recommendations between friends, and an innovative dual-currency economy that rewards engagement and relationship-building.

### 💡 The Vision

We wanted to create a platform where suggesting a movie to a friend feels impactful, and watching a recommended movie is rewarding. By combining traditional social feeds with a bilateral economy, CineSocial turns movie watching into a collaborative, gamified experience.

---

## ✨ Core Features

### 1. Dual-Economy Gamification
*   **CP (Currency Points) - Global Wallet:** Users earn CP by actively watching movies. These points can be spent in the **CineStore** to purchase profile customizations (e.g., Neon Avatar Frames, Premium Dark Themes, Cinephile Badges).
*   **RP (Relationship Points) - Bilateral Economy:** A shared, specific wallet between two friends.
    *   Suggesting a movie costs RP (proportional to the movie's duration).
    *   When the friend watches the suggested movie, the RP is refunded to the shared wallet, and the suggester receives a CP bonus.
    *   This limits spam and makes recommendations valuable.

### 2. Rich Social Interactions
*   **Dynamic Feed:** Share thoughts, specific scene timestamps, and reviews.
*   **Deep Navigation:** Clickable avatars and names across the entire app (Feeds, Chats, Notifications, Comments) seamlessly route users to detailed profiles.
*   **Interactions:** Like, Comment, and Repost (Toggleable) functionality to amplify content.

### 3. Movie Discovery & Suggestions
*   **Discovery Engine:** Filter movies by genre, platform, and ratings (IMDb, Rotten Tomatoes, CineSocial App).
*   **Interactive Chat:** Send direct messages or "Premium Suggestion Cards". When a friend accepts a card, the movie is added directly to their Watchlist.
*   **Watchlist Management:** Keep track of movies you want to watch and easily mark them as "Watched" to trigger economy rewards.

---

## 🛠️ What We Built (Current State)

During our development sessions, we successfully implemented:
- **Frontend Architecture:** Robust structure using React, TypeScript, and CSS modules.
- **State Management:** Implemented `Zustand` for complex global state handling (Users, Posts, Watchlists, and the dual CP/RP economy calculations).
- **Routing & Navigation:** Comprehensive routing using `react-router-dom` ensuring every user interaction and profile link connects flawlessly.
- **UI/UX Polishing:** Fixed layout issues, implemented modal suggestion systems in chat, built the Store interface, and ensured robust toggle behaviors for social interactions (like the Repost feature).
- **Mock Data Engine:** A robust local data service simulating relationships, chat histories, and movie databases for testing.

## 🚀 Future Roadmap (What We Want)

As we look to the future, the goal is to transform this frontend architecture into a fully deployed, production-ready application:

1.  **Backend Integration:** Replace the Zustand mock store with a robust backend (Node.js/Express or Python/Django) and a PostgreSQL database to manage real user relationships and economies securely.
2.  **Real-Time Data:** Implement WebSockets (e.g., Socket.io) for live chat, real-time notifications, and instant feed updates.
3.  **External API Integration:** Connect to TMDB (The Movie Database) API to fetch live movie data, posters, and streaming availability (JustWatch integration).
4.  **Authentication:** Add secure user authentication (OAuth, JWT).
5.  **Mobile App:** Port the responsive web design into a React Native application for iOS and Android.

---

*Project developed and conceptualized as a modern approach to social movie discovery.*
