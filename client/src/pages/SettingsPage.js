// client/src/pages/SettingsPage.js
import React, { useState } from "react";
import { updateProfile, deleteAccount, uploadAvatar } from "../api/authAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./SettingsPage.module.css";

const SettingsPage = () => {
  const { user, login, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // formularz zmiany loginu/hasła
  const [username, setUsername] = useState(user.username);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // komunikaty
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // upload avatara
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { profileImage } = await uploadAvatar(file);
      updateUser({ profileImage });
      setMsg("Avatar zaktualizowany");
      setError("");
    } catch (err) {
      console.error("uploadAvatar error", err.response || err);
      setError("Błąd aktualizacji avatara");
    }
  };

  // zmiana loginu/hasła
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (newPassword && newPassword !== confirmPassword) {
      setError("Hasła nie są takie same");
      return;
    }
    try {
      const res = await updateProfile({
        username,
        oldPassword,
        newPassword: newPassword || undefined,
      });
      updateUser({ username: res.username });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMsg(res.message);
    } catch (err) {
      setError(err.response?.data?.message || "Błąd aktualizacji profilu");
    }
  };

  // usunięcie konta
  const handleDelete = async () => {
    setMsg("");
    setError("");
    if (!window.confirm("Czy na pewno chcesz usunąć swoje konto?")) return;
    try {
      await deleteAccount();
      logout();
      navigate("/register");
    } catch (err) {
      console.error("deleteAccount error", err.response || err);
      setError(err.response?.data?.message || "Błąd usuwania konta");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Ustawienia konta</h2>
      {msg && <p className={styles.success}>{msg}</p>}
      {error && <p className={styles.error}>{error}</p>}

      {/* Sekcja avatara */}
      <div className={styles.section}>
        <label>Avatar:</label>
        <br />
        {user.profileImage && (
          <img
            src={`http://localhost:5001${user.profileImage}`}
            alt="avatar"
            className={styles.avatarImg}
          />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Formularz login/hasło */}
      <form onSubmit={handleUpdate}>
        <div className={styles.field}>
          <label>Login:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.fullWidth}
          />
        </div>
        <fieldset className={styles.fieldset}>
          <legend>Zmiana hasła</legend>
          <div className={styles.field}>
            <label>Stare hasło:</label>
            <br />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.fullWidth}
            />
          </div>
          <div className={styles.field}>
            <label>Nowe hasło:</label>
            <br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.fullWidth}
            />
          </div>
          <div>
            <label>Potwierdź nowe hasło:</label>
            <br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.fullWidth}
            />
          </div>
        </fieldset>

        <button type="submit" className={styles.submit}>
          Zapisz zmiany
        </button>
      </form>

      <hr className={styles.hr} />

      <button onClick={handleDelete} className={styles.danger}>
        Usuń konto
      </button>
    </div>
  );
};

export default SettingsPage;
