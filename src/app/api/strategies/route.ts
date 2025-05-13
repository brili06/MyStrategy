import { NextResponse } from "next/server";
import { db } from "@/db";
import { strategies } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

// GET strategies for a company profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyProfileId = searchParams.get('companyProfileId');
    const strategyType = searchParams.get('strategyType');
    
    if (!companyProfileId) {
      return NextResponse.json(
        { error: "Company profile ID is required" },
        { status: 400 }
      );
    }

    let query = db.select()
      .from(strategies)
      .where(eq(strategies.companyProfileId, parseInt(companyProfileId)));

    // Filter by strategy type if provided
    if (strategyType) {
      if (!['SO', 'ST', 'WO', 'WT', 'prioritized'].includes(strategyType)) {
        return NextResponse.json(
          { error: "Strategy type must be one of: SO, ST, WO, WT, prioritized" },
          { status: 400 }
        );
      }
      
      query = db.select()
        .from(strategies)
        .where(
          and(
            eq(strategies.companyProfileId, parseInt(companyProfileId)),
            eq(strategies.strategyType, strategyType)
          )
        );
    }

    const result = await query.orderBy(desc(strategies.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return NextResponse.json(
      { error: "Failed to fetch strategies" },
      { status: 500 }
    );
  }
}

// POST a new strategy
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, strategyType, content, aiModel } = body;

    if (!companyProfileId || !strategyType || !content) {
      return NextResponse.json(
        { error: "Company profile ID, strategy type, and content are required" },
        { status: 400 }
      );
    }

    // Validate strategy type
    if (!['SO', 'ST', 'WO', 'WT', 'prioritized'].includes(strategyType)) {
      return NextResponse.json(
        { error: "Strategy type must be one of: SO, ST, WO, WT, prioritized" },
        { status: 400 }
      );
    }

    const newStrategy = await db.insert(strategies)
      .values({
        companyProfileId: parseInt(companyProfileId),
        strategyType,
        content,
        aiModel
      })
      .returning();

    return NextResponse.json(newStrategy[0]);
  } catch (error) {
    console.error("Error creating strategy:", error);
    return NextResponse.json(
      { error: "Failed to create strategy" },
      { status: 500 }
    );
  }
}

// PUT (update) multiple strategies of a specific type
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, strategyType, strategies: strategyItems, aiModel } = body;

    if (!companyProfileId || !strategyType || !strategyItems || !Array.isArray(strategyItems)) {
      return NextResponse.json(
        { error: "Company profile ID, strategy type, and strategies array are required" },
        { status: 400 }
      );
    }

    // Validate strategy type
    if (!['SO', 'ST', 'WO', 'WT', 'prioritized'].includes(strategyType)) {
      return NextResponse.json(
        { error: "Strategy type must be one of: SO, ST, WO, WT, prioritized" },
        { status: 400 }
      );
    }

    // Validate each strategy
    for (const strategy of strategyItems) {
      if (!strategy.content) {
        return NextResponse.json(
          { error: "Each strategy must have content" },
          { status: 400 }
        );
      }
    }

    // First delete existing strategies for this company profile and strategy type
    await db.delete(strategies)
      .where(
        and(
          eq(strategies.companyProfileId, parseInt(companyProfileId)),
          eq(strategies.strategyType, strategyType)
        )
      );

    // Then insert all new strategies
    const newStrategies = await db.insert(strategies)
      .values(
        strategyItems.map(strategy => ({
          companyProfileId: parseInt(companyProfileId),
          strategyType,
          content: strategy.content,
          aiModel
        }))
      )
      .returning();

    return NextResponse.json(newStrategies);
  } catch (error) {
    console.error("Error updating strategies:", error);
    return NextResponse.json(
      { error: "Failed to update strategies" },
      { status: 500 }
    );
  }
}
