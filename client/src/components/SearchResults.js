import React from 'react';
import BookItem from './BookItem';
import styles from './SearchResults.module.css';

const SearchResults = ({ results, onAddToRead, onAddRead, loading, error }) => {
  if (loading) return <p className={styles.message}>Ładowanie wyników...</p>;
  if (error) return <p className={styles.error}>Błąd: {error}</p>;
  if (!Array.isArray(results) || results.length === 0)
    return <p className={styles.message}>Brak wyników wyszukiwania.</p>;

  return (
    <div className={styles.results}>
      {results.map(book => (
        <BookItem
          key={book.key}
          bookData={book}
          onAddToRead={onAddToRead}
          onAddRead={onAddRead}
        />
      ))}
    </div>
  );
};

export default SearchResults;
