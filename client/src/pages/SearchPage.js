// client/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Modal from '../components/Modal';
import { searchBooksOpenLibrary, getWorkDetails } from '../api/openLibraryAPI';
import { getAllBooks, addBook, deleteBook, updateBookStatus } from '../api/bookAPI';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(results.length / perPage);
  const visible = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  // modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // load library
  useEffect(() => {
    getAllBooks()
      .then(setLibrary)
      .catch(console.error);
  }, []);

  // search
  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError('');
    setCurrentPage(1);
    searchBooksOpenLibrary(q)
      .then(setResults)
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = query => setSearchParams({ q: query });
  const handleAdd = b => addBook(b).then(a => setLibrary(l => [...l, a])).catch(err => alert(err.message));
  const handleToggleStatus = b =>
    updateBookStatus(b._id, b.status === 'to-read' ? 'read' : 'to-read')
      .then(u => setLibrary(l => l.map(x => x._id === u._id ? u : x)))
      .catch(err => alert(err.message));

  const handleRemove = openLibraryId => {
    const entry = library.find(x => x.openLibraryId === openLibraryId);
    if (!entry) return alert('Nie znaleziono w bibliotece');
    if (!window.confirm(`Usuń "${entry.title}"?`)) return;
    deleteBook(entry._id)
      .then(() => setLibrary(l => l.filter(x => x._id !== entry._id)))
      .catch(err => alert(err.message));
  };

  const handleShowDetails = async b => {
    setSelectedBook(b);
    setModalLoading(true);
    try {
      const workKey = b.key.split('/').pop();
      const data = await getWorkDetails(workKey);
      let desc = data.description || data.bio || '';
      if (typeof desc === 'object') desc = desc.value;
      setDescription(desc);
    } catch {
      setDescription('Brak opisu.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} initialValue={q} />

      {loading && <p>Ładowanie wyników…</p>}
      {error && <p style={{ color: 'red' }}>Błąd: {error}</p>}

      {!loading && !error && (
        <>
          <SearchResults
            results={visible}
            library={library}
            onAddToRead={b => handleAdd({ ...b, status: 'to-read' })}
            onAddRead={b => handleAdd({ ...b, status: 'read' })}
            onRemove={handleRemove}
            onShowDetails={handleShowDetails}
          />

          {totalPages > 1 && (
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i+1}
                  disabled={currentPage === i+1}
                  onClick={() => setCurrentPage(i+1)}
                  style={{ margin: '0 4px', fontWeight: currentPage===i+1 ? 'bold': 'normal' }}
                >
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedBook && (
        <Modal
          onClose={() => setSelectedBook(null)}
          title={selectedBook.title}
          coverUrl={selectedBook.cover_i
            ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
            : null}
          description={modalLoading ? 'Ładowanie opisu…' : description}
        />
      )}
    </div>
  );
};

export default SearchPage;
