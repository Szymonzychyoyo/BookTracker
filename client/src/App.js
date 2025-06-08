// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

const Header = () => {
  const { user, logout } = useAuth();
  return (
    <header className="App-header">
      <Link to="/" className="App-title">Moja Biblioteka</Link>
      {user ? (
        <button onClick={logout} style={{ marginLeft: 'auto' }}>Wyloguj</button>
      ) : (
        <Link to="/login" style={{ marginLeft: 'auto' }}>Logowanie</Link>
      )}
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
