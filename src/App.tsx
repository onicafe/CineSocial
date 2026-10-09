import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Feed } from './pages/Feed';

import { MovieDetails } from './pages/MovieDetails';
import { Chat } from './pages/Chat';

import { Profile } from './pages/Profile';

import { Store } from './pages/Store';
import { Movies } from './pages/Movies';
import { Notifications } from './pages/Notifications';
import { Login } from './pages/Login';
import { PostDetail } from './pages/PostDetail';
import { Watchlist } from './pages/Watchlist';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/store" element={<Store />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
