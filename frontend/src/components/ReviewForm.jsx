import React, { useState } from "react";

export default function ReviewForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({ name, rating: Number(rating), comment });
    setName("");
    setRating(5);
    setComment("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      style={{ display: "grid", gap: 8 }}
    >
      <h3>Palik atsiliepimą</h3>
      <input
        className="input"
        placeholder="Vardas"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        className="select"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <textarea
        className="textarea"
        placeholder="Komentaras"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button className="btn">Siųsti</button>
    </form>
  );
}
