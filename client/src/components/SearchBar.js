import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

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
      />
      <button className={styles.searchButton} type="submit">
        Szukaj
      </button>
    </form>
  );
};

export default SearchBar;
