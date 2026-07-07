"use client";
import { useState } from "react";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

const STAGES = [
  { key: "requested", label: "Requested" },
  { key: "confirmed", label: "Confirmed" },
  { key: "baking", label: "Baking" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
];
const STAGE_COLOR = { requested: "#9A9A9A", confirmed: "#3B82F6", baking: "#F4C542", ready: "#B3264D", delivered: "#1D9A6C" };

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup() {
    setError(""); setOrder(null); setBusy(true);
    const res = await fetch(`/api/orders/${orderId.trim()}`);
    setBusy(false);
    if (res.ok) setOrder(await res.json());
    else setError("No order found with that ID. Double-check the number and try again.");
  }

  const stageIndex = order ? STAGES.findIndex(s => s.key === order.status) : -1;

  return (
    <>
      <SiteHeader />
      <div className="container" style={{ padding: "48px 0 70px", maxWidth: 560 }}>
        <span className="eyebrow">Track your order</span>
        <h1 style={{ fontSize: 30, margin: "10px 0 24px" }}>Where's my cake?</h1>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="Enter your order ID"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--line)", fontSize: 14, fontFamily: "monospace" }} />
          <button className="btn btn-primary" disabled={busy || !orderId} onClick={lookup}>{busy ? "Looking up…" : "Track"}</button>
        </div>
        {error && <p style={{ color: "var(--berry)", fontSize: 13.5 }}>{error}</p>}

        {order && (
          <div className="ticket">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 3 }}>Order</p>
                <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16 }}>#{order.id}</p>
              </div>
              <span className="stamp" style={{ background: STAGE_COLOR[order.status] + "22", color: STAGE_COLOR[order.status] }}>
                {STAGES.find(s=>s.key===order.status)?.label || order.status}
              </span>
            </div>

            <p style={{ fontSize: 14.5, marginBottom: 4 }}><strong>{order.cakeName}</strong></p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 20 }}>Delivery date: {order.date}</p>

            <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
              <div style={{ position: "absolute", top: 9, left: 10, right: 10, height: 2, background: "var(--line)", zIndex: 0 }} />
              {STAGES.map((s, i) => (
                <div key={s.key} style={{ zIndex: 1, textAlign: "center", flex: 1 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%", margin: "0 auto 6px",
                    background: i <= stageIndex ? "var(--berry)" : "#fff",
                    border: `2px solid ${i <= stageIndex ? "var(--berry)" : "var(--line)"}`,
                  }} />
                  <span style={{ fontSize: 10.5, color: i <= stageIndex ? "var(--ink)" : "var(--ink-soft)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
