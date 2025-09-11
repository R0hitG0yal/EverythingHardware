import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// | `GET`    | `/api/products/:id/reviews` | Get reviews for product          |
// | `POST`   | `/api/products/:id/reviews` | Add review `{ rating, comment }` |

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);
    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count({ where: { productId } }),
    ]);

    return NextResponse.json(
      { data: reviews, page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(req);
    if (!user || !("id" in user))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const productId = Number(params.id);
    if (!productId || Number.isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const { rating, comment } = await req.json();
    const parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating must be an integer 1-5" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // If the user already reviewed this product, update; otherwise create
    const existing = await prisma.review.findFirst({ where: { productId, userId: user.id } });

    const review = existing
      ? await prisma.review.update({
          where: { id: existing.id },
          data: { rating: parsedRating, comment: comment ?? null },
          include: { user: { select: { id: true, name: true } } },
        })
      : await prisma.review.create({
          data: { productId, userId: user.id, rating: parsedRating, comment: comment ?? null },
          include: { user: { select: { id: true, name: true } } },
        });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to submit review", details: String(err) },
      { status: 400 }
    );
  }
}
