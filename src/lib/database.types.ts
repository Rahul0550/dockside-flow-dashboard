
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
          status: "Available" | "Occupied" | "Maintenance"
          assigned_truck?: string
          last_updated: string
          estimated_completion?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: "Available" | "Occupied" | "Maintenance"
          assigned_truck?: string
          last_updated?: string
          estimated_completion?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: "Available" | "Occupied" | "Maintenance"
          assigned_truck?: string
          last_updated?: string
          estimated_completion?: string
          created_at?: string
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
