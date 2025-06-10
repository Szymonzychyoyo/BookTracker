// client/src/components/Modal.js
import React from 'react';
import styles from './Modal.module.css';

export default function Modal({ onClose, title, coverUrl, author, description }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeButton} aria-label="Zamknij okno">×</button>
        <div className={styles.left}>
          {coverUrl ? (
            <img src={coverUrl} alt={title} className={styles.cover} />
          ) : (
            <img
              src="/brakOkladki/brakOkladki.png"
              alt="Brak okładki"
              className={styles.cover}
            />
          )}
        </div>
        <div className={styles.right}>
          <h2 className={styles.title}>{title}</h2>
          {author && (
            <p className={styles.author}>
              <span>Autor:</span> {author}
            </p>
          )}
          <div className={styles.description}>
            {description || 'Brak opisu.'}
          </div>
        </div>
      </div>
    </div>
  );
}