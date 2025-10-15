import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

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

  // viršelis
  const cover = Array.isArray(item.images)
    ? item.images[0] || "https://picsum.photos/id/237/1200/600.webp"
    : item.images || "https://picsum.photos/id/237/1200/600.webp";

  // kainos (0 arba ne skaičius = nerodom)
  const night = Number(item.pricePerNight);
  const session = Number(item.pricePerSession);
  const showNight = Number.isFinite(night) && night > 0;
  const showSession = Number.isFinite(session) && session > 0;

  // nuolaida (tik jei > 0)
  const discount = Number(item.discountPercent);
  const hasDiscount = Number.isFinite(discount) && discount > 0;
  const applyDisc = (x) =>
    hasDiscount ? Math.round(x * (100 - Math.min(discount, 100))) / 100 : null;

  const nightDisc = showNight ? applyDisc(night) : null;
  const sessDisc = showSession ? applyDisc(session) : null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <img
          src={cover}
          alt={item.name}
          style={{ height: 260, objectFit: "cover", width: "100%" }}
        />
        <h2 style={{ margin: "12px 0" }}>{item.name}</h2>

        {/* Kainas rodome tik jei bent viena > 0 */}
        {(showNight || showSession) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            {showNight && (
              <div>
                {hasDiscount ? (
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "baseline" }}
                  >
                    <span
                      style={{ textDecoration: "line-through", opacity: 0.7 }}
                    >
                      {night} €
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
                  <strong
                    style={{
                      color: "#FFD700",
                      textShadow: "0 0 6px rgba(255,215,0,0.7)",
                    }}
                  >
                    {night} € / naktis
                  </strong>
                )}
              </div>
            )}

            {showSession && (
              <div>
                {hasDiscount ? (
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "baseline" }}
                  >
                    <span
                      style={{ textDecoration: "line-through", opacity: 0.7 }}
                    >
                      {session} €
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
                  <strong
                    style={{
                      color: "#FFD700",
                      textShadow: "0 0 6px rgba(255,215,0,0.7)",
                    }}
                  >
                    {session} € / sesija
                  </strong>
                )}
              </div>
            )}
          </div>
        )}

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
