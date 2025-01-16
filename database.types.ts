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
      comments: {
        Row: {
          commentid: number
          created: string | null
          postid: number | null
          text: string | null
          uuid: string
        }
        Insert: {
          commentid?: number
          created?: string | null
          postid?: number | null
          text?: string | null
          uuid?: string
        }
        Update: {
          commentid?: number
          created?: string | null
          postid?: number | null
          text?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_postid_fkey"
            columns: ["postid"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["postid"]
          },
          {
            foreignKeyName: "comments_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      deleteRequests: {
        Row: {
          uuid: string
        }
        Insert: {
          uuid?: string
        }
        Update: {
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "deleteRequests_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      following: {
        Row: {
          created: string | null
          uuid1: string
          uuid2: string
        }
        Insert: {
          created?: string | null
          uuid1?: string
          uuid2: string
        }
        Update: {
          created?: string | null
          uuid1?: string
          uuid2?: string
        }
        Relationships: [
          {
            foreignKeyName: "following_uuid_fkey"
            columns: ["uuid1"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "following_uuid2_fkey"
            columns: ["uuid2"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      likes: {
        Row: {
          created: string | null
          likeid: number
          postid: number | null
          uuid: string
        }
        Insert: {
          created?: string | null
          likeid?: number
          postid?: number | null
          uuid?: string
        }
        Update: {
          created?: string | null
          likeid?: number
          postid?: number | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_postid_fkey"
            columns: ["postid"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["postid"]
          },
          {
            foreignKeyName: "likes_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      posts: {
        Row: {
          created: string | null
          filename: string | null
          postid: number
          uuid: string
        }
        Insert: {
          created?: string | null
          filename?: string | null
          postid?: number
          uuid?: string
        }
        Update: {
          created?: string | null
          filename?: string | null
          postid?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["uuid"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created: string | null
          email: string | null
          filename: string | null
          fullname: string | null
          username: string
          uuid: string
        }
        Insert: {
          bio?: string | null
          created?: string | null
          email?: string | null
          filename?: string | null
          fullname?: string | null
          username: string
          uuid?: string
        }
        Update: {
          bio?: string | null
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
      get_explore: {
        Args: {
          in_uuid: string
        }
        Returns: {
          filename: string
          username: string
          uuid: string
        }[]
      }
      get_followers: {
        Args: {
          in_username: string
          in_current_uuid: string
        }
        Returns: {
          filename: string
          username: string
          uuid: string
          currently_following: boolean
        }[]
      }
      get_following: {
        Args: {
          in_username: string
          in_current_uuid: string
        }
        Returns: {
          filename: string
          username: string
          uuid: string
          currently_following: boolean
        }[]
      }
      get_main_feed: {
        Args: {
          in_uuid: string
        }
        Returns: {
          p_postid: number
          p_created: string
          p_filename: string
          p_username: string
          p_pfp_filename: string
          comments: Json
          likes: Json
        }[]
      }
      get_post_info: {
        Args: {
          in_postid: number
        }
        Returns: {
          post_filename: string
          created: string
          username: string
          pfp_filename: string
          comments: Json
          likes: Json
        }[]
      }
      get_user_info: {
        Args: {
          in_username: string
        }
        Returns: {
          fullname: string
          filename: string
          created: string
          bio: string
          follower_count: number
          following_count: number
          posts: Json
        }[]
      }
      validate_email_username: {
        Args: {
          in_email: string
          in_username: string
        }
        Returns: {
          email_available: boolean
          username_available: boolean
        }[]
      }
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
