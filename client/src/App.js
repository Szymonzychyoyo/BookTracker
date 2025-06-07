// client/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Library from "./components/Library";
import { searchBooksOpenLibrary } from "./api/openLibraryAPI";
import { addBook, getAllBooks, deleteBook } from "./api/bookAPI";

const HomePage = ({ library, onAdd, onRemove, onToggleStatus }) => {
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Library
        library={library}
        onRemove={onRemove}
        onToggleStatus={onToggleStatus}
      />
    </div>
  );
};

const SearchPage = ({ library, onAdd, onRemove }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError("");
    searchBooksOpenLibrary(q)
      .then((data) => setResults(data))
      .catch(() => setError("Nie udało się pobrać wyników."))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = (query) => {
    setSearchParams({ q: query });
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} initialValue={q} />
      <SearchResults
        results={results}
        library={library}
        onAddToRead={(book) => onAdd({ ...book, status: "to-read" })}
        onAddRead={(book) => onAdd({ ...book, status: "read" })}
        onRemove={onRemove}
        loading={loading}
        error={error}
      />
    </div>
  );
};

function App() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    getAllBooks()
      .then((data) => setLibrary(data))
      .catch(() => console.error("Nie udało się załadować biblioteki"));
  }, []);

  const handleAdd = async (bookData) => {
    try {
      const added = await addBook(bookData);
      setLibrary((prev) => [...prev, added]);
      alert(
        `Dodano: ${added.title} jako ${
          added.status === "read" ? "przeczytaną" : "do przeczytania"
        }.`
      );
    } catch {
      alert("Błąd podczas dodawania książki.");
    }
  };

  const handleRemove = async (openLibraryId) => {
    const book = library.find((b) => b.openLibraryId === openLibraryId);
    if (!book) return;
    if (!window.confirm(`Usunąć "${book.title}" z biblioteki?`)) return;
    try {
      await deleteBook(book._id);
      setLibrary((prev) => prev.filter((b) => b._id !== book._id));
      alert(`Usunięto: ${book.title}`);
    } catch {
      alert("Błąd podczas usuwania książki.");
    }
  };

  const handleToggleStatus = () => {
    // implementacja ewentualnej zmiany statusu
  };

  return (
    <BrowserRouter>
      <div className="App">
        <h1>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Moja Biblioteka
          </Link>
        </h1>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                library={library}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onToggleStatus={handleToggleStatus}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchPage
                library={library}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
