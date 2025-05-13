import { NextResponse } from "next/server";
import { db } from "@/db";
import { companyProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET a specific company profile
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const profile = await db.select()
      .from(companyProfiles)
      .where(eq(companyProfiles.id, id));

    if (!profile.length) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}

// PUT (update) a company profile
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, industry, description, vision, mission } = body;

    if (!name || !industry || !description || !vision || !mission) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedProfile = await db.update(companyProfiles)
      .set({
        name,
        industry,
        description,
        vision,
        mission,
        updatedAt: new Date()
      })
      .where(eq(companyProfiles.id, id))
      .returning();

    if (!updatedProfile.length) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProfile[0]);
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      { error: "Failed to update company profile" },
      { status: 500 }
    );
  }
}

// DELETE a company profile
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const deletedProfile = await db.delete(companyProfiles)
      .where(eq(companyProfiles.id, id))
      .returning();

    if (!deletedProfile.length) {
      return NextResponse.json(
        { error: "Company profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Company profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting company profile:", error);
    return NextResponse.json(
      { error: "Failed to delete company profile" },
      { status: 500 }
    );
  }
}
