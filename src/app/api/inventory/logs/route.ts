import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize") ?? 20))
    );
    const productId = searchParams.get("productId");
    const from = searchParams.get("from"); // ISO date
    const to = searchParams.get("to"); // ISO date

    type WhereClause = {
      productId?: number;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    };

    const where: WhereClause = {};
    if (productId) where.productId = Number(productId);
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { product: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.inventoryLog.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: logs,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch inventory logs", details: String(err) },
      { status: 500 }
    );
  }
}
