export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dock_master: {
        Row: {
          creation_timestamp: string
          dock_id: string
          dock_name: string
          product_type: string | null
          status: string
          vehicle_type_compatibility: string[]
        }
        Insert: {
          creation_timestamp?: string
          dock_id?: string
          dock_name: string
          product_type?: string | null
          status: string
          vehicle_type_compatibility: string[]
        }
        Update: {
          creation_timestamp?: string
          dock_id?: string
          dock_name?: string
          product_type?: string | null
          status?: string
          vehicle_type_compatibility?: string[]
        }
        Relationships: []
      }
      shipment: {
        Row: {
          appointment_time: string | null
          cargo_types: string[]
          creation_timestamp: string
          dock_in_time: string | null
          dock_out_time: string | null
          dockdoor_assigned: string | null
          driver_contact: string | null
          driver_name: string | null
          eta: string | null
          quantity: number
          shipment_code: string
          transporter: string | null
          vehicle_number: string
        }
        Insert: {
          appointment_time?: string | null
          cargo_types: string[]
          creation_timestamp?: string
          dock_in_time?: string | null
          dock_out_time?: string | null
          dockdoor_assigned?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          eta?: string | null
          quantity: number
          shipment_code: string
          transporter?: string | null
          vehicle_number: string
        }
        Update: {
          appointment_time?: string | null
          cargo_types?: string[]
          creation_timestamp?: string
          dock_in_time?: string | null
          dock_out_time?: string | null
          dockdoor_assigned?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          eta?: string | null
          quantity?: number
          shipment_code?: string
          transporter?: string | null
          vehicle_number?: string
        }
        Relationships: []
      }
      speed_master: {
        Row: {
          cargo_type: string
          creation_timestamp: string
          loading_speed: number
          vehicle_type: string
        }
        Insert: {
          cargo_type: string
          creation_timestamp?: string
          loading_speed: number
          vehicle_type: string
        }
        Update: {
          cargo_type?: string
          creation_timestamp?: string
          loading_speed?: number
          vehicle_type?: string
        }
        Relationships: []
      }
      vehicle_master: {
        Row: {
          creation_timestamp: string
          vehicle_number: string
          vehicle_type: string
        }
        Insert: {
          creation_timestamp?: string
          vehicle_number: string
          vehicle_type: string
        }
        Update: {
          creation_timestamp?: string
          vehicle_number?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
