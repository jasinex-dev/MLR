import { Link } from "react-router-dom";

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

function renderPrice(item) {
  const showSessFirst = preferSession(item);
  const night = hasNight(item);
  const sess = hasSess(item);
  const disc = hasDiscount(item);

  
  if (showSessFirst && sess) {
    const base = Number(item.pricePerSession);
    if (disc) {
      const d = afterDisc(base, item.discountPercent);
      return (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          <strong
            style={{
              color: "#FFD700",
              textShadow: "0 0 6px rgba(255,215,0,0.7)",
            }}
          >
            {d} € / sesija
          </strong>
        </div>
      );
    }
    return (
      <strong
        style={{ color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.7)" }}
      >
        {base} € / sesija
      </strong>
    );
  }

  
  if (!showSessFirst && night) {
    const base = Number(item.pricePerNight);
    if (disc) {
      const d = afterDisc(base, item.discountPercent);
      return (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          <strong
            style={{
              color: "#FFD700",
              textShadow: "0 0 6px rgba(255,215,0,0.7)",
            }}
          >
            {d} € / naktis
          </strong>
        </div>
      );
    }
    return (
      <strong
        style={{ color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.7)" }}
      >
        {base} € / naktis
      </strong>
    );
  }

  
  if (sess) {
    const base = Number(item.pricePerSession);
    if (disc) {
      const d = afterDisc(base, item.discountPercent);
      return (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          <strong
            style={{
              color: "#FFD700",
              textShadow: "0 0 6px rgba(255,215,0,0.7)",
            }}
          >
            {d} € / sesija
          </strong>
        </div>
      );
    }
    return (
      <strong
        style={{ color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.7)" }}
      >
        {base} € / sesija
      </strong>
    );
  }

  if (night) {
    const base = Number(item.pricePerNight);
    if (disc) {
      const d = afterDisc(base, item.discountPercent);
      return (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "baseline",
            justifyContent: "flex-end",
          }}
        >
          <span style={{ textDecoration: "line-through", opacity: 0.7 }}>
            {base} €
          </span>
          <strong
            style={{
              color: "#FFD700",
              textShadow: "0 0 6px rgba(255,215,0,0.7)",
            }}
          >
            {d} € / naktis
          </strong>
        </div>
      );
    }
    return (
      <strong
        style={{ color: "#FFD700", textShadow: "0 0 6px rgba(255,215,0,0.7)" }}
      >
        {base} € / naktis
      </strong>
    );
  }

  return <span style={{ opacity: 0.7 }}>Kaina nenurodyta</span>;
}

export default function ListingCard({ item }) {
  const cover = Array.isArray(item?.images)
    ? item.images[0] || "https://picsum.photos/id/237/1200/600.webp"
    : item?.images || "https://picsum.photos/id/237/1200/600.webp";

  return (
    <div className="card">
      <img src={cover} alt={item?.name} />
      <div className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0 }}>{item?.name}</h3>
          <span className="badge">{item?.type}</span>
        </div>
        <p style={{ opacity: 0.8 }}>
          {typeof item?.description === "string"
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
        <Link className="btn btn-blue" to={`/listings/${item?._id}`}>
          Peržiūrėti
        </Link>
        {renderPrice(item)}
      </div>
    </div>
  );
}
