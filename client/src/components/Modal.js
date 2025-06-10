// client/src/components/Modal.js
import React from 'react';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000
};

const contentStyle = {
  background: '#fff',
  borderRadius: '10px',
  maxWidth: 650,
  width: '95%',
  display: 'flex',
  flexDirection: 'row',
  gap: '2rem',
  padding: '2rem',
  position: 'relative',
  boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
};

const leftStyle = {
  flex: '0 0 160px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center'
};

const rightStyle = {
  flex: '1',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start'
};

const imgStyle = {
  width: 150,
  height: 220,
  objectFit: 'cover',
  borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.10)'
};

const closeBtnStyle = {
  position: 'absolute', top: 12, right: 18,
  background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer'
};

export default function Modal({ onClose, title, coverUrl, author, description }) {
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        style={contentStyle}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={closeBtnStyle} aria-label="Zamknij okno">×</button>
        <div style={leftStyle}>
          {coverUrl ? (
            <img src={coverUrl} alt={title} style={imgStyle} />
          ) : (
            <div
              style={{
                ...imgStyle,
                background: "#eee",
                color: "#777",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.95rem"
              }}
            >
              Brak okładki
            </div>
          )}
        </div>
        <div style={rightStyle}>
          <h2 style={{ margin: 0, marginBottom: 10 }}>{title}</h2>
          {author && (
            <p style={{ margin: 0, fontWeight: 500, color: '#444' }}>
              <span style={{ color: '#888' }}>Autor:</span> {author}
            </p>
          )}
          <div style={{
            marginTop: 15,
            maxHeight: 220,
            overflowY: 'auto',
            color: '#222',
            fontSize: '1rem',
            lineHeight: 1.5
          }}>
            {description || 'Brak opisu.'}
          </div>
        </div>
      </div>
    </div>
  );
}
