import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./TierListPage.module.css";
import { getAllBooks } from "../api/bookAPI";
import { createTierList, updateTierList, getTierList } from "../api/tierListAPI";

const labels = ["S", "A", "B", "C", "D", "F"];

const TierListPage = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [listId, setListId] = useState(null);
  const [books, setBooks] = useState([]);
  const [tiers, setTiers] = useState(
    labels.map((l) => ({ label: l, books: [] }))
  );

  // load all books and, if editing, load existing tier list
  useEffect(() => {
    async function fetchData() {
      try {
        const bookList = await getAllBooks();
        setBooks(bookList);

        if (id) {
          const saved = await getTierList(id);
          setListId(saved._id);
          setName(saved.name);
          setTiers(saved.tiers);
        }
      } catch (err) {
        setError("Błąd ładowania danych");
      }
    }
    fetchData();
  }, [id]);

  const handlePageDragOver = (e) => {
    const margin = 40;
    if (e.clientY < margin) {
      window.scrollBy(0, -10);
    } else if (window.innerHeight - e.clientY < margin) {
      window.scrollBy(0, 10);
    }
    e.preventDefault();
  };

  const handleDrop = (book, label) => {
    setTiers((ts) =>
      ts.map((t) =>
        t.label === label
          ? { ...t, books: [...t.books, book] }
          : { ...t, books: t.books.filter((b) => b._id !== book._id) }
      )
    );
  };

  const handleCreate = async () => {
    try {
      const newList = await createTierList({ name: name.trim(), tiers });
      setListId(newList._id);
      setError("");
    } catch (err) {
      setError("Błąd tworzenia listy");
    }
  };

  const save = async () => {
    try {
      await updateTierList(listId, { name: name.trim(), tiers });
      setError("");
    } catch (err) {
      setError("Błąd zapisu");
    }
  };

  return (
    <div>
      <Link to="/tierlists" className={styles.backButton}>
        Powrót
      </Link>
      <div className={styles.container}>
        <h2>{listId ? "Edytuj Tier Listę" : "Nowa Tier Lista"}</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              setError("Podaj nazwę listy");
              return;
            }
            if (listId) save();
            else handleCreate();
          }}
          className={styles.form}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nazwa listy"
            className={styles.fullWidth}
            required
          />
          <button type="submit" className={styles.button}>
            {listId ? "Zapisz listę" : "Utwórz"}
          </button>
        </form>
      </div>
      {listId && (
        <>
          <div onDragOver={handlePageDragOver}>
            {tiers.map((t) => (
              <div key={t.label} className={styles.row}>
                <span className={styles.label}>{t.label}</span>
                <div
                  className={styles.dropZone}
                  onDragOver={handlePageDragOver}
                  onDrop={(e) => {
                    const bid = e.dataTransfer.getData("id");
                    const book = books.find((b) => b._id === bid);
                    if (book) handleDrop(book, t.label);
                  }}
                >
                  {t.books.map((b) => (
                    <div key={b._id} className={styles.book}>
                      <img
                        src={
                          b.coverId
                            ? `https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`
                            : "/brakOkladki/brakOkladki.png"
                        }
                        alt={b.title}
                      />
                      <span>{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <hr />
          <div onDragOver={handlePageDragOver}>
            <h3>Przeciągnij książki</h3>
            <div className={styles.bookList}>
              {books.map((b) => (
                <div
                  key={b._id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("id", b._id)}
                  className={styles.bookItem}
                >
                  <img
                    src={
                      b.coverId
                        ? `https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`
                        : "/brakOkladki/brakOkladki.png"
                    }
                    alt={b.title}
                  />
                  <span>{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TierListPage;
