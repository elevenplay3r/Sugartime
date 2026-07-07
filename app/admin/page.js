"use client";
import { useEffect, useState } from "react";

const STAGES = ["requested", "confirmed", "baking", "ready", "delivered"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/orders");
    if (res.status === 401) { setAuthed(false); setLoading(false); return; }
    setOrders(await res.json());
    setAuthed(true);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function login() {
    setError("");
    const res = await fetch("/api/admin-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (res.ok) { setPassword(""); loadOrders(); }
    else setError("Wrong password.");
  }

  async function setStatus(id, status) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); // optimistic update
    await fetch(`/api/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }

  if (loading) return <div style={{ padding: 40, fontFamily: "Inter, sans-serif" }}>Loading…</div>;

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>
        <div className="card" style={{ padding: 30, width: 320 }}>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, marginBottom: 16 }}>Sugartime Admin</h1>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Admin password"
            onKeyDown={e => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--line)", fontSize: 14, marginBottom: 12 }} />
          {error && <p style={{ color: "var(--berry)", fontSize: 13, marginBottom: 10 }}>{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={login}>Log in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, marginBottom: 6 }}>Orders</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 24 }}>{orders.length} total</p>

        {orders.length === 0 && <p style={{ color: "var(--ink-soft)" }}>No orders yet.</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} className="card" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 12, color: "var(--ink-soft)" }}>#{o.id}</p>
                <p style={{ fontWeight: 600 }}>{o.cakeName} — {o.name}</p>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{o.phone} · delivery {o.date}</p>
                {o.notes && <p style={{ fontSize: 12.5, color: "var(--ink-soft)", fontStyle: "italic" }}>{o.notes}</p>}
              </div>
              <select value={o.status} onChange={e => setStatus(o.id, e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 8, border: "1.5px solid var(--line)", fontSize: 13, textTransform: "capitalize" }}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
