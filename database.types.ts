[?25l
    Select a project:                                                                                 
                                                                                                      
  >  1. kpljktcbctmpokebtdhs [name: nwrose social media, org: mfurbponsqaoblvwjilj, region: us-east-1]
                                                                                                      
                                                                                                      
    ↑/k up • ↓/j down • / filter • q quit • ? more                                                    
                                                                                                      [0D[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[2K[1A[0D[2K [0D[2K[?25h[?1002l[?1003l[?1006lexport type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          commentid: number
          created: string | null
          owner: string
          postid: number | null
          text: string | null
        }
        Insert: {
          commentid?: number
          created?: string | null
          owner: string
          postid?: number | null
          text?: string | null
        }
        Update: {
          commentid?: number
          created?: string | null
          owner?: string
          postid?: number | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_owner_fkey1"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "comments_postid_fkey"
            columns: ["postid"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["postid"]
          },
        ]
      }
      following: {
        Row: {
          created: string | null
          user1: string
          username2: string
        }
        Insert: {
          created?: string | null
          user1: string
          username2: string
        }
        Update: {
          created?: string | null
          user1?: string
          username2?: string
        }
        Relationships: [
          {
            foreignKeyName: "following_user1_fkey"
            columns: ["user1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "following_username2_fkey"
            columns: ["username2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["username"]
          },
        ]
      }
      likes: {
        Row: {
          created: string | null
          likeid: number
          owner: string
          postid: number | null
        }
        Insert: {
          created?: string | null
          likeid?: number
          owner: string
          postid?: number | null
        }
        Update: {
          created?: string | null
          likeid?: number
          owner?: string
          postid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "likes_postid_fkey"
            columns: ["postid"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["postid"]
          },
        ]
      }
      posts: {
        Row: {
          created: string | null
          filename: string | null
          owner: string
          postid: number
        }
        Insert: {
          created?: string | null
          filename?: string | null
          owner: string
          postid?: number
        }
        Update: {
          created?: string | null
          filename?: string | null
          owner?: string
          postid?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      users: {
        Row: {
          created: string | null
          email: string | null
          filename: string | null
          fullname: string | null
          username: string
          uuid: string
        }
        Insert: {
          created?: string | null
          email?: string | null
          filename?: string | null
          fullname?: string | null
          username: string
          uuid: string
        }
        Update: {
          created?: string | null
          email?: string | null
          filename?: string | null
          fullname?: string | null
          username?: string
          uuid?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
