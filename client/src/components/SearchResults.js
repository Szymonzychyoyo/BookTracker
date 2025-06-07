// client/src/components/SearchResults.js
import React from 'react';
import BookItem from './BookItem';

/**
 * Przyjmuje:
 * - results: tablica obiektów z Open Library,
 * - onAddToRead: callback do wywołania w BookItem,
 * - onAddRead: callback do wywołania w BookItem,
 * - loading: czy trwa ładowanie wyników,
 * - error: ewentualny komunikat błędu,
 */
const SearchResults = ({ results, onAddToRead, onAddRead, loading, error }) => {
  if (loading) {
    return <p>Ładowanie wyników...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  }
  if (!Array.isArray(results) || results.length === 0) {
    return <p>Brak wyników wyszukiwania.</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {results.map((book) => (
        <BookItem
          key={book.key} // np. "/works/OL82548W"
          bookData={book}
          onAddToRead={onAddToRead}
          onAddRead={onAddRead}
        />
      ))}
    </div>
  );
};

export default SearchResults;
