import { NextResponse } from "next/server";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET reports for a company profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyProfileId = searchParams.get('companyProfileId');
    
    if (!companyProfileId) {
      return NextResponse.json(
        { error: "Company profile ID is required" },
        { status: 400 }
      );
    }

    const result = await db.select()
      .from(reports)
      .where(eq(reports.companyProfileId, parseInt(companyProfileId)))
      .orderBy(desc(reports.createdAt));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

// POST a new report
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, title, ifeScore, efeScore, ieQuadrant, ieStrategy } = body;

    if (!companyProfileId || !title) {
      return NextResponse.json(
        { error: "Company profile ID and title are required" },
        { status: 400 }
      );
    }

    const newReport = await db.insert(reports)
      .values({
        companyProfileId: parseInt(companyProfileId),
        title,
        ifeScore: ifeScore !== undefined ? ifeScore : null,
        efeScore: efeScore !== undefined ? efeScore : null,
        ieQuadrant: ieQuadrant || null,
        ieStrategy: ieStrategy || null
      })
      .returning();

    return NextResponse.json(newReport[0]);
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
