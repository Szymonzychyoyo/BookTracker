// client/src/components/Library.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Library.module.css";

const Library = ({ library, onToggleStatus, onRemove, onShowDetails }) => {
  if (!library.length) return <p>Twoja biblioteka jest pusta.</p>;

  return (
    <div className={styles.container}>
      {library.map((book) => (
        <div key={book._id} className={styles.item}>
          <img
            src={
              book.coverId
                ? `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`
                : "/brakOkladki/brakOkladki.png"
            }
            alt={book.title}
            className={styles.coverSmall}
          />
          <div className={styles.info}>
            <strong>{book.title}</strong>
            <br />
            <small>
              Autor:{" "}
              {book.authorKey && book.authorKey.length > 0 ? (
                <Link
                  to={`/author/${book.authorKey[0]}`}
                  className={styles.authorLink}
                >
                  {book.author}
                </Link>
              ) : (
                book.author
              )}
            </small>
            <div className={styles.status}>
              Status:{" "}
              {book.status === "to-read" ? "Do przeczytania" : "Przeczytana"}
            </div>
          </div>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => onToggleStatus(book)}
            >
              {book.status === "to-read" ? "Przeczytana" : "Do przeczytania"}
            </button>
            <button
              className={styles.button}
              onClick={() => onRemove(book._id, book.title)}
            >
              Usuń
            </button>
            <button
              className={styles.button}
              onClick={() => onShowDetails(book)}
            >
              Szczegóły
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Library;
