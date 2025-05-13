CREATE TABLE "company_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"industry" text NOT NULL,
	"description" text NOT NULL,
	"vision" text NOT NULL,
	"mission" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matrix_factors" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_profile_id" integer NOT NULL,
	"matrix_type" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"weight" real NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_profile_id" integer NOT NULL,
	"title" text NOT NULL,
	"ife_score" real,
	"efe_score" real,
	"ie_quadrant" text,
	"ie_strategy" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategies" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_profile_id" integer NOT NULL,
	"strategy_type" text NOT NULL,
	"content" text NOT NULL,
	"ai_model" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "swot_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_profile_id" integer NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"significance" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "matrix_factors" ADD CONSTRAINT "matrix_factors_company_profile_id_company_profiles_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_company_profile_id_company_profiles_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "strategies" ADD CONSTRAINT "strategies_company_profile_id_company_profiles_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "swot_items" ADD CONSTRAINT "swot_items_company_profile_id_company_profiles_id_fk" FOREIGN KEY ("company_profile_id") REFERENCES "public"."company_profiles"("id") ON DELETE no action ON UPDATE no action;