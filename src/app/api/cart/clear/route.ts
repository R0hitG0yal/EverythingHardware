import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user || !("id" in user))
      return NextResponse.json({ Error: "Invalid User!" }, { status: 401 });
    const cart = await prisma.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(cart, { status: 200 });
  } catch (err) {
    return NextResponse.json({ Error: err }, { status: 401 });
  }
}
