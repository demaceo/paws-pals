import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const inquiries = await prisma.inquiry.findMany({
    include: {
      dog: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const payload = inquiries.map((inquiry) => ({
    id: inquiry.id,
    dogId: inquiry.dogId,
    dogName: inquiry.dogName || inquiry.dog?.name || "Unknown dog",
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    message: inquiry.message,
    locale: inquiry.locale,
    createdAt: inquiry.createdAt.toISOString(),
  }));

  return NextResponse.json(payload);
}
