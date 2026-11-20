import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { CAKES } from "../lib/db";

export default function HomePage() {
  const featured = CAKES.slice(0, 3);
  return (
    <>
      <SiteHeader />
      <section style={{ padding: "76px 0 60px" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center" }}>
          <div>
            <span className="eyebrow">Baked fresh, daily · Delhi NCR</span>
            <h1 style={{ fontSize: 52, lineHeight: 1.05, margin: "14px 0 18px" }}>
              A cake for<br /><em style={{ color: "var(--berry)" }}>every</em> occasion.
            </h1>
            <p style={{ fontSize: 16.5, color: "var(--ink-soft)", maxWidth: 440, marginBottom: 28 }}>
              Custom celebration cakes, made to order and delivered across Delhi, Gurgaon, Noida and Faridabad.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <Link href="/cakes" className="btn btn-primary">Browse cakes</Link>
              <Link href="/track" className="btn btn-ghost">Track an order</Link>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CakeIllustration />
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 70 }}>
        <h2 style={{ fontSize: 26, marginBottom: 20 }}>Bestsellers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {featured.map(c => (
            <div key={c.id} className="card" style={{ padding: 22 }}>
              <div style={{ height: 120, borderRadius: 12, background: "linear-gradient(135deg, var(--butter), var(--berry))", opacity: 0.85, marginBottom: 14 }} />
              <h3 style={{ fontSize: 17, marginBottom: 6 }}>{c.name}</h3>
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 12 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

// Simple hand-drawn-style cake slice, standing in for a real product photo
// until Sugartime has proper photography.
function CakeIllustration() {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none">
      <circle cx="130" cy="130" r="120" fill="var(--butter)" opacity="0.25" />
      <path d="M60 150 L130 90 L200 150 L200 190 Q130 220 60 190 Z" fill="var(--berry)" />
      <path d="M60 150 L130 90 L200 150 L190 158 L130 105 L70 158 Z" fill="#fff" opacity="0.9" />
      <circle cx="130" cy="90" r="7" fill="var(--butter)" />
    </svg>
  );
}
