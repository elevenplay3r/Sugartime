import { cookies } from "next/headers";

// Password lives only in an environment variable (set this in Vercel →
// Settings → Environment Variables as ADMIN_PASSWORD), never in the code —
// this is the same lesson learned the hard way on the TExcellence project,
// applied here from the start instead of needing a later fix.
export async function POST(req) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: false, error: "Admin password not configured." }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ ok: false }, { status: 401 });
  }
  cookies().set("admin_session", "1", {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 8, path: "/",
  });
  return Response.json({ ok: true });
}
