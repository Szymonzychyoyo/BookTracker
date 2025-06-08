// client/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import { searchBooksOpenLibrary } from '../api/openLibraryAPI';
import { getAllBooks, addBook, deleteBook } from '../api/bookAPI';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  // Ładuj bibliotekę, by wiedzieć co już dodane
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllBooks();
        setLibrary(data);
      } catch (err) {
        console.error('Nie udało się załadować biblioteki', err);
      }
    })();
  }, []);

  // Wyszukiwanie przy zmianie `q`
  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError('');
    searchBooksOpenLibrary(q)
      .then((data) => setResults(data))
      .catch(() => setError('Nie udało się pobrać wyników.'))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (query) => {
    setSearchParams({ q: query });
  };

  const handleAdd = async (bookData) => {
    try {
      const added = await addBook(bookData);
      setLibrary((prev) => [...prev, added]);
      alert(`Dodano: ${added.title} jako ${added.status === 'read' ? 'przeczytaną' : 'do przeczytania'}.`);
    } catch {
      alert('Błąd podczas dodawania książki.');
    }
  };

  const handleRemove = async (openLibraryId) => {
    const book = library.find((b) => b.openLibraryId === openLibraryId);
    if (!book) return;
    if (!window.confirm(`Usunąć „${book.title}” z biblioteki?`)) return;

    try {
      await deleteBook(book._id);
      setLibrary((prev) => prev.filter((b) => b._id !== book._id));
      alert(`Usunięto: ${book.title}`);
    } catch {
      alert('Błąd podczas usuwania książki.');
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} initialValue={q} />
      <SearchResults
        results={results}
        library={library}
        onAddToRead={(book) => handleAdd({ ...book, status: 'to-read' })}
        onAddRead={(book) => handleAdd({ ...book, status: 'read' })}
        onRemove={handleRemove}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default SearchPage;
