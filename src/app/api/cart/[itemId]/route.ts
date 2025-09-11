// PUT	/api/cart/:itemId	Update quantity of cart item
// DELETE	/api/cart/:itemId	Remove item from cart

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { quantity } = await req.json();
    const url = new URL(req.url);
    const itemId = url.pathname.split("/").pop();

    if (!itemId || !quantity || quantity < 0) {
      return NextResponse.json(
        { error: "Invalid itemId or quantity" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser(req);

    if (!user || !("id" in user))
      return NextResponse.json("Invalid User Credentials!", { status: 401 });

    // Find the cart item and verify it belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cart: {
          userId: user.id,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Update the quantity
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: Number(itemId),
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const itemId = url.pathname.split("/").pop();

    if (!itemId) {
      return NextResponse.json({ error: "Invalid itemId" }, { status: 400 });
    }

    const user = await getCurrentUser(req);

    if (!user || !("id" in user))
      return NextResponse.json("Invalid User Credentials!", { status: 401 });

    // Find the cart item and verify it belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cart: {
          userId: user.id,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: Number(itemId),
      },
    });

    return NextResponse.json({ message: "Cart item removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
