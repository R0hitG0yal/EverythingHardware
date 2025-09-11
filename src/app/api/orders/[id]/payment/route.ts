// | `PUT`  | `/api/orders/:id/payment` | Update payment status (paid/unpaid)                   |

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

    if (!user || !("role" in user) || !("id" in user))
      return NextResponse.json("Please SignIn!", { status: 401 });

    if (!id || Number.isNaN(id))
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const { paymentStatus, paymentMethod } = await req.json();

    const allowedStatuses = ["paid", "unpaid", "failed"] as const;
    if (!allowedStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: "Invalid paymentStatus. Use 'paid' or 'unpaid'" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Authorization: customers can only update their own order
    if (user.role !== "admin" && order.userId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Business rules:
    // - Customers can only mark their own orders as 'paid'. They cannot set to 'unpaid'.
    // - Only admin can set to 'unpaid' or change already paid orders back to unpaid.
    if (user.role !== "admin") {
      if (paymentStatus !== "paid") {
        return NextResponse.json(
          { error: "Customers can only mark payment as 'paid'" },
          { status: 403 }
        );
      }
    }

    if (
      order.paymentStatus === "paid" &&
      paymentStatus === "unpaid" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Only admin can revert a paid order to unpaid" },
        { status: 403 }
      );
    }

    if (
      order.paymentStatus === paymentStatus &&
      (!paymentMethod || paymentMethod === order.paymentMethod)
    ) {
      return NextResponse.json(order, { status: 200 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        ...(paymentMethod ? { paymentMethod } : {}),
      },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update payment status", details: String(err) },
      { status: 400 }
    );
  }
}
