// client/src/components/BookItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BookItem.module.css';

const BookItem = ({
  bookData,
  isAdded,
  onAddToRead,
  onAddRead,
  onRemove,
  onShowDetails
}) => {
  const title = bookData.title;
  const author = Array.isArray(bookData.author_name)
    ? bookData.author_name[0]
    : 'Brak autora';
  const coverId = bookData.cover_i;
  const openLibraryId = bookData.key;
  const authorKey = bookData.author_key || [];

  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/100x150?text=Brak+okładki';

  return (
    <div className={styles.item}>
      <img className={styles.cover} src={coverUrl} alt={title} />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.author}>
          Autor:{' '}
          {authorKey.length > 0 ? (
            <Link to={`/author/${authorKey[0]}`}>{author}</Link>
          ) : (
            author
          )}
        </p>
      </div>
      <div className={styles.buttons}>
        {!isAdded ? (
          <>
            <button
              className={styles.button}
              onClick={() =>
                onAddToRead({ ...bookData, status: 'to-read' })
              }
            >
              Dodaj jako do przeczytania
            </button>
            <button
              className={styles.button}
              onClick={() =>
                onAddRead({ ...bookData, status: 'read' })
              }
            >
              Dodaj jako przeczytana
            </button>
          </>
        ) : (
          <button className={styles.button} onClick={onRemove}>
            Usuń z biblioteki
          </button>
        )}
        <button
          className={styles.button}
          onClick={() => onShowDetails(bookData)}
        >
          Szczegóły
        </button>
      </div>
    </div>
  );
};

export default BookItem;
