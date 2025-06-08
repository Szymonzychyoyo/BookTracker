import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Library from '../components/Library';
import { getAllBooks, deleteBook, updateBookStatus } from '../api/bookAPI';

const HomePage = () => {
  const [library, setLibrary] = useState([]);
  const navigate = useNavigate();

  // 1) ładujemy bibliotekę przy montowaniu
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllBooks();
        setLibrary(data);
      } catch (err) {
        console.error('Nie udało się załadować biblioteki', err);
        alert('Błąd ładowania biblioteki');
      }
    })();
  }, []);

  // 2) przejście na stronę wyszukiwania
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // 3) zmiana statusu książki
  const handleToggleStatus = async (book) => {
    const newStatus = book.status === 'to-read' ? 'read' : 'to-read';
    try {
      const updated = await updateBookStatus(book._id, newStatus);
      setLibrary((prev) =>
        prev.map((b) => (b._id === updated._id ? updated : b))
      );
    } catch (err) {
      console.error('Błąd przy zmianie statusu:', err.response || err);
      const msg = err.response?.data?.message || err.message;
      alert(`Błąd przy zmianie statusu: ${msg}`);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  // 4) usuwanie książki
  const handleRemove = async (id, title) => {
    if (!window.confirm(`Usunąć „${title}” z biblioteki?`)) return;
    try {
      await deleteBook(id);
      setLibrary((prev) => prev.filter((b) => b._id !== id));
      alert(`Usunięto: ${title}`);
    } catch (err) {
      console.error('Błąd podczas usuwania książki:', err.response || err);
      const msg = err.response?.data?.message || err.message;
      alert(`Błąd podczas usuwania książki: ${msg}`);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Library
        library={library}
        onRemove={handleRemove}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default HomePage;
