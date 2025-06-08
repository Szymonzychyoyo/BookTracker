import React from 'react';
import styles from './Library.module.css';

const Library = ({ library, onRemove, onToggleStatus }) => {
  if (!Array.isArray(library) || library.length === 0) {
    return <p>Twoja biblioteka jest pusta.</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Moja Biblioteka</h2>
      {library.map((book) => (
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
            <span className={styles.title}>{book.title}</span>
            <br />
            <small>{book.author}</small>
            <div className={styles.status}>
              Status:{' '}
              {book.status === 'to-read' ? 'Do przeczytania' : 'Przeczytana'}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => onToggleStatus(book)}
            >
              {book.status === 'to-read'
                ? 'Oznacz jako przeczytaną'
                : 'Oznacz jako do przeczytania'}
            </button>
            <button
              className={styles.button}
              onClick={() => onRemove(book._id, book.title)}
            >
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;
