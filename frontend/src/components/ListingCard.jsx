import { Link } from "react-router-dom";

function priceWithDiscount(base, discountPercent) {
  const b = Number(base);
  const d = Number(discountPercent);
  if (!Number.isFinite(b)) return null;
  if (!Number.isFinite(d) || d <= 0) return b;
  const p = Math.min(Math.max(d, 0), 100);
  return Math.round(b * (100 - p)) / 100;
}

export default function ListingCard({ item }) {
  const hasNight = Number.isFinite(Number(item.pricePerNight));
  const hasSess = Number.isFinite(Number(item.pricePerSession));

  const nightDisc = priceWithDiscount(item.pricePerNight, item.discountPercent);
  const sessDisc = priceWithDiscount(
    item.pricePerSession,
    item.discountPercent
  );

  const preferSession = item.type === "sauna" || item.type === "activity";

  return (
    <div className="card">
      <img
        src={item.images?.[0] || "https://picsum.photos/seed/moon/600/400"}
        alt={item.name}
      />
      <div className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{item.name}</h3>
          <span className="badge">{item.type}</span>
        </div>
        <p style={{ opacity: 0.8 }}>{item.description?.slice(0, 120)}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px",
        }}
      >
        <Link className="btn" to={`/listings/${item._id}`}>
          Peržiūrėti
        </Link>
        {preferSession && hasSess ? (
          Number(item.discountPercent) > 0 ? (
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {Number(item.pricePerNight)} €
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
            <p
              style={{
                color: "#FFD700",
                fontWeight: "bold",
                margin: 0,
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {Number(item.pricePerSession)} € / sesija
            </p>
          )
        ) : hasNight ? (
          Number(item.discountPercent) > 0 ? (
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {Number(item.pricePerNight)} €
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
            <p
              style={{
                color: "#FFD700",
                fontWeight: "bold",
                margin: 0,
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {Number(item.pricePerNight)} € / naktis
            </p>
          )
        ) : hasSess ? (
          Number(item.discountPercent) > 0 ? (
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
                {Number(item.pricePerSession)} €
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
            <p
              style={{
                color: "#FFD700",
                fontWeight: "bold",
                margin: 0,
                textShadow: "0 0 6px rgba(255,215,0,0.7)",
              }}
            >
              {Number(item.pricePerSession)} € / sesija
            </p>
          )
        ) : (
          <p style={{ opacity: 0.7, margin: 0 }}>Kaina nenurodyta</p>
        )}
      </div>
    </div>
  );
}
