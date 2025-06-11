import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UserMenu.module.css';

const UserMenu = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button className={styles.button} onClick={() => setOpen(o => !o)}>
        Menu ▼
      </button>
      {open && (
        <div className={styles.menu}>
          <Link to="/settings" className={styles.item} onClick={() => setOpen(false)}>
            Ustawienia
          </Link>
          <Link to="/tierlist" className={styles.item} onClick={() => setOpen(false)}>
            Tier lista
          </Link>
          <button className={styles.item} onClick={logout}>Wyloguj</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;