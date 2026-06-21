import { NextRequest, NextResponse } from "next/server";
// In production: import { PrismaClient } from "@prisma/client";
// In production: import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate Request header JWT token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    // const token = authHeader.split(" ")[1];
    // const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // 2. Fetch clients filtered by tenant context and optional branch filter query parameters
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branchId"); // "all" or specific uuid

    // const queryConditions: any = { tenantId: decoded.tenantId };
    // if (branchId && branchId !== "all") {
    //   queryConditions.branchId = branchId;
    // }
    
    // const clients = await prisma.client.findMany({
    //   where: queryConditions,
    //   orderBy: { createdAt: "desc" }
    // });

    return NextResponse.json({
      success: true,
      branchFilter: branchId || "all",
      data: [
        { id: "cli-1", clientId: "CA-CLI-1001", name: "Acme Tech Solutions Private Limited", mobile: "9123456780", email: "finance@acmetech.com", pan: "AABCA1234F", category: "PLATINUM", status: "ACTIVE" }
      ]
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    
    // In production:
    // const newClient = await prisma.client.create({
    //   data: {
    //     ...body,
    //     tenantId: decoded.tenantId,
    //     branchId: body.branchId,
    //   }
    // });

    return NextResponse.json({
      success: true,
      data: {
        id: "cli-new-uuid",
        ...body,
        createdAt: new Date().toISOString()
      }
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
