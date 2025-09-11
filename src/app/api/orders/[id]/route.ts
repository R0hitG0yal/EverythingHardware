import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// | `GET`  | `/api/orders/:id`         | Get order details                                     |

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);
    const id = Number(params.id);

    if (!user || !("role" in user) || !("id" in user))
      return NextResponse.json("Please SignIn!", { status: 401 });

    if (!id || Number.isNaN(id))
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    // Fetch order with items + product
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Authorization: customers can only access their own orders; admins can access all
    if (user.role !== "admin" && order.userId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch order", details: String(err) },
      { status: 400 }
    );
  }
}
