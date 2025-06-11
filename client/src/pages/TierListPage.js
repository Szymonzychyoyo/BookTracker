import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const [tiers, setTiers] = useState(() =>
    labels.map((l) => ({ label: l, books: [] }))
  );

  const handlePageDragOver = (e) => {
    const margin = 40;
    if (e.clientY < margin) {
      window.scrollBy(0, -10);
    } else if (window.innerHeight - e.clientY < margin) {
      window.scrollBy(0, 10);
    }
    e.preventDefault();
  };

  useEffect(() => {
    getAllBooks()
      .then((data) => setBooks(data.filter((b) => b.status === "read")))
      .catch(() => setError("Błąd pobierania książek"));
  }, []);

  useEffect(() => {
    if (id) {
      setListId(id);
      getTierList(id)
        .then((data) => {
          setName(data.name);
          setTiers(data.tiers);
        })
        .catch(() => setError("Błąd pobierania listy"));
    }
  }, [id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Podaj nazwę listy");
      return;
    }
    try {
      const res = await createTierList(name.trim());
      setListId(res._id);
    } catch (err) {
      setError("Błąd tworzenia listy");
    }
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
      <h2>{listId ? "Edytuj Tier Listę" : "Nowa Tier Lista"}</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) {
            setError("Podaj nazwę listy");
            return;
          }
          if (listId) {
            save();
          } else {
            handleCreate(e);
          }
        }}
        className={styles.field}
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
                    const id = e.dataTransfer.getData("id");
                    const book = books.find((b) => b._id === id);
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
