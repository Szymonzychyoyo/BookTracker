// client/src/components/Library.js
import React, { useEffect, useState } from 'react';
import { getAllBooks, updateBookStatus, deleteBook } from '../api/bookAPI';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pobieramy listę przy montowaniu
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
      // Podmieniamy w liście
      setBooks((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
    } catch {
      alert('Błąd przy zmianie statusu.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno usunąć tę książkę?')) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch {
      alert('Błąd przy usuwaniu książki.');
    }
  };

  if (loading) return <p>Ładuję Twoją bibliotekę…</p>;
  if (books.length === 0) return <p>Twoja biblioteka jest pusta.</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Moja Biblioteka</h2>
      {books.map((book) => (
        <div
          key={book._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            padding: '0.5rem',
            borderRadius: '4px',
            marginBottom: '0.5rem',
          }}
        >
          <img
            src={
              book.coverId
                ? `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`
                : 'https://via.placeholder.com/60x90?text=?'
            }
            alt={book.title}
            style={{ marginRight: '1rem' }}
          />
          <div style={{ flex: 1 }}>
            <strong>{book.title}</strong> <br />
            <small>{book.author}</small>
            <div>
              Status: <em>{book.status === 'to-read' ? 'Do przeczytania' : 'Przeczytana'}</em>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <button onClick={() => handleStatusToggle(book)} style={{ padding: '0.25rem 0.5rem' }}>
              {book.status === 'to-read' ? 'Oznacz jako przeczytaną' : 'Oznacz jako do przeczytania'}
            </button>
            <button onClick={() => handleDelete(book._id)} style={{ padding: '0.25rem 0.5rem' }}>
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;
