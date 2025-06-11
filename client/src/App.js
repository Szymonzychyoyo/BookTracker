// client/src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import AuthorPage from "./pages/AuthorPage";       // ← import AuthorPage
import SettingsPage from "./pages/SettingsPage";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";
import headerStyles from "./components/Header.module.css";
import UserMenu from "./components/UserMenu";

const Header = () => {
  const { user } = useAuth();
  return (
    <header className={headerStyles.header}>
      {user && (
        <div className={headerStyles.userInfo}>
          {user.profileImage && (
            <img
              src={`http://localhost:5001${user.profileImage}`}
              alt="Avatar"
              className={headerStyles.avatar}
            />
          )}
          <span className={headerStyles.username}>{user.username}</span>
        </div>
      )}

      <Link to="/" className={headerStyles.title}>
        Moja Biblioteka
      </Link>

      <nav className={headerStyles.nav}>
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/login" className={headerStyles.tile}>Logowanie</Link>
            <Link to="/register" className={headerStyles.tile}>Rejestracja</Link>
          </>
        )}
      </nav>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Podstrona wyszukiwania */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          {/* Podstrona autora */}
          <Route
            path="/author/:authorKey"
            element={
              <ProtectedRoute>
                <AuthorPage />
              </ProtectedRoute>
            }
          />

          {/* Ustawienia */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
