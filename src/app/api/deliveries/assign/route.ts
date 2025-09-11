// | `GET`  | `/api/deliveries`            | (Admin/Delivery) Get deliveries assigned                |

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const { orderId, deliveryPersonId } = await req.json();

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json("UnAuthorized route!", {
        status: 401,
      });

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deliveries = await prisma.delivery.update({
      where: {
        orderId,
      },
      data: {
        deliveryPersonId,
      },
      include: {
        order: {
          include: {
            items: { include: { product: true } },
            address: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json(deliveries, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to assign deliveries", details: String(err) },
      { status: 400 }
    );
  }
}
