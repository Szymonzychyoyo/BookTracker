// client/src/App.js
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Library from './components/Library';         // ← dodaj import
import { searchBooksOpenLibrary } from './api/openLibraryAPI';
import { addBook } from './api/bookAPI';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obsługa kliknięcia przycisku „Szukaj”
  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const data = await searchBooksOpenLibrary(query);
      setResults(data);
    } catch (err) {
      setError('Nie udało się pobrać wyników.');
    } finally {
      setLoading(false);
    }
  };

  // Callback dla „Dodaj jako do przeczytania”
  const handleAddToRead = async (bookData) => {
    try {
      const added = await addBook(bookData);
      alert(`Dodano: ${added.title} jako do przeczytania.`);
      setResults((prev) => prev.filter((b) => b.key !== bookData.openLibraryId));
    } catch (err) {
      alert('Błąd podczas dodawania książki.');
    }
  };

  // Callback dla „Dodaj jako przeczytana”
  const handleAddRead = async (bookData) => {
    try {
      const added = await addBook(bookData);
      alert(`Dodano: ${added.title} jako przeczytaną.`);
      setResults((prev) => prev.filter((b) => b.key !== bookData.openLibraryId));
    } catch (err) {
      alert('Błąd podczas dodawania książki.');
    }
  };

  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Moja Biblioteka</h1>
      <SearchBar onSearch={handleSearch} />
      <SearchResults
        results={results}
        onAddToRead={handleAddToRead}
        onAddRead={handleAddRead}
        loading={loading}
        error={error}
      />
      {/* Sekcja pokazująca już dodane książki */}
      <Library />
    </div>
  );
}

export default App;
