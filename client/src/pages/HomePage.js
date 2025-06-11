// client/src/pages/HomePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Library from "../components/Library";
import Modal from "../components/Modal";
import styles from "./HomePage.module.css";
import { getAllBooks, deleteBook, updateBookStatus } from "../api/bookAPI";
import { getWorkDetails } from "../api/openLibraryAPI";

const HomePage = () => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [desc, setDesc] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    getAllBooks()
      .then((data) => setLibrary(data))
      .catch((err) => setError(err.message || "Błąd"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (q) => navigate(`/search?q=${encodeURIComponent(q)}`);

  const toggleStatus = (b) =>
    updateBookStatus(b._id, b.status === "to-read" ? "read" : "to-read")
      .then((u) => setLibrary((l) => l.map((x) => (x._id === u._id ? u : x))))
      .catch((err) => alert(err.message));

  const remove = (id) =>
    deleteBook(id)
      .then(() => setLibrary((l) => l.filter((x) => x._id !== id)))
      .catch((err) => alert(err.message));

  const showDetails = async (b) => {
    setSelected(b);
    setModalLoading(true);
    try {
      const workKey = b.openLibraryId.split("/").pop();
      const data = await getWorkDetails(workKey);
      let d = data.description || data.bio || "";
      if (typeof d === "object") d = d.value;
      setDesc(d);
    } catch {
      setDesc("Brak opisu.");
    } finally {
      setModalLoading(false);
    }
  };

  const filteredLibrary = library.filter((book) => {
    if (filter === "all") return true;
    return book.status === filter;
  });

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Ładowanie biblioteki…</p>}
      {error && <p className={styles.error}>Błąd: {error}</p>}
      <div className={styles.filter}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.active : ""}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setFilter("read")}
          className={filter === "read" ? styles.active : ""}
        >
          Przeczytane
        </button>
        <button
          onClick={() => setFilter("to-read")}
          className={filter === "to-read" ? styles.active : ""}
        >
          Do przeczytania
        </button>
      </div>
      {!loading && !error && (
        <Library
          library={filteredLibrary}
          onToggleStatus={toggleStatus}
          onRemove={(id, title) => {
            if (!window.confirm(`Usuń \"${title}\"?`)) return;
            remove(id);
          }}
          onShowDetails={showDetails}
        />
      )}

      {selected && (
        <Modal
          onClose={() => setSelected(null)}
          title={selected.title}
          coverUrl={
            selected.coverId
              ? `https://covers.openlibrary.org/b/id/${selected.coverId}-L.jpg`
              : null
          }
          description={modalLoading ? "Ładowanie opisu…" : desc}
        />
      )}
    </div>
  );
};

export default HomePage;