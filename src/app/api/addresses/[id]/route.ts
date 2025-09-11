import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const { addressLine, city, pincode, state, landmark, isDefault } =
      await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Extract id from the URL pathname
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);

      if (user && typeof user === "object") {
        const address = await prisma.address.upsert({
          where: {
            id: Number(id),
          },
          update: {
            userId: user.id,
            addressLine,
            city,
            pincode,
            state,
            landmark,
            isDefault,
          },
          create: {
            userId: user.id,
            addressLine,
            city,
            pincode,
            state,
            landmark,
            isDefault,
          },
        });

        if (!address)
          return new Response(JSON.stringify("Failed to update data!"), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          });

        return new Response(JSON.stringify(address), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify(`Error: ${error}`), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);

      if (user && typeof user === "object") {
        const address = await prisma.address.delete({
          where: {
            id: Number(id),
          },
        });

        return new Response(JSON.stringify({ "Deletion Success": address }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  } catch (err) {
    return new Response(JSON.stringify({ Error: err }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
