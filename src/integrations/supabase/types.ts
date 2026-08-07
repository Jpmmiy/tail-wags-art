export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      briefings: {
        Row: {
          comodos: Json | null
          diaria: number | null
          estilo_inferido: string | null
          formato_video: string | null
          id: string
          project_id: string
          publico: string | null
        }
        Insert: {
          comodos?: Json | null
          diaria?: number | null
          estilo_inferido?: string | null
          formato_video?: string | null
          id?: string
          project_id: string
          publico?: string | null
        }
        Update: {
          comodos?: Json | null
          diaria?: number | null
          estilo_inferido?: string | null
          formato_video?: string | null
          id?: string
          project_id?: string
          publico?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "briefings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          conteudo: string | null
          creditos: number | null
          dia_plano: number | null
          gerado: boolean | null
          id: string
          modo: string | null
          project_id: string
          shot_number: number | null
          tipo: string | null
        }
        Insert: {
          conteudo?: string | null
          creditos?: number | null
          dia_plano?: number | null
          gerado?: boolean | null
          id?: string
          modo?: string | null
          project_id: string
          shot_number?: number | null
          tipo?: string | null
        }
        Update: {
          conteudo?: string | null
          creditos?: number | null
          dia_plano?: number | null
          gerado?: boolean | null
          id?: string
          modo?: string | null
          project_id?: string
          shot_number?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          project_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          project_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits: number | null
          email: string
          full_name: string | null
          id: string
          tier: Database["public"]["Enums"]["user_tier"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          email: string
          full_name?: string | null
          id: string
          tier?: Database["public"]["Enums"]["user_tier"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits?: number | null
          email?: string
          full_name?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["user_tier"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          current_step: number | null
          id: string
          modalidade: string | null
          session_id: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_step?: number | null
          id?: string
          modalidade?: string | null
          session_id: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_step?: number | null
          id?: string
          modalidade?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          angulo_abordagem: string | null
          endereco: string | null
          id: string
          last_review_at: string | null
          lat: number | null
          lng: number | null
          nome: string
          opportunity_band: string | null
          opportunity_score: number | null
          photos_count: number | null
          place_id: string | null
          project_id: string
          rating: number | null
          signals: Json | null
          user_rating_count: number | null
          website_uri: string | null
        }
        Insert: {
          angulo_abordagem?: string | null
          endereco?: string | null
          id?: string
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          nome: string
          opportunity_band?: string | null
          opportunity_score?: number | null
          photos_count?: number | null
          place_id?: string | null
          project_id: string
          rating?: number | null
          signals?: Json | null
          user_rating_count?: number | null
          website_uri?: string | null
        }
        Update: {
          angulo_abordagem?: string | null
          endereco?: string | null
          id?: string
          last_review_at?: string | null
          lat?: number | null
          lng?: number | null
          nome?: string
          opportunity_band?: string | null
          opportunity_score?: number | null
          photos_count?: number | null
          place_id?: string | null
          project_id?: string
          rating?: number | null
          signals?: Json | null
          user_rating_count?: number | null
          website_uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      radar_cache: {
        Row: {
          cidade_nome: string
          cidade_place_id: string
          criado_em: string | null
          id: string
          modalidade: string
          resultados: Json
          total_encontrados: number
        }
        Insert: {
          cidade_nome: string
          cidade_place_id: string
          criado_em?: string | null
          id?: string
          modalidade: string
          resultados: Json
          total_encontrados: number
        }
        Update: {
          cidade_nome?: string
          cidade_place_id?: string
          criado_em?: string | null
          id?: string
          modalidade?: string
          resultados?: Json
          total_encontrados?: number
        }
        Relationships: []
      }
      system_errors: {
        Row: {
          context: Json | null
          created_at: string | null
          error_message: string
          error_stack: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          error_message: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          error_message?: string
          error_stack?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          external_id: string
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          result: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          external_id: string
          id?: string
          payload: Json
          processed_at?: string | null
          provider?: string
          result?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          external_id?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          result?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      project_status: "rascunho" | "ativo" | "concluido" | "arquivado"
      user_tier: "free" | "pro" | "vitalicio"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      project_status: ["rascunho", "ativo", "concluido", "arquivado"],
      user_tier: ["free", "pro", "vitalicio"],
    },
  },
} as const
