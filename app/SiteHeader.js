"use client";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "rgba(251,243,237,0.9)", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(8px)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--berry)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontWeight: 600 }}>S</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20 }}>Sugartime</span>
        </Link>
        <nav style={{ display: "flex", gap: 28, fontSize: 14.5, fontWeight: 500, color: "var(--ink-soft)" }}>
          <Link href="/cakes">Cakes</Link>
          <Link href="/track">Track order</Link>
        </nav>
      </div>
    </header>
  );
}
