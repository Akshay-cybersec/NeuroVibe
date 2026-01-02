import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );
  }

  const client = await clerkClient();

  const response = await client.users.getUserList({
    emailAddress: [email],
  });

  const users = response.data;

  if (users.length === 0) {
    return NextResponse.json({ exists: false });
  }

  const user = users[0];

  return NextResponse.json({
    exists: true,
    user: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName || user.username,
      photo: user.imageUrl,
    },
  });
}
