// client/src/pages/SearchPage.js
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import Modal from "../components/Modal";
import styles from "./SearchPage.module.css";
import { searchBooksOpenLibrary, getWorkDetails } from "../api/openLibraryAPI";
import {
  getAllBooks,
  addBook,
  deleteBook,
  updateBookStatus,
} from "../api/bookAPI";

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const totalPages = Math.ceil(results.length / perPage);
  const visible = results.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [description, setDescription] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // load library
  useEffect(() => {
    getAllBooks()
      .then(setLibrary)
      .catch((err) => setError(err.message));
  }, []);

  // search and handle functions
  const handleSearch = async (query) => {
    setLoading(true);
    setError("");
    setCurrentPage(1);
    try {
      const data = await searchBooksOpenLibrary(query);
      setResults(data);
      setSearchParams({ q: query });
    } catch (err) {
      setError("Nie udało się pobrać wyników.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (doc) => {
    const payload = {
      title: doc.title,
      author: Array.isArray(doc.author_name)
        ? doc.author_name[0]
        : "Brak autora",
      openLibraryId: doc.key,
      coverId: doc.cover_i || null,
      authorKey: doc.author_key || [],
      status: doc.status || "to-read",
    };

    try {
      const added = await addBook(payload);
      setLibrary((l) => [...l, added]);
    } catch (err) {
      alert("Nie udało się dodać książki.");
    }
  };

  const handleRemove = async (entry) => {
    try {
      await deleteBook(entry._id);
      setLibrary((l) => l.filter((x) => x._id !== entry._id));
    } catch (err) {
      alert("Nie udało się usunąć książki.");
    }
  };

  const handleShowDetails = async (b) => {
    setSelectedBook(b);
    setModalLoading(true);
    try {
      const workKey = b.key.split("/").pop();
      const data = await getWorkDetails(workKey);
      let desc = data.description || data.bio || "";
      if (typeof desc === "object") desc = desc.value;
      setDescription(desc);
    } catch {
      setDescription("Brak opisu.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} initialValue={q} />

      {loading && <p>Ładowanie wyników…</p>}
      {error && <p className={styles.error}>Błąd: {error}</p>}

      {!loading && !error && (
        <>
          <SearchResults
            results={visible}
            library={library}
            onAddToRead={(b) => handleAdd({ ...b, status: "to-read" })}
            onAddRead={(b) => handleAdd({ ...b, status: "read" })}
            onRemove={handleRemove}
            onShowDetails={handleShowDetails}
          />

          {totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  disabled={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${styles.pageButton} ${
                    currentPage === i + 1 ? styles.active : ""
                  }`}
                >
                  {i + 1}
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
          coverUrl={
            selectedBook.cover_i
              ? `https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`
              : null
          }
          description={modalLoading ? "Ładowanie opisu…" : description}
        />
      )}
    </div>
  );
};

export default SearchPage;
