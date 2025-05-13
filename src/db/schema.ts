import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  real, 
  json,
  primaryKey
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Company Profiles table
export const companyProfiles = pgTable('company_profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  description: text('description').notNull(),
  vision: text('vision').notNull(),
  mission: text('mission').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// SWOT Items table
export const swotItems = pgTable('swot_items', {
  id: serial('id').primaryKey(),
  companyProfileId: integer('company_profile_id').notNull().references(() => companyProfiles.id),
  category: text('category').notNull(), // 'strength', 'weakness', 'opportunity', 'threat'
  description: text('description').notNull(),
  significance: text('significance'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Matrix Factors table
export const matrixFactors = pgTable('matrix_factors', {
  id: serial('id').primaryKey(),
  companyProfileId: integer('company_profile_id').notNull().references(() => companyProfiles.id),
  matrixType: text('matrix_type').notNull(), // 'ife', 'efe'
  category: text('category').notNull(), // 'strength', 'weakness', 'opportunity', 'threat'
  description: text('description').notNull(),
  weight: real('weight').notNull(),
  rating: integer('rating').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Strategies table
export const strategies = pgTable('strategies', {
  id: serial('id').primaryKey(),
  companyProfileId: integer('company_profile_id').notNull().references(() => companyProfiles.id),
  strategyType: text('strategy_type').notNull(), // 'SO', 'ST', 'WO', 'WT', 'prioritized'
  content: text('content').notNull(),
  aiModel: text('ai_model'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  companyProfileId: integer('company_profile_id').notNull().references(() => companyProfiles.id),
  title: text('title').notNull(),
  ifeScore: real('ife_score'),
  efeScore: real('efe_score'),
  ieQuadrant: text('ie_quadrant'),
  ieStrategy: text('ie_strategy'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Define types for select and insert operations
export type CompanyProfile = InferSelectModel<typeof companyProfiles>;
export type NewCompanyProfile = InferInsertModel<typeof companyProfiles>;

export type SwotItem = InferSelectModel<typeof swotItems>;
export type NewSwotItem = InferInsertModel<typeof swotItems>;

export type MatrixFactor = InferSelectModel<typeof matrixFactors>;
export type NewMatrixFactor = InferInsertModel<typeof matrixFactors>;

export type Strategy = InferSelectModel<typeof strategies>;
export type NewStrategy = InferInsertModel<typeof strategies>;

export type Report = InferSelectModel<typeof reports>;
export type NewReport = InferInsertModel<typeof reports>;
