import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

function hasNight(item) {
  return Number.isFinite(Number(item?.pricePerNight));
}
function hasSess(item) {
  return Number.isFinite(Number(item?.pricePerSession));
}
function preferSession(item) {
  return item?.type === "sauna" || item?.type === "activity";
}
function hasDiscount(item) {
  return Number(item?.discountPercent) > 0;
}
function afterDisc(value, discountPercent) {
  const base = Number(value);
  const d = Number(discountPercent);
  if (!Number.isFinite(base) || !Number.isFinite(d) || d <= 0) return base;
  const p = Math.min(Math.max(d, 0), 100);
  return Math.round(base * (100 - p)) / 100;
}

function renderDetailPrice(item) {
  const showSessFirst = preferSession(item);
  const night = hasNight(item);
  const sess = hasSess(item);
  const disc = hasDiscount(item);

  const p = (txt) => (
    <p
      style={{
        color: "#FFD700",
        fontWeight: 700,
        margin: 0,
        textShadow: "0 0 6px rgba(255,215,0,0.7)",
      }}
    >
      {txt}
    </p>
  );

  if (showSessFirst && sess) {
    const base = Number(item.pricePerSession);
    if (disc)
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          {p(`${afterDisc(base, item.discountPercent)} € / sesija`)}
        </div>
      );
    return p(`${base} € / sesija`);
  }

  if (!showSessFirst && night) {
    const base = Number(item.pricePerNight);
    if (disc)
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          {p(`${afterDisc(base, item.discountPercent)} € / naktis`)}
        </div>
      );
    return p(`${base} € / naktis`);
  }

  // Fallback
  if (sess) {
    const base = Number(item.pricePerSession);
    if (disc)
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          {p(`${afterDisc(base, item.discountPercent)} € / sesija`)}
        </div>
      );
    return p(`${base} € / sesija`);
  }

  if (night) {
    const base = Number(item.pricePerNight);
    if (disc)
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          {p(`${afterDisc(base, item.discountPercent)} € / naktis`)}
        </div>
      );
    return p(`${base} € / naktis`);
  }

  return <p style={{ opacity: 0.7, margin: 0 }}>Kaina nenurodyta</p>;
}

export default function ListingDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const data = await api(`/api/listings/${id}`);
    setItem(data);
    const revs = await api(`/api/reviews?listingId=${id}`);
    setReviews(revs);
    setLoading(false);
  }

  async function addReview(r) {
    const doc = await api("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ ...r, listingId: id }),
    });
    setReviews((prev) => [doc, ...prev]);
  }

  async function deleteReview(rid) {
    if (!confirm("Ištrinti atsiliepimą?")) return;
    try {
      await api(`/api/reviews/${rid}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== rid && r.id !== rid));
      alert("Atsiliepimas pašalintas");
    } catch (e) {
      alert("Nepavyko ištrinti: " + e.message);
    }
  }

  if (loading) return <p>Kraunama...</p>;
  if (!item) return <p>Nerasta</p>;

  const cover = Array.isArray(item?.images)
    ? item.images[0] || "https://picsum.photos/id/237/1200/600.webp"
    : item?.images || "https://picsum.photos/id/237/1200/600.webp";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <img
          src={cover}
          alt={item?.name}
          style={{ height: 260, objectFit: "cover", width: "100%" }}
        />
        <h2 style={{ margin: "12px 0" }}>{item?.name}</h2>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}
        >
          {renderDetailPrice(item)}
        </div>

        <p>{item?.description}</p>

        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0.85 }}
        >
          {Array.isArray(item?.amenities)
            ? item.amenities.map((a) => (
                <span key={a} className="badge">
                  {a}
                </span>
              ))
            : null}
        </div>
      </div>

      <ReviewForm onSubmit={addReview} />
      <ReviewList items={reviews} onDelete={deleteReview} />
    </div>
  );
}
