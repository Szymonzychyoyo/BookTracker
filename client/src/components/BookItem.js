// client/src/components/BookItem.js
import React from 'react';

/**
 * Reprezentuje pojedynczy element książki:
 * - Okładka (jeśli jest),
 * - Tytuł,
 * - Autor,
 * - Dwa przyciski:
 *    • Dodaj jako do przeczytania
 *    • Dodaj jako przeczytana
 */
const BookItem = ({ bookData, onAddToRead, onAddRead }) => {
  // Oczekujemy, że bookData zawiera:
  // title, author_name (tablica), cover_i, author_key, key (np. "/works/OL82548W")
  const title = bookData.title;
  const author = Array.isArray(bookData.author_name) ? bookData.author_name[0] : 'Brak autora';
  const coverId = bookData.cover_i;
  const openLibraryId = bookData.key; // np. "/works/OL82548W"
  const authorKeyList = bookData.author_key || [];

  // Budujemy URL do okładki: jeśli coverId = 10523466, to
  // https://covers.openlibrary.org/b/id/10523466-M.jpg
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/100x150?text=Brak+okładki';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        padding: '0.5rem',
        borderRadius: '4px',
      }}
    >
      <img
        src={coverUrl}
        alt={`Okładka ${title}`}
        style={{ width: '80px', height: '120px', objectFit: 'cover', marginRight: '1rem' }}
      />
      <div style={{ flex: '1' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <p style={{ margin: 0 }}>Autor: {author}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button
          onClick={() =>
            onAddToRead({
              title,
              author,
              openLibraryId,
              coverId,
              authorKey: authorKeyList,
              status: 'to-read',
            })
          }
          style={{ padding: '0.5rem 1rem' }}
        >
          Dodaj jako do przeczytania
        </button>
        <button
          onClick={() =>
            onAddRead({
              title,
              author,
              openLibraryId,
              coverId,
              authorKey: authorKeyList,
              status: 'read',
            })
          }
          style={{ padding: '0.5rem 1rem' }}
        >
          Dodaj jako przeczytana
        </button>
      </div>
    </div>
  );
};

export default BookItem;
