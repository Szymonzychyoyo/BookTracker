import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        className={styles.searchInput}
        type="text"
        value={query}
        placeholder="Wpisz tytuł książki..."
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSubmit(e);
        }}
      />
      <button className={styles.searchButton} type="submit">
        Szukaj
      </button>
    </form>
  );
};

export default SearchBar;