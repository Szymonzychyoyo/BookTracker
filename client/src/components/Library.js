// client/src/components/Library.js
import React, { useEffect, useState } from 'react';
import {
  getAllBooks,
  updateBookStatus,
  deleteBook
} from '../api/bookAPI';
import styles from './Library.module.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert('Nie udało się pobrać książek z bazy.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (book) => {
    const newStatus = book.status === 'to-read' ? 'read' : 'to-read';
    try {
      const updated = await updateBookStatus(book._id, newStatus);
      setBooks(prev => prev.map(b => (b._id === updated._id ? updated : b)));
    } catch {
      alert('Błąd przy zmianie statusu.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno usunąć tę książkę?')) return;
    try {
      await deleteBook(id);
      setBooks(prev => prev.filter(b => b._id !== id));
    } catch {
      alert('Błąd przy usuwaniu książki.');
    }
  };

  if (loading) {
    return <p>Ładuję Twoją bibliotekę…</p>;
  }

  if (books.length === 0) {
    return <p>Twoja biblioteka jest pusta.</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Moja Biblioteka</h2>
      {books.map(book => (
        <div key={book._id} className={styles.item}>
          <img
            src={
              book.coverId
                ? `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`
                : 'https://via.placeholder.com/60x90?text=?'
            }
            alt={book.title}
            className={styles.coverSmall}
          />
          <div className={styles.info}>
            <span className={styles.title}>{book.title}</span><br/>
            <small>{book.author}</small>
            <div className={styles.status}>
              Status: {book.status === 'to-read' ? 'Do przeczytania' : 'Przeczytana'}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => handleStatusToggle(book)}
            >
              {book.status === 'to-read'
                ? 'Oznacz jako przeczytaną'
                : 'Oznacz jako do przeczytania'}
            </button>
            <button
              className={styles.button}
              onClick={() => handleDelete(book._id)}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; // <- tu zamykamy funkcję Library

export default Library;
