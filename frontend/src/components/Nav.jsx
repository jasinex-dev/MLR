import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <div className="nav">
      <Link to="/" className="brand">
        <i class="fa-regular fa-moon"></i> Moon Lounge Resort
      </Link>
      <div style={{ display: "flex", gap: 12 }}>
        <NavLink to="/listings">Namai ir veiklos</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <a
          href="https://www.google.com/maps?q=55.639576,21.293068"
          target="_blank"
          rel="noreferrer"
        >
          Atvykimas
        </a>
      </div>
    </div>
  );
}
