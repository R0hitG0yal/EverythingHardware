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

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json("UnAuthorized route!", {
        status: 401,
      });

    if (user.role !== "delivery") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deliveries = await prisma.delivery.update({
      where: {
        orderId: id,
        deliveryPersonId: user.id,
      },
      data: {
        status,
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
      { error: "Failed to update delivery status!", details: String(err) },
      { status: 400 }
    );
  }
}
