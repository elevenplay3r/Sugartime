import { checkOtp } from "../../../../lib/db";

export async function POST(req) {
  const { phone, otp } = await req.json();
  const valid = await checkOtp(phone, otp);
  return Response.json({ ok: !!valid });
}
