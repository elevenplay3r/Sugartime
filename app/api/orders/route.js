import { createOrder, getAllOrders } from "../../../lib/db";
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();
  if (!body.name || !body.phone || !body.cakeId) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }
  const order = await createOrder(body);
  return Response.json(order);
}

export async function GET() {
  // Full order list is admin-only — customers look up one order at a time
  // by ID through /api/orders/[id] instead, which needs no login.
  if (cookies().get("admin_session")?.value !== "1") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  const orders = await getAllOrders();
  return Response.json(orders);
}
