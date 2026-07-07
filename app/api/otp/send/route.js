import { setOtp } from "../../../../lib/db";

// A real deployment needs an SMS provider here (MSG91, Twilio, 2Factor are
// common choices for Indian phone numbers) to actually text the code to the
// customer's phone. Until that's wired up, the code is returned directly in
// the response as `devOtp` so the whole flow can be tested end to end
// without paying for SMS. Remove `devOtp` from the response the moment a
// real SMS provider is connected — returning the code in the API response
// would let anyone log in as anyone else.
export async function POST(req) {
  const { phone } = await req.json();
  if (!/^[6-9]\d{9}$/.test(phone || "")) {
    return Response.json({ ok: false, error: "Invalid phone number." }, { status: 400 });
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await setOtp(phone, code);

  // --- REAL SMS PROVIDER (example shape, adjust to whichever you pick) ---
  // await fetch("https://api.msg91.com/api/v5/otp", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", authkey: process.env.MSG91_AUTH_KEY },
  //   body: JSON.stringify({ mobile: `91${phone}`, otp: code }),
  // });

  return Response.json({ ok: true, devOtp: code }); // delete devOtp once SMS is live
}
