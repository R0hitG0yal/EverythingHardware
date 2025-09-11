// | `DELETE` | `/api/reviews/:id`          | (Admin/User) Delete review       |

import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);

    if (!user || !("id" in user) || !("role" in user))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);
    if (!id || Number.isNaN(id))
      return NextResponse.json({ error: "Invalid review id" }, { status: 400 });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (user.role !== "admin" && review.userId !== user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ message: "Review deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete review", details: String(err) },
      { status: 400 }
    );
  }
}
