export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string;
          name: string;
          type: "Club" | "Bar" | "Event" | "Lounge";
          city: string;
          neighborhood: string;
          distance_km: number;
          music: string[];
          vibes: string[];
          budget: "Low" | "Medium" | "High";
          price_label: string;
          dress_code: "Casual" | "Smart casual" | "Dressy";
          opening_hours: string;
          rating: number;
          image_url: string;
          visual_cue: string;
          description: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          type: "Club" | "Bar" | "Event" | "Lounge";
          city: string;
          neighborhood: string;
          distance_km?: number;
          music?: string[];
          vibes?: string[];
          budget: "Low" | "Medium" | "High";
          price_label: string;
          dress_code: "Casual" | "Smart casual" | "Dressy";
          opening_hours: string;
          rating?: number;
          image_url: string;
          visual_cue: string;
          description: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
      };
      venue_events: {
        Row: {
          id: string;
          venue_id: string;
          title: string;
          starts_at: string | null;
          ends_at: string | null;
          music: string[];
          vibe: string | null;
          price_label: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          title: string;
          starts_at?: string | null;
          ends_at?: string | null;
          music?: string[];
          vibe?: string | null;
          price_label?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["venue_events"]["Insert"]>;
      };
      user_feedback: {
        Row: {
          id: string;
          venue_id: string | null;
          rating: number | null;
          feedback_type: "venue" | "recommendation" | "location" | "general";
          message: string;
          contact_email: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          venue_id?: string | null;
          rating?: number | null;
          feedback_type?: "venue" | "recommendation" | "location" | "general";
          message: string;
          contact_email?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_feedback"]["Insert"]>;
      };
    };
  };
};
