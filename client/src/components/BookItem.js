// client/src/components/BookItem.js
import React from "react";
import styles from "./BookItem.module.css";

const BookItem = ({
  bookData,
  isAdded,
  onAddToRead,
  onAddRead,
  onRemove
}) => {
  const title = bookData.title;
  const author = Array.isArray(bookData.author_name)
    ? bookData.author_name[0]
    : "Brak autora";
  const coverId = bookData.cover_i;
  const openLibraryId = bookData.key;
  const authorKeyList = bookData.author_key || [];

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/100x150?text=Brak+okładki";

  return (
    <div className={styles.item}>
      <img
        className={styles.cover}
        src={coverUrl}
        alt={`Okładka ${title}`}
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.author}>Autor: {author}</p>
      </div>
      <div className={styles.buttons}>
        {!isAdded ? (
          <>
            <button
              className={styles.button}
              onClick={() =>
                onAddToRead({
                  title,
                  author,
                  openLibraryId,
                  coverId,
                  authorKey: authorKeyList,
                  status: "to-read"
                })
              }
            >
              Dodaj jako do przeczytania
            </button>
            <button
              className={styles.button}
              onClick={() =>
                onAddRead({
                  title,
                  author,
                  openLibraryId,
                  coverId,
                  authorKey: authorKeyList,
                  status: "read"
                })
              }
            >
              Dodaj jako przeczytana
            </button>
          </>
        ) : (
          <button
            className={styles.button}
            onClick={() => onRemove(openLibraryId)}
          >
            Usuń z biblioteki
          </button>
        )}
      </div>
    </div>
  );
};

export default BookItem;
