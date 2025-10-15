import { Link } from "react-router-dom";

export default function ListingCard({ item }) {
  const cover = Array.isArray(item && item.images)
    ? item.images[0] || "https://picsum.photos/id/237/1200/600.webp"
    : (item && item.images) || "https://picsum.photos/id/237/1200/600.webp";

  
  const night = Number(item && item.pricePerNight);
  const session = Number(item && item.pricePerSession);
  const showNight = Number.isFinite(night) && night > 0;
  const showSession = Number.isFinite(session) && session > 0;

 
  const discount = Number(item && item.discountPercent);
  const hasDiscount = Number.isFinite(discount) && discount > 0;
  function applyDisc(x) {
    if (!hasDiscount) return null;
    const d = discount > 100 ? 100 : discount < 0 ? 0 : discount;
    return Math.round(x * (100 - d)) / 100;
  }

  
  let nightEl = null;
  if (showNight) {
    const nightDisc = applyDisc(night);
    if (nightDisc !== null) {
      nightEl = (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
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
      );
    } else {
      nightEl = (
        <strong
          style={{
            color: "#FFD700",
            textShadow: "0 0 6px rgba(255,215,0,0.7)",
          }}
        >
          {night} € / naktis
        </strong>
      );
    }
  }

  let sessionEl = null;
  if (showSession) {
    const sessDisc = applyDisc(session);
    if (sessDisc !== null) {
      sessionEl = (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
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
      );
    } else {
      sessionEl = (
        <strong
          style={{
            color: "#FFD700",
            textShadow: "0 0 6px rgba(255,215,0,0.7)",
          }}
        >
          {session} € / sesija
        </strong>
      );
    }
  }

  
  const hasAnyPrice = Boolean(nightEl || sessionEl);

  return (
    <div className="card">
      <img src={cover} alt={item && item.name} />
      <div className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{item && item.name}</h3>
          <span className="badge">{item && item.type}</span>
        </div>
        <p style={{ opacity: 0.8 }}>
          {item && typeof item.description === "string"
            ? item.description.slice(0, 120)
            : ""}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Link className="btn btn-blue" to={`/listings/${item && item._id}`}>
          Peržiūrėti
        </Link>

        {hasAnyPrice && (
          <div style={{ textAlign: "right" }}>
            {nightEl}
            {sessionEl}
          </div>
        )}
      </div>
    </div>
  );
}
