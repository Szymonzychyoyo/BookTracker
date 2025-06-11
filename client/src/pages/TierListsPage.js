// TierListsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTierLists } from "../api/tierListAPI";
import styles from "./TierListsPage.module.css";

const TierListsPage = () => {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getTierLists()
      .then(setLists)
      .catch(() => setError("Błąd pobierania list"));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Twoje TierListy</h2>

      {error && <p className={styles.error}>{error}</p>}
      {!error && lists.length === 0 && <p>Brak list.</p>}

      <ul className={styles.list}>
        {lists.map((l) => (
          <li key={l._id} className={styles.listItem}>
            <strong>{l.name}</strong>
            <ul className={styles.tierList}>
              {l.tiers.map((t) => (
                <li key={t.label} className={styles.tierItem}>
                  <span className={styles.tierLabel}>{t.label}:</span>
                  <div className={styles.bookList}>
                    {t.books.map((b) => (
                      <div key={b._id} className={styles.bookItem}>
                        <img
                          src={
                            b.coverId
                              ? `https://covers.openlibrary.org/b/id/${b.coverId}-S.jpg`
                              : "/brakOkladki/brakOkladki.png"
                          }
                          alt={b.title}
                          className={styles.bookCover}
                        />
                        <span>{b.title}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <Link to="/tierlist" className={styles.button}>
        Nowa tier lista
      </Link>
    </div>
  );
};

export default TierListsPage;
