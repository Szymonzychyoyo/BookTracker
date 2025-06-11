import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { getAllBooks } from '../api/bookAPI';
import { createTierList, updateTierList } from '../api/tierListAPI';

const labels = ['S', 'A', 'B', 'C', 'D', 'F'];

const TierListPage = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [listId, setListId] = useState(null);
  const [books, setBooks] = useState([]);
  const [tiers, setTiers] = useState(() => labels.map(l => ({ label: l, books: [] })));

  useEffect(() => {
    getAllBooks()
      .then(data => setBooks(data.filter(b => b.status === 'read')))
      .catch(() => setError('Błąd pobierania książek'));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Podaj nazwę listy');
      return;
    }
    try {
      const res = await createTierList(name.trim());
      setListId(res._id);
    } catch (err) {
      setError('Błąd tworzenia listy');
    }
  };

  const handleDrop = (book, label) => {
    setTiers(ts => ts.map(t =>
      t.label === label ? { ...t, books: [...t.books, book] } : { ...t, books: t.books.filter(b => b._id !== book._id) }
    ));
  };

  const save = async () => {
    if (!listId) return;
    try {
      await updateTierList(listId, tiers.map(t => ({ label: t.label, books: t.books.map(b => b._id) })));
      alert('Zapisano tier listę');
    } catch {
      setError('Błąd zapisu');
    }
  };

  return (
    <div>
      <h2>Nowa Tier Lista</h2>
      {error && <p className={styles.error}>{error}</p>}
      {!listId ? (
        <form onSubmit={handleCreate} className={styles.field}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nazwa listy"
            className={styles.fullWidth}
            required
          />
          <button type="submit" className={styles.button}>Utwórz</button>
        </form>
      ) : (
        <>
          <div className={styles.field}>
            <button onClick={save} className={styles.button}>Zapisz listę</button>
          </div>
          <div>
            {tiers.map(t => (
              <div key={t.label} style={{ marginBottom: '1rem' }}>
                <strong>{t.label}</strong>
                <div
                  style={{ minHeight: '50px', border: '1px dashed #ccc', padding: '4px' }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    const id = e.dataTransfer.getData('id');
                    const book = books.find(b => b._id === id);
                    if (book) handleDrop(book, t.label);
                  }}
                >
                  {t.books.map(b => (
                    <span key={b._id} style={{ marginRight: '4px' }}>{b.title}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div>
            <h3>Przeciągnij książki</h3>
            {books.map(b => (
              <div
                key={b._id}
                draggable
                onDragStart={e => e.dataTransfer.setData('id', b._id)}
                style={{ cursor: 'grab' }}
              >
                {b.title}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TierListPage;