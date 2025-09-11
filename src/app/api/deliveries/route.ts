// | `GET`  | `/api/deliveries`            | (Admin/Delivery) Get deliveries assigned                |

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json("UnAuthorized route!", {
        status: 401,
      });

    if (user.role !== "admin" && user.role !== "delivery") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Optional query: delivered=true to include delivered; default shows pending only
    const { searchParams } = new URL(req.url);
    const includeDelivered = searchParams.get("delivered") === "true";

    const deliveries = await prisma.delivery.findMany({
      where: {
        ...(includeDelivered ? {} : { deliveredAt: null }),
        ...(user.role === "delivery" ? { deliveryPersonId: user.id } : {}),
      },
      orderBy: [{ deliveredAt: "asc" }, { assignedAt: "desc" }],
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
      { error: "Failed to fetch deliveries", details: String(err) },
      { status: 400 }
    );
  }
}
