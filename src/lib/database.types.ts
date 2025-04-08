
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
      trucks: {
        Row: {
          id: string
          vehicle_number: string
          license_plate: string
          shipment_code: string
          carrier: string
          driver: string
          driver_contact?: string
          transporter?: string
          cargo_type: "Frozen" | "Normal" | "Mixed"
          quantity: number
          arrival_time: string
          actual_arrival_time?: string
          appointment_time?: string
          estimated_arrival_time: string
          estimated_dock_out_time?: string
          status: "In Queue" | "Assigned" | "Completed"
          assigned_dock?: string
          estimated_wait_time?: string
          priority: "Low" | "Medium" | "High"
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_number: string
          license_plate: string
          shipment_code: string
          carrier: string
          driver: string
          driver_contact?: string
          transporter?: string
          cargo_type: "Frozen" | "Normal" | "Mixed"
          quantity: number
          arrival_time: string
          actual_arrival_time?: string
          appointment_time?: string
          estimated_arrival_time: string
          estimated_dock_out_time?: string
          status?: "In Queue" | "Assigned" | "Completed"
          assigned_dock?: string
          estimated_wait_time?: string
          priority?: "Low" | "Medium" | "High"
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_number?: string
          license_plate?: string
          shipment_code?: string
          carrier?: string
          driver?: string
          driver_contact?: string
          transporter?: string
          cargo_type?: "Frozen" | "Normal" | "Mixed"
          quantity?: number
          arrival_time?: string
          actual_arrival_time?: string
          appointment_time?: string
          estimated_arrival_time?: string
          estimated_dock_out_time?: string
          status?: "In Queue" | "Assigned" | "Completed"
          assigned_dock?: string
          estimated_wait_time?: string
          priority?: "Low" | "Medium" | "High"
          created_at?: string
        }
      }
      dock_doors: {
        Row: {
          id: string
          name: string
          status: "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE"
          assigned_truck?: string
          last_updated: string
          estimated_completion?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE"
          assigned_truck?: string
          last_updated?: string
          estimated_completion?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE"
          assigned_truck?: string
          last_updated?: string
          estimated_completion?: string
          created_at?: string
        }
      }
      // New tables based on SQL migration
      dock_master: {
        Row: {
          dock_id: string
          dock_name: string
          product_type: string | null
          vehicle_type_compatibility: string[]
          status: string
          creation_timestamp: string
        }
        Insert: {
          dock_id?: string
          dock_name: string
          product_type?: string | null
          vehicle_type_compatibility: string[]
          status: string
          creation_timestamp?: string
        }
        Update: {
          dock_id?: string
          dock_name?: string
          product_type?: string | null
          vehicle_type_compatibility?: string[]
          status?: string
          creation_timestamp?: string
        }
      }
      vehicle_master: {
        Row: {
          vehicle_number: string
          vehicle_type: string
          creation_timestamp: string
        }
        Insert: {
          vehicle_number: string
          vehicle_type: string
          creation_timestamp?: string
        }
        Update: {
          vehicle_number?: string
          vehicle_type?: string
          creation_timestamp?: string
        }
      }
      speed_master: {
        Row: {
          cargo_type: string
          vehicle_type: string
          loading_speed: number
          creation_timestamp: string
        }
        Insert: {
          cargo_type: string
          vehicle_type: string
          loading_speed: number
          creation_timestamp?: string
        }
        Update: {
          cargo_type?: string
          vehicle_type?: string
          loading_speed?: number
          creation_timestamp?: string
        }
      }
      shipment: {
        Row: {
          shipment_code: string
          vehicle_number: string
          cargo_types: string[]
          quantity: number
          eta: string | null
          appointment_time: string | null
          driver_name: string | null
          driver_contact: string | null
          transporter: string | null
          dock_in_time: string | null
          dock_out_time: string | null
          dockdoor_assigned: string | null
          creation_timestamp: string
        }
        Insert: {
          shipment_code: string
          vehicle_number: string
          cargo_types: string[]
          quantity: number
          eta?: string | null
          appointment_time?: string | null
          driver_name?: string | null
          driver_contact?: string | null
          transporter?: string | null
          dock_in_time?: string | null
          dock_out_time?: string | null
          dockdoor_assigned?: string | null
          creation_timestamp?: string
        }
        Update: {
          shipment_code?: string
          vehicle_number?: string
          cargo_types?: string[]
          quantity?: number
          eta?: string | null
          appointment_time?: string | null
          driver_name?: string | null
          driver_contact?: string | null
          transporter?: string | null
          dock_in_time?: string | null
          dock_out_time?: string | null
          dockdoor_assigned?: string | null
          creation_timestamp?: string
        }
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
  }
}
