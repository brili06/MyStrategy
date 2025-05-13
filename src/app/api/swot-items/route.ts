import { NextResponse } from "next/server";
import { db } from "@/db";
import { swotItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET all SWOT items for a company profile
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

    const items = await db.select()
      .from(swotItems)
      .where(eq(swotItems.companyProfileId, parseInt(companyProfileId)))
      .orderBy(desc(swotItems.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching SWOT items:", error);
    return NextResponse.json(
      { error: "Failed to fetch SWOT items" },
      { status: 500 }
    );
  }
}

// POST a new SWOT item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, category, description, significance } = body;

    if (!companyProfileId || !category || !description) {
      return NextResponse.json(
        { error: "Company profile ID, category, and description are required" },
        { status: 400 }
      );
    }

    // Validate category
    if (!['strength', 'weakness', 'opportunity', 'threat'].includes(category)) {
      return NextResponse.json(
        { error: "Category must be one of: strength, weakness, opportunity, threat" },
        { status: 400 }
      );
    }

    const newItem = await db.insert(swotItems)
      .values({
        companyProfileId: parseInt(companyProfileId),
        category,
        description,
        significance
      })
      .returning();

    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("Error creating SWOT item:", error);
    return NextResponse.json(
      { error: "Failed to create SWOT item" },
      { status: 500 }
    );
  }
}

// POST multiple SWOT items at once
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, items } = body;

    if (!companyProfileId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Company profile ID and items array are required" },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (!item.category || !item.description) {
        return NextResponse.json(
          { error: "Each item must have a category and description" },
          { status: 400 }
        );
      }

      if (!['strength', 'weakness', 'opportunity', 'threat'].includes(item.category)) {
        return NextResponse.json(
          { error: "Category must be one of: strength, weakness, opportunity, threat" },
          { status: 400 }
        );
      }
    }

    // First delete existing items for this company profile
    await db.delete(swotItems)
      .where(eq(swotItems.companyProfileId, parseInt(companyProfileId)));

    // Then insert all new items
    const newItems = await db.insert(swotItems)
      .values(
        items.map(item => ({
          companyProfileId: parseInt(companyProfileId),
          category: item.category,
          description: item.description,
          significance: item.significance || null
        }))
      )
      .returning();

    return NextResponse.json(newItems);
  } catch (error) {
    console.error("Error updating SWOT items:", error);
    return NextResponse.json(
      { error: "Failed to update SWOT items" },
      { status: 500 }
    );
  }
}
