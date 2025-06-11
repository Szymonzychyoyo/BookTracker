// client/src/components/Login.js
import React, { useState } from 'react';
import { loginUser } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
const [form, setForm] = useState({ email: '', password: '' });
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
      const data = await loginUser(form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Logowanie nieudane');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Logowanie</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.fullWidth}
          />
        </div>
        <div className={styles.field}>
          <label>Hasło:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className={styles.fullWidth}
          />
        </div>
        <button type="submit" className={styles.submit}>Zaloguj się</button>
      </form>
      <p>
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
};

export default Login;