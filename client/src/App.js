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

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className={headerStyles.header}>
      <Link to="/" className={headerStyles.title}>
        Moja Biblioteka
      </Link>

      <nav className={headerStyles.nav}>
        {user ? (
          <>
            {user.profileImage && (
              <img
                src={`http://localhost:5001${user.profileImage}`}
                alt="Avatar"
                className={headerStyles.avatar}
              />
            )}
            {/* Tu wyświetlamy login obok avatara */}
            <span className={headerStyles.username}>{user.username}</span>

            <Link to="/settings">Ustawienia</Link>
            <button onClick={logout}>Wyloguj</button>
          </>
        ) : (
          <>
            <Link to="/login">Logowanie</Link>
            <Link to="/register">Rejestracja</Link>
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
