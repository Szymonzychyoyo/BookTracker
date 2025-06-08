// client/src/pages/SettingsPage.js
import React, { useState } from 'react';
import { updateProfile, deleteAccount } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    // walidacja po stronie klienta
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setError('Aby zmienić hasło, wypełnij wszystkie pola.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Nowe hasło i potwierdzenie nie są zgodne.');
        return;
      }
    }

    try {
      const res = await updateProfile({ username, oldPassword, newPassword, confirmPassword });
      // zaktualizuj kontekst
      login({
        token: res.token,
        _id: res._id,
        username: res.username,
        email: res.email,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMsg(res.message);
    } catch (err) {
      console.error('⚠️ updateProfile error:', err.response || err);
      const serverMsg = err.response?.data?.message || err.message || 'Błąd serwera';
      setError(serverMsg);
    }
  };

  const handleDelete = async () => {
    setMsg('');
    setError('');
    if (!window.confirm('Czy na pewno chcesz usunąć swoje konto?')) return;
    try {
      const res = await deleteAccount();
      console.log('deleteAccount res:', res);
      logout();
      navigate('/register');
    } catch (err) {
      console.error('⚠️ deleteAccount error:', err.response || err);
      const serverMsg = err.response?.data?.message || err.message || 'Błąd serwera';
      setError(serverMsg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Ustawienia konta</h2>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Login:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <fieldset style={{ marginTop: '1rem' }}>
          <legend>Zmiana hasła</legend>
          <div>
            <label>Stare hasło:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Nowe hasło:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Potwierdź nowe hasło:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </fieldset>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Zapisz zmiany
        </button>
      </form>
      <hr style={{ margin: '2rem 0' }} />
      <button
        onClick={handleDelete}
        style={{ background: 'red', color: 'white' }}
      >
        Usuń konto
      </button>
    </div>
  );
};

export default SettingsPage;
