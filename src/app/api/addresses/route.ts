// | Method   | Endpoint             | Description           | Body / Params                         |
// | -------- | -------------------- | --------------------- | ------------------------------------- |
// | `GET`    | `/api/addresses`     | List user’s addresses | Auth                                  |
// | `POST`   | `/api/addresses`     | Add new address       | `{ addressLine, city, pincode, ... }` |
// | `PUT`    | `/api/addresses/:id` | Update address        | —                                     |
// | `DELETE` | `/api/addresses/:id` | Delete address        | —                                     |

import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);

      if (user && typeof user === "object") {
        const address = await prisma.address.findMany({
          where: {
            userId: user.id,
          },
        });

        if (!address || address.length == 0)
          return new Response(
            JSON.stringify("No Addresses Present for the User!"),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

        return new Response(JSON.stringify(address), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
  } catch (error) {
    return new Response(JSON.stringify(`Invalid Token! Error: ${error}`), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function POST(req: Request) {
  try {
    const { addressLine, city, pincode, state, landmark, isDefault } =
      await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);

      if (user && typeof user === "object") {
        const address = await prisma.address.create({
          data: {
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
          return new Response(
            JSON.stringify("No Addresses Present for the User!"),
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

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