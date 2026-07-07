import { getOrder, updateOrderStatus } from "../../../../lib/db";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  const order = await getOrder(params.id);
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json(order);
}

export async function PATCH(req, { params }) {
  if (cookies().get("admin_session")?.value !== "1") {
    return Response.json({ error: "Not authorized." }, { status: 401 });
  }
  const { status } = await req.json();
  const ALLOWED = ["requested", "confirmed", "baking", "ready", "delivered"];
  if (!ALLOWED.includes(status)) {
    return Response.json({ error: "Invalid status." }, { status: 400 });
  }
  const order = await updateOrderStatus(params.id, status);
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  return Response.json(order);
}
