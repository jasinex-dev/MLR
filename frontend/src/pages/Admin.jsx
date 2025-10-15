import React, { useEffect, useState } from "react";
import { api } from "../api";

const EMPTY = {
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

function toNum(v) {
  if (v === "" || v === null || typeof v === "undefined") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
}

function priceAfterDiscount(value, discountPercent) {
  const base = toNum(value);
  const d = toNum(discountPercent);
  if (base === null || d === null || d <= 0) return base;
  const p = Math.min(Math.max(d, 0), 100);
  return Math.round(base * (100 - p)) / 100;
}

export default function Admin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await api("/api/listings");
    setItems(data);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toPayload(src) {
    return {
      name: src.name,
      type: src.type,
      description: src.description,
      pricePerNight: toNum(src.pricePerNight),
      pricePerSession: toNum(src.pricePerSession),
      capacity: toNum(src.capacity),
      amenities: String(src.amenities)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: [src.images],
      discountPercent: toNum(src.discountPercent),
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
      setItems((prev) => {
        const idStr = String(editId);
        return prev.map((x) => (String(x._id || x.id) === idStr ? updated : x));
      });
      setEditId(null);
      setForm(EMPTY);
      alert("Pakeitimai išsaugoti");
      return;
    }

    const doc = await api("/api/listings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setItems((prev) => [doc, ...prev]);
    setForm(EMPTY);
    alert("Įrašas sukurtas");
  }

  function startEdit(it) {
    setEditId(it._id || it.id);
    setForm({
      name: it.name || "",
      type: it.type || "cabin",
      description: it.description || "",
      pricePerNight: Number.isFinite(Number(it.pricePerNight))
        ? String(Number(it.pricePerNight))
        : "",
      pricePerSession: Number.isFinite(Number(it.pricePerSession))
        ? String(Number(it.pricePerSession))
        : "",
      capacity: Number.isFinite(Number(it.capacity))
        ? String(Number(it.capacity))
        : "",
      amenities: Array.isArray(it.amenities)
        ? it.amenities.join(", ")
        : it.amenities || "",
      images: Array.isArray(it.images) ? it.images[0] || "" : it.images || "",
      discountPercent: Number.isFinite(Number(it.discountPercent))
        ? String(Number(it.discountPercent))
        : "",
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY);
  }

  async function remove(id, name) {
    const ok = confirm(`Ar tikrai šalinti „${name || "įrašą"}“?`);
    if (!ok) return;
    await api(`/api/listings/${id}`, { method: "DELETE" });
    setItems((prev) =>
      prev.filter((x) => String(x._id || x.id) !== String(id))
    );
    if (editId && String(editId) === String(id)) cancelEdit();
    alert("Įrašas pašalintas");
  }

  function PricePreview({ label, value, discount }) {
    const v = toNum(value);
    if (v === null) {
      return (
        <div>
          <div style={{ opacity: 0.8, fontSize: ".9rem" }}>{label}</div>
          <span style={{ opacity: 0.6 }}>—</span>
        </div>
      );
    }
    const hasDiscount = toNum(discount) > 0;
    const pv = priceAfterDiscount(value, discount);
    const showPv = pv !== null && pv !== Number(value);

    return (
      <div>
        <div style={{ opacity: 0.8, fontSize: ".9rem" }}>{label}</div>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span
            style={{
              textDecoration: hasDiscount ? "line-through" : "none",
              opacity: hasDiscount ? 0.7 : 1,
            }}
          >
            {Number(value)} €
          </span>
          {showPv ? (
            <strong
              style={{
                color: "#FFD700",
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {pv} €
            </strong>
          ) : null}
        </div>
      </div>
    );
  }

  function AdminPrices({ item }) {
    const hasNight = Number.isFinite(Number(item.pricePerNight));
    const hasSess = Number.isFinite(Number(item.pricePerSession));
    const hasDisc = Number(item.discountPercent) > 0;

    function afterDisc(v) {
      const base = Number(v);
      const d = Number(item.discountPercent);
      if (!Number.isFinite(base) || !Number.isFinite(d) || d <= 0) return base;
      const p = Math.min(Math.max(d, 0), 100);
      return Math.round(base * (100 - p)) / 100;
    }

    return (
      <div style={{ textAlign: "right", display: "grid", gap: 4 }}>
        {hasNight && (
          <div
            title="Kaina už naktį"
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              alignItems: "baseline",
            }}
          >
            {hasDisc ? (
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {Number(item.pricePerNight)} €
              </span>
            ) : null}
            <strong
              style={{
                color: "#FFD700",
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {hasDisc
                ? afterDisc(item.pricePerNight)
                : Number(item.pricePerNight)}{" "}
              € / naktis
            </strong>
          </div>
        )}

        {hasSess && (
          <div
            title="Kaina už sesiją"
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              alignItems: "baseline",
            }}
          >
            {hasDisc ? (
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {Number(item.pricePerSession)} €
              </span>
            ) : null}
            <strong
              style={{
                color: "#FFD700",
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {hasDisc
                ? afterDisc(item.pricePerSession)
                : Number(item.pricePerSession)}{" "}
              € / sesija
            </strong>
          </div>
        )}

        {!hasNight && !hasSess ? (
          <div style={{ opacity: 0.7 }}>Kaina nenurodyta</div>
        ) : null}
      </div>
    );
  }

  let titleNote = " - Kūrimas";
  if (editId) titleNote = " - Redagavimas";

  let submitText = "Išsaugoti";
  if (editId) submitText = "Išsaugoti pakeitimus";

  const previewNight = priceAfterDiscount(
    form.pricePerNight,
    form.discountPercent
  );
  const previewSession = priceAfterDiscount(
    form.pricePerSession,
    form.discountPercent
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Admin — išteklių valdymas{titleNote}</h2>

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
          onChange={onChange}
          required
        />
        <select
          className="select"
          name="type"
          value={form.type}
          onChange={onChange}
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
          onChange={onChange}
        />
        <input
          className="input"
          name="pricePerSession"
          type="number"
          placeholder="Kaina už sesiją (pirtis/veiklos)"
          value={form.pricePerSession}
          onChange={onChange}
        />

        <input
          className="input"
          name="discountPercent"
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="Nuolaida (%)"
          value={form.discountPercent}
          onChange={onChange}
        />

        <input
          className="input"
          name="capacity"
          type="number"
          placeholder="Talpa"
          value={form.capacity}
          onChange={onChange}
        />
        <input
          className="input"
          name="images"
          placeholder="Paveikslo URL"
          value={form.images}
          onChange={onChange}
        />

        <textarea
          className="textarea"
          name="description"
          placeholder="Aprašymas"
          style={{ gridColumn: "1/-1" }}
          value={form.description}
          onChange={onChange}
        />
        <input
          className="input"
          name="amenities"
          placeholder="Patogumai (kableliais)"
          value={form.amenities}
          onChange={onChange}
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
          <PricePreview
            label="Kaina už naktį"
            value={form.pricePerNight}
            discount={form.discountPercent}
          />
          <PricePreview
            label="Kaina už sesiją"
            value={form.pricePerSession}
            discount={form.discountPercent}
          />
        </div>

        <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
          <button className="btn" type="submit">
            {submitText}
          </button>
          {editId ? (
            <button className="btn ghost" type="button" onClick={cancelEdit}>
              Atšaukti
            </button>
          ) : null}
        </div>
      </form>

      <div className="grid">
        {items.map((it) => {
          const id = it._id || it.id;

          let amenities = [];
          if (Array.isArray(it.amenities)) amenities = it.amenities;
          else if (typeof it.amenities === "string" && it.amenities.length) {
            amenities = it.amenities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }

          let cover = "https://picsum.photos/id/237/1200/600.webp";
          if (Array.isArray(it.images)) {
            if (it.images[0]) cover = it.images[0];
          } else if (typeof it.images === "string" && it.images) {
            cover = it.images;
          }

          let desc = "";
          if (typeof it.description === "string") desc = it.description;
          if (desc.length > 140) desc = desc.slice(0, 140) + "…";

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
                {Number.isFinite(Number(it.capacity)) ? (
                  <span className="badge">Talpa: {Number(it.capacity)}</span>
                ) : null}
                {id ? (
                  <span className="badge" title={id}>
                    ID: {String(id).slice(0, 8)}…
                  </span>
                ) : null}
              </div>

              <p style={{ opacity: 0.8, margin: "4px 0 0" }}>{desc}</p>

              {amenities.length > 0 ? (
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
              ) : null}

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
                  <button
                    className="btn ghost"
                    onClick={() => remove(id, it.name)}
                  >
                    Šalinti
                  </button>
                </div>
                <AdminPrices item={it} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
