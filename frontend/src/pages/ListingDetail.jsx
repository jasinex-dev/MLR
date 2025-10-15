import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

function priceWithDiscount(base, discountPercent) {
  const b = Number(base);
  const d = Number(discountPercent);
  if (!Number.isFinite(b)) return null;
  if (!Number.isFinite(d) || d <= 0) return b;
  const p = Math.min(Math.max(d, 0), 100);
  return Math.round(b * (100 - p)) / 100;
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

  async function deleteReview(id) {
    if (!confirm("Ištrinti atsiliepimą?")) return;
    try {
      await api(`/api/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      alert("Atsiliepimas pašalintas");
    } catch (e) {
      alert("Nepavyko ištrinti: " + e.message);
    }
  }

  if (loading) return <p>Kraunama...</p>;
  if (!item) return <p>Nerasta</p>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <img
          src={item.images?.[0] || "https://picsum.photos/seed/moon/1200/600"}
          alt={item.name}
          style={{ height: 260, objectFit: "cover", width: "100%" }}
        />
        <h2 style={{ margin: "12px 0" }}>{item.name}</h2>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {Number.isFinite(Number(item.pricePerNight)) ? (
            Number(item.discountPercent) > 0 ? (
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "baseline",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{ textDecoration: "line-through", opacity: 0.7 }}
                  >
                    {Number(item.pricePerNight)} €
                  </span>
                  <strong
                    style={{
                      color: "#FFD700",
                      fontSize: "1.2rem",
                      textShadow: "0 0 6px rgba(255,215,0,0.7)",
                    }}
                    title={`Nuolaida ${Number(item.discountPercent)}%`}
                  >
                    {priceWithDiscount(
                      item.pricePerNight,
                      item.discountPercent
                    )}{" "}
                    € / naktis
                  </strong>
                </div>
              </div>
            ) : (
              <p
                style={{
                  color: "#FFD700",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  margin: "0 0 8px",
                  textShadow: "0 0 6px rgba(255,215,0,0.7)",
                }}
              >
                {Number(item.pricePerNight)} € / naktis
              </p>
            )
          ) : (
            <p style={{ opacity: 0.7, margin: "0 0 8px" }}>Kaina nenurodyta</p>
          )}
        </div>
        <p>{item.description}</p>
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", opacity: 0.85 }}
        >
          {item.amenities?.map((a) => (
            <span key={a} className="badge">
              {a}
            </span>
          ))}
        </div>
      </div>
      <ReviewForm onSubmit={addReview} />
      <ReviewList items={reviews} onDelete={deleteReview} />
    </div>
  );
}
