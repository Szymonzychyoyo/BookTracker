import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTierLists } from '../api/tierListAPI';
import styles from './HomePage.module.css';

const TierListsPage = () => {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTierLists()
      .then(setLists)
      .catch(() => setError('B\u0142\u0105d pobierania list'));
  }, []);

  return (
    <div>
      <h2>Twoje TierListy</h2>
      {error && <p className={styles.error}>{error}</p>}
      {!error && lists.length === 0 && <p>Brak list.</p>}
      <ul>
        {lists.map((l) => (
          <li key={l._id} style={{ marginBottom: '1rem' }}>
            <strong>{l.name}</strong>
            <ul>
              {l.tiers.map((t) => (
                <li key={t.label}>
                  {t.label}: {t.books.map((b) => b.title).join(', ')}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Link to="/tierlist" className={styles.button}>Nowa tier lista</Link>
    </div>
  );
};

export default TierListsPage;