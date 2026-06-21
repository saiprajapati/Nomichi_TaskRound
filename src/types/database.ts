// Hand-written types that mirror supabase/migrations/0001_init.sql.
// If you have the Supabase CLI, you can replace this with generated types via:
//   supabase gen types typescript --project-id <id> > src/types/database.ts
// Kept hand-written here so the schema is easy to read alongside the SQL.
//
// NOTE: these are deliberately `type` aliases, not `interface`s. With the
// current @supabase/supabase-js + @supabase/ssr version pair, using an
// `interface` for a table's Row/Insert/Update breaks the library's generic
// Schema resolution and silently collapses query results to `never`. Plain
// object type aliases resolve correctly, so that is what every shape feeding
// into `Database` below uses.

export type TripStatus = "open" | "closed";

export type GroupType = "solo" | "friends" | "couple" | "family";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "vibe_check_sent"
  | "confirmed"
  | "not_a_fit";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "vibe_check_sent",
  "confirmed",
  "not_a_fit",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  vibe_check_sent: "Vibe check sent",
  confirmed: "Confirmed",
  not_a_fit: "Not a fit",
};

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  solo: "Solo",
  friends: "Friends",
  couple: "Couple",
  family: "Family",
};

export type Trip = {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  price_inr_gst: number;
  total_seats: number;
  status: TripStatus;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  trip_id: string | null;
  group_type: GroupType;
  preferred_month: string;
  trip_feeling: string;
  status: LeadStatus;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadWithRelations = Lead & {
  trip: Pick<Trip, "id" | "name" | "destination"> | null;
  owner: Pick<TeamMember, "id" | "full_name"> | null;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  author_id: string | null;
  body: string;
  next_action: string | null;
  created_at: string;
  author?: Pick<TeamMember, "id" | "full_name"> | null;
};

export type LeadStatusEvent = {
  id: string;
  lead_id: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus;
  changed_by: string | null;
  created_at: string;
};

// Plain object type aliases for Insert/Update (no Partial<T>, no
// intersections) — see the note at the top of this file for why.
type TripInsert = {
  id?: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  price_inr_gst: number;
  total_seats: number;
  status?: TripStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

type TripUpdate = {
  id?: string;
  name?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  price_inr_gst?: number;
  total_seats?: number;
  status?: TripStatus;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

type LeadInsert = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  trip_id?: string | null;
  group_type: GroupType;
  preferred_month: string;
  trip_feeling?: string;
  status?: LeadStatus;
  owner_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

type LeadUpdate = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  trip_id?: string | null;
  group_type?: GroupType;
  preferred_month?: string;
  trip_feeling?: string;
  status?: LeadStatus;
  owner_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

type LeadNoteInsert = {
  id?: string;
  lead_id: string;
  author_id?: string | null;
  body: string;
  next_action?: string | null;
  created_at?: string;
};

type LeadNoteUpdate = {
  id?: string;
  lead_id?: string;
  author_id?: string | null;
  body?: string;
  next_action?: string | null;
  created_at?: string;
};

type LeadStatusEventInsert = {
  id?: string;
  lead_id: string;
  from_status?: LeadStatus | null;
  to_status: LeadStatus;
  changed_by?: string | null;
  created_at?: string;
};

type LeadStatusEventUpdate = {
  id?: string;
  lead_id?: string;
  from_status?: LeadStatus | null;
  to_status?: LeadStatus;
  changed_by?: string | null;
  created_at?: string;
};

type TeamMemberInsert = {
  id: string;
  full_name: string;
  email: string;
  created_at?: string;
};

type TeamMemberUpdate = {
  id?: string;
  full_name?: string;
  email?: string;
  created_at?: string;
};

// Minimal database type so the Supabase client stays type-aware without
// needing the full generated schema. Extend as needed.
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: string;
  };
  public: {
    Tables: {
      trips: {
        Row: Trip;
        Insert: TripInsert;
        Update: TripUpdate;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
        Relationships: [];
      };
      lead_notes: {
        Row: LeadNote;
        Insert: LeadNoteInsert;
        Update: LeadNoteUpdate;
        Relationships: [];
      };
      lead_status_events: {
        Row: LeadStatusEvent;
        Insert: LeadStatusEventInsert;
        Update: LeadStatusEventUpdate;
        Relationships: [];
      };
      team_members: {
        Row: TeamMember;
        Insert: TeamMemberInsert;
        Update: TeamMemberUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      trip_status: TripStatus;
      group_type: GroupType;
      lead_status: LeadStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
