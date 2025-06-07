// client/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Library from './components/Library';
import { searchBooksOpenLibrary } from './api/openLibraryAPI';
import { addBook, deleteBook } from './api/bookAPI';

function App() {
  const [results, setResults] = useState([]);
  const [library, setLibrary] = useState([]);      // stan Twojej biblioteki
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pobierz bibliotekę przy starcie, aby wiedzieć które książki są już dodane
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setLibrary(data);
      } catch (err) {
        console.error('Nie udało się załadować biblioteki', err);
      }
    })();
  }, []);

  // Szukanie w Open Library
  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    try {
      const data = await searchBooksOpenLibrary(query);
      setResults(data);
    } catch {
      setError('Nie udało się pobrać wyników.');
    } finally {
      setLoading(false);
    }
  };

  // Dodawanie do biblioteki
  const handleAdd = async (bookData) => {
    try {
      const added = await addBook(bookData);
      setLibrary((prev) => [...prev, added]);
      alert(`Dodano: ${added.title} jako ${added.status === 'read' ? 'przeczytaną' : 'do przeczytania'}.`);
    } catch {
      alert('Błąd podczas dodawania książki.');
    }
  };

  // Usuwanie z biblioteki (również z backendu)
  const handleRemove = async (openLibraryId) => {
    // znajdź dokument w bibliotece
    const book = library.find((b) => b.openLibraryId === openLibraryId);
    if (!book) return;
    if (!window.confirm(`Usunąć "${book.title}" z biblioteki?`)) return;
    try {
      await deleteBook(book._id);
      setLibrary((prev) => prev.filter((b) => b._id !== book._id));
      alert(`Usunięto: ${book.title}`);
    } catch {
      alert('Błąd podczas usuwania książki.');
    }
  };

  return (
    <div className="App">
      <h1>Moja Biblioteka</h1>

      <SearchBar onSearch={handleSearch} />

      <SearchResults
        results={results}
        library={library}
        onAddToRead={(book) => handleAdd({ ...book, status: 'to-read' })}
        onAddRead={(book) => handleAdd({ ...book, status: 'read' })}
        onRemove={handleRemove}
        loading={loading}
        error={error}
      />

      <Library />
    </div>
  );
}

export default App;
