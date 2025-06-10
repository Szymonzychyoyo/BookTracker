// client/src/components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser(form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Rejestracja nieudana');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Rejestracja</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login:</label>
          <input name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Hasło:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
      <p>
        Masz konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
};

export default Register;