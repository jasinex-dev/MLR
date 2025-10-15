import React from "react";

export default function ReviewList({ items = [], onDelete }) {
  if (items.length === 0) return <p>Komentarų dar nėra. Būk pirmas!</p>;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((r) => (
        <div className="card" key={r._id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>{r.name}</strong>
            <span className="badge">Įvertinimas: {r.rating}/5</span>
          </div>
          <p style={{ marginTop: 8 }}>{r.comment}</p>
          {onDelete && (
            <button className="btn ghost" onClick={() => onDelete(r._id)}>
              Šalinti
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
