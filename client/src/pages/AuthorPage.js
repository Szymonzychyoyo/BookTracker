// client/src/pages/AuthorPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuthorDetails } from "../api/openLibraryAPI";
import styles from "./AuthorPage.module.css";

const AuthorPage = () => {
  const { authorKey } = useParams();
  const [author, setAuthor] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { author, works } = await getAuthorDetails(authorKey);
        setAuthor(author);
        setWorks(works);
      } catch (err) {
        console.error("Błąd pobierania autora:", err);
        setError("Nie udało się pobrać danych autora.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authorKey]);

  if (loading) return <p>Ładowanie autora…</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!author) return null;

  // pobierz tekst opisu/autobio
  const getDescription = () => {
    // OpenLibrary może zwracać bio lub description, jako string lub obiekt
    const desc = author.bio || author.description;
    if (!desc) return null;
    if (typeof desc === "string") return desc;
    if (typeof desc === "object" && (desc.value || desc.type)) {
      return desc.value || desc.type;
    }
    return null;
  };

  const descriptionText = getDescription();

  return (
    <div className={styles.container}>
      <h2>{author.name}</h2>
      {descriptionText && (
        <p className={styles.description}>
          {descriptionText}
        </p>
      )}
      <h3>Dzieła autora</h3>
      {works.length === 0 ? (
        <p>Brak dostępnych dzieł.</p>
      ) : (
        <ul>
          {works.map((work) => (
            <li key={work.key}>
              <Link to={`/search?q=${encodeURIComponent(work.title)}`}>
                {work.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorPage;