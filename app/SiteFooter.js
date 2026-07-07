export default function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 80, padding: "40px 0", fontSize: 13.5, color: "var(--ink-soft)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span>© 2026 Sugartime. Custom celebration cakes, Delhi NCR.</span>
        <span>hello@sugartime.in · Delivering across Delhi · Gurgaon · Noida · Faridabad</span>
      </div>
    </footer>
  );
}
