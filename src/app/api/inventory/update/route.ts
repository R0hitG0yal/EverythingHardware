// POST	/api/inventory/update	(Admin) Adjust stock { productId, change, reason }

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const { productId, change, reason } = await req.json();

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const pid = Number(productId);
    const delta = Number(change);
    if (!pid || Number.isNaN(pid) || Number.isNaN(delta) || !Number.isInteger(delta)) {
      return NextResponse.json({ error: "Invalid productId or change" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: pid } });
      if (!product) {
        throw new Error("Product not found");
      }

      const newStock = product.stock + delta;
      if (newStock < 0) {
        throw new Error("Stock cannot be negative");
      }

      const updatedProduct = await tx.product.update({
        where: { id: pid },
        data: { stock: newStock },
      });

      const log = await tx.inventoryLog.create({
        data: {
          productId: pid,
          change: delta,
          reason: reason ?? null,
        },
      });

      return { updatedProduct, log };
    });

    return NextResponse.json(
      { data: result.updatedProduct, log: result.log },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update inventory", details: String(err) },
      { status: 400 }
    );
  }
}
