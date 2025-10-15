import React, { useEffect, useState } from "react";
import { api } from "../api";

const empty = {
  name: "",
  type: "cabin",
  description: "",
  pricePerNight: "",
  pricePerSession: "",
  capacity: "",
  amenities: "",
  images: "https://picsum.photos/id/237/1200/600.webp",
  discountPercent: "",
};

function toNumberOrNull(v) {
  if (v === "" || v === null || typeof v === "undefined") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function applyDiscount(value, discountPercent) {
  const base = toNumberOrNull(value);
  const d = toNumberOrNull(discountPercent);
  if (base === null || d === null || d <= 0) return base;
  const p = Math.min(Math.max(d, 0), 100);
  return Math.round(base * (100 - p)) / 100;
}

export default function Admin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await api("/api/listings");
    setItems(data);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toPayload(src) {
    return {
      name: src.name,
      type: src.type,
      description: src.description,
      pricePerNight: toNumberOrNull(src.pricePerNight),
      pricePerSession: toNumberOrNull(src.pricePerSession),
      capacity: toNumberOrNull(src.capacity),
      amenities: String(src.amenities)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: [src.images],
      discountPercent: toNumberOrNull(src.discountPercent),
    };
  }

  async function save(e) {
    e.preventDefault();
    const payload = toPayload(form);

    if (editId) {
      const updated = await api(`/api/listings/${editId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setItems((prev) =>
        prev.map((x) =>
          String(x._id || x.id) === String(editId) ? updated : x
        )
      );
      setEditId(null);
      setForm(empty);
      alert("Pakeitimai išsaugoti");
    } else {
      const doc = await api("/api/listings", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setItems((prev) => [doc, ...prev]);
      setForm(empty);
      alert("Įrašas sukurtas sėkmingai");
    }
  }

  function startEdit(it) {
    setEditId(it._id || it.id);
    setForm({
      name: it.name || "",
      type: it.type || "cabin",
      description: it.description || "",
      pricePerNight:
        typeof it.pricePerNight === "number" ? String(it.pricePerNight) : "",
      pricePerSession:
        typeof it.pricePerSession === "number"
          ? String(it.pricePerSession)
          : "",
      capacity: typeof it.capacity === "number" ? String(it.capacity) : "",
      amenities: Array.isArray(it.amenities)
        ? it.amenities.join(", ")
        : it.amenities || "",
      images: Array.isArray(it.images) ? it.images[0] || "" : it.images || "",
      discountPercent:
        typeof it.discountPercent === "number"
          ? String(it.discountPercent)
          : "",
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(empty);
  }

  async function remove(id, name) {
    if (!confirm(`Ar tikrai šalinti „${name || "įrašą"}“?`)) return;
    try {
      await api(`/api/listings/${id}`, { method: "DELETE" });
      setItems((prev) =>
        prev.filter((x) => String(x._id || x.id) !== String(id))
      );
      if (editId && String(editId) === String(id)) cancelEdit();
      alert("Įrašas pašalintas");
    } catch (e) {
      alert("nepavyko pašalinti: " + e.message);
    }
  }

  const previewNight = applyDiscount(form.pricePerNight, form.discountPercent);
  const previewSession = applyDiscount(
    form.pricePerSession,
    form.discountPercent
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>
        Admin — išteklių valdymas {editId ? " - Redagavimas" : " - Kūrimas"}
      </h2>

      {/* Forma */}
      <form
        className="card"
        onSubmit={save}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
      >
        <input
          className="input"
          name="name"
          placeholder="Pavadinimas"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          className="select"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="cabin">Namelis</option>
          <option value="sauna">Pirtis</option>
          <option value="activity">Veikla</option>
        </select>

        <input
          className="input"
          name="pricePerNight"
          type="number"
          placeholder="Kaina už naktį (nameliams)"
          value={form.pricePerNight}
          onChange={handleChange}
        />
        <input
          className="input"
          name="pricePerSession"
          type="number"
          placeholder="Kaina už sesiją (pirtis/veiklos)"
          value={form.pricePerSession}
          onChange={handleChange}
        />

        {/* Nuolaida % */}
        <input
          className="input"
          name="discountPercent"
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="Nuolaida (%)"
          value={form.discountPercent}
          onChange={handleChange}
        />

        <input
          className="input"
          name="capacity"
          type="number"
          placeholder="Talpa"
          value={form.capacity}
          onChange={handleChange}
        />
        <input
          className="input"
          name="images"
          placeholder="Paveikslo URL"
          value={form.images}
          onChange={handleChange}
        />

        <textarea
          className="textarea"
          name="description"
          placeholder="Aprašymas"
          style={{ gridColumn: "1/-1" }}
          value={form.description}
          onChange={handleChange}
        />
        <input
          className="input"
          name="amenities"
          placeholder="Patogumai (kableliais)"
          value={form.amenities}
          onChange={handleChange}
          style={{ gridColumn: "1/-1" }}
        />

        <div
          style={{
            gridColumn: "1/-1",
            display: "flex",
            gap: 24,
            alignItems: "baseline",
          }}
        >
          {/* Naktis */}
          <div>
            <div style={{ opacity: 0.8, fontSize: ".9rem" }}>
              Kaina už naktį
            </div>
            {toNumberOrNull(form.pricePerNight) !== null ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    textDecoration: form.discountPercent
                      ? "line-through"
                      : "none",
                    opacity: form.discountPercent ? 0.7 : 1,
                  }}
                >
                  {Number(form.pricePerNight)} €
                </span>
                {previewNight !== null &&
                  previewNight !== Number(form.pricePerNight) && (
                    <strong
                      style={{
                        color: "#FFD700",
                        textShadow: "0 0 6px rgba(255,215,0,0.7)",
                      }}
                    >
                      {previewNight} €
                    </strong>
                  )}
              </div>
            ) : (
              <span style={{ opacity: 0.6 }}>—</span>
            )}
          </div>

          {/* Sesija */}
          <div>
            <div style={{ opacity: 0.8, fontSize: ".9rem" }}>
              Kaina už sesiją
            </div>
            {toNumberOrNull(form.pricePerSession) !== null ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    textDecoration: form.discountPercent
                      ? "line-through"
                      : "none",
                    opacity: form.discountPercent ? 0.7 : 1,
                  }}
                >
                  {Number(form.pricePerSession)} €
                </span>
                {previewSession !== null &&
                  previewSession !== Number(form.pricePerSession) && (
                    <strong
                      style={{
                        color: "#FFD700",
                        textShadow: "0 0 6px rgba(255,215,0,0.7)",
                      }}
                    >
                      {previewSession} €
                    </strong>
                  )}
              </div>
            ) : (
              <span style={{ opacity: 0.6 }}>—</span>
            )}
          </div>
        </div>

        <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
          <button className="btn" type="submit">
            {editId ? "Išsaugoti pakeitimus" : "Išsaugoti"}
          </button>
          {editId && (
            <button className="btn ghost" type="button" onClick={cancelEdit}>
              Atšaukti
            </button>
          )}
        </div>
      </form>

      {/* Sąrašas */}
      <div className="grid">
        {items.map((it) => {
          const amenities = Array.isArray(it.amenities)
            ? it.amenities
            : typeof it.amenities === "string" && it.amenities.length
            ? it.amenities
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

          const FALLBACK_IMG = "https://picsum.photos/id/237/1200/600.webp";
          const cover = Array.isArray(it.images)
            ? it.images[0] || FALLBACK_IMG
            : it.images || FALLBACK_IMG;

          const id = it._id || it.id;
          const nightDisc = applyDiscount(it.pricePerNight, it.discountPercent);
          const sessDisc = applyDiscount(
            it.pricePerSession,
            it.discountPercent
          );

          return (
            <div className="card" key={id} style={{ display: "grid", gap: 8 }}>
              <img
                src={cover}
                alt={it.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <h3 style={{ margin: "4px 0" }}>{it.name}</h3>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {it.type ? <span className="badge">{it.type}</span> : null}
                {typeof it.capacity === "number" ? (
                  <span className="badge">Talpa: {it.capacity}</span>
                ) : null}
                {id ? (
                  <span className="badge" title={id}>
                    ID: {String(id).slice(0, 8)}…
                  </span>
                ) : null}
              </div>

              <p style={{ opacity: 0.8, margin: "4px 0 0" }}>
                {it.description?.slice(0, 140)}
                {it.description && it.description.length > 140 ? "…" : ""}
              </p>

              {amenities.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    opacity: 0.9,
                  }}
                >
                  {amenities.map((a) => (
                    <span key={a} className="badge">
                      {a}
                    </span>
                  ))}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn ghost" onClick={() => startEdit(it)}>
                    Redaguoti
                  </button>
                  <button className="btn ghost" onClick={() => remove(id)}>
                    Šalinti
                  </button>
                </div>

                <div style={{ textAlign: "right" }}>
                  {/* Nakties kaina su nuolaida */}
                  {typeof it.pricePerNight === "number" && (
                    <div title="Kaina už naktį">
                      {it.discountPercent ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "baseline",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span
                            style={{
                              textDecoration: "line-through",
                              opacity: 0.7,
                            }}
                          >
                            {it.pricePerNight} €
                          </span>
                          <strong
                            style={{
                              color: "#FFD700",
                              textShadow: "0 0 6px rgba(255,215,0,0.7)",
                            }}
                          >
                            {nightDisc} € / naktis
                          </strong>
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#FFD700",
                            fontWeight: "bold",
                            textShadow: "0 0 6px rgba(255,215,0,0.7)",
                          }}
                        >
                          {it.pricePerNight} € / naktis
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sesijos kaina su nuolaida */}
                  {typeof it.pricePerSession === "number" && (
                    <div title="Kaina už sesiją" style={{ marginTop: 4 }}>
                      {it.discountPercent ? (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "baseline",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span
                            style={{
                              textDecoration: "line-through",
                              opacity: 0.7,
                            }}
                          >
                            {it.pricePerSession} €
                          </span>
                          <strong
                            style={{
                              color: "#FFD700",
                              textShadow: "0 0 6px rgba(255,215,0,0.7)",
                            }}
                          >
                            {sessDisc} € / sesija
                          </strong>
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#FFD700",
                            fontWeight: "bold",
                            textShadow: "0 0 6px rgba(255,215,0,0.7)",
                          }}
                        >
                          {it.pricePerSession} € / sesija
                        </div>
                      )}
                    </div>
                  )}

                  {!Number.isFinite(it.pricePerNight) &&
                    !Number.isFinite(it.pricePerSession) && (
                      <div style={{ opacity: 0.7 }}>Kaina nenurodyta</div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
