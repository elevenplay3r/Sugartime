"use client";
import { useState } from "react";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

// Catalog is duplicated here (not imported from lib/db) because this is a
// "use client" page and lib/db.js will eventually make server-only database
// calls — keeping the client-visible catalog separate avoids ever shipping
// database code to the browser. If the catalog changes in lib/db.js, mirror
// it here too, or fetch it from a small /api/cakes route instead.
const CAKES = [
  { id: "c1", name: "Classic Red Velvet", desc: "Layered red velvet with cream cheese frosting.", category: "Bestsellers" },
  { id: "c2", name: "Belgian Chocolate Truffle", desc: "Dark chocolate sponge, ganache, truffle shavings.", category: "Bestsellers" },
  { id: "c3", name: "Fresh Fruit Cream", desc: "Vanilla sponge, whipped cream, seasonal fruit.", category: "Classics" },
  { id: "c4", name: "Black Forest", desc: "Chocolate sponge, cherries, whipped cream.", category: "Classics" },
  { id: "c5", name: "Custom Photo Cake", desc: "Edible print of your own photo, any flavour base.", category: "Custom" },
  { id: "c6", name: "Custom Theme Cake", desc: "Fully custom design — tell us the occasion.", category: "Custom" },
];
const CATEGORIES = ["Bestsellers", "Classics", "Custom"];

export default function CakesPage() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState("form"); // form | otp | done
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState(""); // shown only until a real SMS provider is wired up
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit Indian mobile number."); return; }
    setError(""); setBusy(true);
    const res = await fetch("/api/otp/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
    const data = await res.json();
    setBusy(false);
    if (data.ok) { setStep("otp"); setDevOtp(data.devOtp || ""); }
    else setError(data.error || "Could not send OTP.");
  }

  async function verifyAndSubmit() {
    setError(""); setBusy(true);
    const verifyRes = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp }) });
    const verifyData = await verifyRes.json();
    if (!verifyData.ok) { setBusy(false); setError("That code didn't match. Check and try again."); return; }

    const orderRes = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, cakeId: selected.id, cakeName: selected.name, date, address, notes }),
    });
    const orderData = await orderRes.json();
    setBusy(false);
    if (orderData.id) { setOrderId(orderData.id); setStep("done"); }
    else setError("Something went wrong placing the order. Please try again.");
  }

  return (
    <>
      <SiteHeader />
      <div className="container" style={{ padding: "48px 0 30px" }}>
        <span className="eyebrow">Our cakes</span>
        <h1 style={{ fontSize: 34, margin: "10px 0 30px" }}>Pick a cake, or tell us your own idea.</h1>

        {CATEGORIES.map(cat => (
          <div key={cat} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 19, marginBottom: 16 }}>{cat}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {CAKES.filter(c => c.category === cat).map(c => (
                <div key={c.id} className="card" style={{ padding: 20 }}>
                  <div style={{ height: 90, borderRadius: 10, background: "linear-gradient(135deg, var(--butter), var(--berry))", opacity: 0.85, marginBottom: 12 }} />
                  <h3 style={{ fontSize: 16, marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>{c.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span />
                    <button className="btn btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}
                      onClick={() => { setSelected(c); setStep("form"); setError(""); }}>
                      Order this
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(43,29,29,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 50 }}
          onClick={() => setSelected(null)}>
          <div className="card" style={{ maxWidth: 440, width: "100%", padding: 30 }} onClick={e => e.stopPropagation()}>
            {step === "form" && (
              <>
                <span className="eyebrow">Custom order request</span>
                <h2 style={{ fontSize: 22, margin: "8px 0 18px" }}>{selected.name}</h2>
                <Field label="Your name"><input value={name} onChange={e=>setName(e.target.value)} style={inputStyle} /></Field>
                <Field label="Mobile number"><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))} maxLength={10} placeholder="10-digit number" style={inputStyle} /></Field>
                <Field label="Delivery date"><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} /></Field>
                <Field label="Delivery address"><textarea value={address} onChange={e=>setAddress(e.target.value)} rows={2} style={{...inputStyle, resize:"vertical"}} /></Field>
                <Field label="Anything else? (message on cake, allergies, theme)"><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{...inputStyle, resize:"vertical"}} /></Field>
                {error && <p style={{ color: "var(--berry)", fontSize: 13, marginBottom: 10 }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
                  <button className="btn btn-primary" disabled={busy || !name || !phone || !date || !address} onClick={sendOtp}>
                    {busy ? "Sending code…" : "Verify phone & continue"}
                  </button>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                <span className="eyebrow">Verify your number</span>
                <h2 style={{ fontSize: 20, margin: "8px 0 6px" }}>Enter the 6-digit code</h2>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 16 }}>Sent to {phone}.
                  {devOtp && <> (Testing mode — no SMS provider connected yet, code is <strong>{devOtp}</strong>.)</>}
                </p>
                <Field label="Code"><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))} maxLength={6} style={inputStyle} /></Field>
                {error && <p style={{ color: "var(--berry)", fontSize: 13, marginBottom: 10 }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <button className="btn btn-ghost" onClick={() => setStep("form")}>Back</button>
                  <button className="btn btn-primary" disabled={busy || otp.length !== 6} onClick={verifyAndSubmit}>
                    {busy ? "Placing order…" : "Confirm order"}
                  </button>
                </div>
              </>
            )}

            {step === "done" && (
              <>
                <span className="eyebrow">Order placed</span>
                <h2 style={{ fontSize: 20, margin: "8px 0 10px" }}>Thank you, {name}!</h2>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 6 }}>Your order ID is:</p>
                <p style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{orderId}</p>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 18 }}>Save this ID to track your order's progress.</p>
                <button className="btn btn-primary" onClick={() => { setSelected(null); setStep("form"); setName(""); setPhone(""); setDate(""); setAddress(""); setNotes(""); setOtp(""); }}>Done</button>
              </>
            )}
          </div>
        </div>
      )}
      <SiteFooter />
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10,
  border: "1.5px solid var(--line)", fontSize: 14, fontFamily: "inherit",
};
