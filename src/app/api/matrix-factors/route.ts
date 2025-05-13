import { NextResponse } from "next/server";
import { db } from "@/db";
import { matrixFactors } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

// GET matrix factors for a company profile and matrix type
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyProfileId = searchParams.get('companyProfileId');
    const matrixType = searchParams.get('matrixType');
    
    if (!companyProfileId || !matrixType) {
      return NextResponse.json(
        { error: "Company profile ID and matrix type are required" },
        { status: 400 }
      );
    }

    // Validate matrix type
    if (!['ife', 'efe'].includes(matrixType)) {
      return NextResponse.json(
        { error: "Matrix type must be either 'ife' or 'efe'" },
        { status: 400 }
      );
    }

    const factors = await db.select()
      .from(matrixFactors)
      .where(
        and(
          eq(matrixFactors.companyProfileId, parseInt(companyProfileId)),
          eq(matrixFactors.matrixType, matrixType)
        )
      )
      .orderBy(desc(matrixFactors.createdAt));

    return NextResponse.json(factors);
  } catch (error) {
    console.error("Error fetching matrix factors:", error);
    return NextResponse.json(
      { error: "Failed to fetch matrix factors" },
      { status: 500 }
    );
  }
}

// POST a new matrix factor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, matrixType, category, description, weight, rating } = body;

    if (!companyProfileId || !matrixType || !category || !description || weight === undefined || rating === undefined) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate matrix type
    if (!['ife', 'efe'].includes(matrixType)) {
      return NextResponse.json(
        { error: "Matrix type must be either 'ife' or 'efe'" },
        { status: 400 }
      );
    }

    // Validate category based on matrix type
    if (matrixType === 'ife' && !['strength', 'weakness'].includes(category)) {
      return NextResponse.json(
        { error: "For IFE matrix, category must be either 'strength' or 'weakness'" },
        { status: 400 }
      );
    }

    if (matrixType === 'efe' && !['opportunity', 'threat'].includes(category)) {
      return NextResponse.json(
        { error: "For EFE matrix, category must be either 'opportunity' or 'threat'" },
        { status: 400 }
      );
    }

    // Validate weight and rating
    if (weight < 0 || weight > 1) {
      return NextResponse.json(
        { error: "Weight must be between 0 and 1" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 4 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 4" },
        { status: 400 }
      );
    }

    const newFactor = await db.insert(matrixFactors)
      .values({
        companyProfileId: parseInt(companyProfileId),
        matrixType,
        category,
        description,
        weight,
        rating
      })
      .returning();

    return NextResponse.json(newFactor[0]);
  } catch (error) {
    console.error("Error creating matrix factor:", error);
    return NextResponse.json(
      { error: "Failed to create matrix factor" },
      { status: 500 }
    );
  }
}

// PUT (update) multiple matrix factors at once
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { companyProfileId, matrixType, factors } = body;

    if (!companyProfileId || !matrixType || !factors || !Array.isArray(factors)) {
      return NextResponse.json(
        { error: "Company profile ID, matrix type, and factors array are required" },
        { status: 400 }
      );
    }

    // Validate matrix type
    if (!['ife', 'efe'].includes(matrixType)) {
      return NextResponse.json(
        { error: "Matrix type must be either 'ife' or 'efe'" },
        { status: 400 }
      );
    }

    // Validate each factor
    for (const factor of factors) {
      if (!factor.category || !factor.description || factor.weight === undefined || factor.rating === undefined) {
        return NextResponse.json(
          { error: "Each factor must have category, description, weight, and rating" },
          { status: 400 }
        );
      }

      // Validate category based on matrix type
      if (matrixType === 'ife' && !['strength', 'weakness'].includes(factor.category)) {
        return NextResponse.json(
          { error: "For IFE matrix, category must be either 'strength' or 'weakness'" },
          { status: 400 }
        );
      }

      if (matrixType === 'efe' && !['opportunity', 'threat'].includes(factor.category)) {
        return NextResponse.json(
          { error: "For EFE matrix, category must be either 'opportunity' or 'threat'" },
          { status: 400 }
        );
      }

      // Validate weight and rating
      if (factor.weight < 0 || factor.weight > 1) {
        return NextResponse.json(
          { error: "Weight must be between 0 and 1" },
          { status: 400 }
        );
      }

      if (factor.rating < 1 || factor.rating > 4 || !Number.isInteger(factor.rating)) {
        return NextResponse.json(
          { error: "Rating must be an integer between 1 and 4" },
          { status: 400 }
        );
      }
    }

    // First delete existing factors for this company profile and matrix type
    await db.delete(matrixFactors)
      .where(
        and(
          eq(matrixFactors.companyProfileId, parseInt(companyProfileId)),
          eq(matrixFactors.matrixType, matrixType)
        )
      );

    // Then insert all new factors
    const newFactors = await db.insert(matrixFactors)
      .values(
        factors.map(factor => ({
          companyProfileId: parseInt(companyProfileId),
          matrixType,
          category: factor.category,
          description: factor.description,
          weight: factor.weight,
          rating: factor.rating
        }))
      )
      .returning();

    return NextResponse.json(newFactors);
  } catch (error) {
    console.error("Error updating matrix factors:", error);
    return NextResponse.json(
      { error: "Failed to update matrix factors" },
      { status: 500 }
    );
  }
}
