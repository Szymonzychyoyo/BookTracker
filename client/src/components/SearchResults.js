// client/src/components/SearchResults.js
import React from 'react';
import BookItem from './BookItem';
import styles from './SearchResults.module.css';

const SearchResults = ({
  results,
  library,
  onAddToRead,
  onAddRead,
  onRemove,
  loading,
  error
}) => {
  if (loading) return <p className={styles.message}>Ładowanie wyników...</p>;
  if (error)   return <p className={styles.error}>Błąd: {error}</p>;
  if (!Array.isArray(results) || results.length === 0)
    return <p className={styles.message}>Brak wyników wyszukiwania.</p>;

  return (
    <div className={styles.results}>
      {results.map(book => {
        const isAdded = library.some(b => b.openLibraryId === book.key);
        return (
          <BookItem
            key={book.key}
            bookData={book}
            isAdded={isAdded}
            onAddToRead={onAddToRead}
            onAddRead={onAddRead}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
};

export default SearchResults;
