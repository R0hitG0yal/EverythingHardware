// | `PUT`  | `/api/orders/:id/status`  | (Admin) Update status (pending → shipped → delivered) |

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);
    const id = Number(params.id);
    const { status } = await req.json();

    if (!user || !("role" in user) || !("id" in user))
      return NextResponse.json("Please SignIn!", { status: 401 });

    if (!id || Number.isNaN(id))
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    if (user.role != "admin")
      return NextResponse.json("Unauthorized to make desired changes!", {
        status: 401,
      });

    // Fetch order with items + product
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
    });

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Authorization: customers can only access their own orders; admins can access all
    if (user.role !== "admin" && order.userId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(order.status, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch order status", details: String(err) },
      { status: 400 }
    );
  }
}
