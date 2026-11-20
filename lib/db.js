// lib/db.js
//
// HOW THIS WORKS RIGHT NOW: everything lives in a plain in-memory array, so
// you can run this locally and see it work before any real database exists.
// A word on why that's temporary: Vercel runs your site as separate,
// short-lived "serverless functions" (small bits of server code that spin
// up per request and then disappear) — so anything stored only in memory
// gets wiped constantly and won't be shared between visitors. This file is
// deliberately the ONLY place that needs to change when you're ready to
// wire up a real database — every real Supabase call is already written
// below as a comment, ready to uncomment.
//
// TO GO LIVE:
//   1. Create a free Supabase project (supabase.com) — same tool the
//      TExcellence project uses.
//   2. Create two tables: `orders` and `otp_codes` (columns implied by the
//      fields used below).
//   3. Add SUPABASE_URL and SUPABASE_ANON_KEY as environment variables in
//      Vercel (never hardcode them in the file — see the reset-password
//      lesson from the other project).
//   4. Uncomment the real fetch calls in each function below and delete the
//      in-memory version sitting above each one.

let ORDERS = []; // in-memory only — resets on every deploy/restart
let OTP_CODES = {}; // phone -> { code, expiresAt }
let nextId = 1;

export async function createOrder(order) {
  const row = { id: String(nextId++), status: "requested", createdAt: new Date().toISOString(), ...order };
  ORDERS.push(row);
  return row;

  // --- REAL SUPABASE VERSION ---
  // const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     apikey: process.env.SUPABASE_ANON_KEY,
  //     Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
  //     Prefer: "return=representation",
  //   },
  //   body: JSON.stringify({ status: "requested", ...order }),
  // });
  // const [row] = await res.json();
  // return row;
}

export async function getOrder(id) {
  return ORDERS.find(o => o.id === id) || null;

  // --- REAL SUPABASE VERSION ---
  // const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
  //   headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
  // });
  // const rows = await res.json();
  // return rows[0] || null;
}

export async function getOrdersByPhone(phone) {
  return ORDERS.filter(o => o.phone === phone);

  // --- REAL SUPABASE VERSION ---
  // const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders?phone=eq.${encodeURIComponent(phone)}`, {
  //   headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
  // });
  // return res.json();
}

export async function getAllOrders() {
  return [...ORDERS].reverse();

  // --- REAL SUPABASE VERSION ---
  // const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders?order=created_at.desc`, {
  //   headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
  // });
  // return res.json();
}

export async function updateOrderStatus(id, status) {
  const order = ORDERS.find(o => o.id === id);
  if (order) order.status = status;
  return order;

  // --- REAL SUPABASE VERSION ---
  // await fetch(`${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //     apikey: process.env.SUPABASE_ANON_KEY,
  //     Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
  //   },
  //   body: JSON.stringify({ status }),
  // });
}

// --- OTP (One-Time Password) helpers ---
// A real deployment needs an SMS provider to actually text the code —
// options popular in India include MSG91, Twilio, or 2Factor. Until one is
// wired up, the code is simply returned in the API response so you can test
// the flow end to end without paying for SMS yet.
export async function setOtp(phone, code) {
  OTP_CODES[phone] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };
}

export async function checkOtp(phone, code) {
  const entry = OTP_CODES[phone];
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  return entry.code === code;
}

// Starter cake catalog — replace with real products/photos.
export const CAKES = [
  { id: "c1", name: "Classic Red Velvet", desc: "Layered red velvet with cream cheese frosting.", category: "Bestsellers" },
  { id: "c2", name: "Belgian Chocolate Truffle", desc: "Dark chocolate sponge, ganache, truffle shavings.", category: "Bestsellers" },
  { id: "c3", name: "Fresh Fruit Cream", desc: "Vanilla sponge, whipped cream, seasonal fruit.", category: "Classics" },
  { id: "c4", name: "Black Forest", desc: "Chocolate sponge, cherries, whipped cream.", category: "Classics" },
  { id: "c5", name: "Custom Photo Cake", desc: "Edible print of your own photo, any flavour base.", category: "Custom" },
  { id: "c6", name: "Custom Theme Cake", desc: "Fully custom design — tell us the occasion.", category: "Custom" },
];
