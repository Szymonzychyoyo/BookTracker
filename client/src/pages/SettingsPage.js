// client/src/pages/SettingsPage.js
import React, { useState } from "react";
import { updateProfile, deleteAccount, uploadAvatar } from "../api/authAPI";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
      setError(err.response?.data?.message || "Błąd uploadu avatara");
    }
  };

  // zapis zmian loginu/hasła
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    // walidacja zmiany hasła
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setError("Aby zmienić hasło, wypełnij wszystkie pola.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Nowe hasło i potwierdzenie nie są zgodne.");
        return;
      }
    }

    try {
      const res = await updateProfile({
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      });
      // odśwież auth state z nowym tokenem i username
      login({
        token: res.token,
        _id: res._id,
        username: res.username,
        email: res.email,
        profileImage: res.profileImage ?? user.profileImage,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMsg(res.message);
    } catch (err) {
      console.error("updateProfile error", err.response || err);
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
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Ustawienia konta</h2>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sekcja avatara */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>Avatar:</label>
        <br />
        {user.profileImage && (
          <img
            src={`http://localhost:5001${user.profileImage}`}
            alt="avatar"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "0.5rem",
            }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Formularz login/hasło */}
      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label>Login:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <fieldset style={{ marginBottom: "1rem", padding: "0.5rem" }}>
          <legend>Zmiana hasła</legend>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Stare hasło:</label>
            <br />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Nowe hasło:</label>
            <br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Potwierdź nowe hasło:</label>
            <br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </fieldset>

        <button type="submit" style={{ width: "100%", padding: "0.5rem" }}>
          Zapisz zmiany
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <button
        onClick={handleDelete}
        style={{
          width: "100%",
          padding: "0.5rem",
          background: "red",
          color: "white",
        }}
      >
        Usuń konto
      </button>
    </div>
  );
};

export default SettingsPage;
