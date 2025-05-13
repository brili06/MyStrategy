import { NextResponse } from "next/server";
import { db } from "@/db";
import { companyProfiles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET all company profiles
export async function GET() {
  try {
    const profiles = await db.select().from(companyProfiles).orderBy(desc(companyProfiles.createdAt));
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching company profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch company profiles" },
      { status: 500 }
    );
  }
}

// POST a new company profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, industry, description, vision, mission } = body;

    if (!name || !industry || !description || !vision || !mission) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newProfile = await db.insert(companyProfiles)
      .values({
        name,
        industry,
        description,
        vision,
        mission,
        updatedAt: new Date()
      })
      .returning();

    return NextResponse.json(newProfile[0]);
  } catch (error) {
    console.error("Error creating company profile:", error);
    return NextResponse.json(
      { error: "Failed to create company profile" },
      { status: 500 }
    );
  }
}
