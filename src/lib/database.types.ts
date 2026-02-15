export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail: string;
          category: string;
          lessons_count: number;
          duration: string;
          level: string;
          progress: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          thumbnail: string;
          category?: string;
          lessons_count?: number;
          duration?: string;
          level?: string;
          progress?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          thumbnail?: string;
          category?: string;
          lessons_count?: number;
          duration?: string;
          level?: string;
          progress?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          order?: number;
          created_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          content: string;
          order: number;
          duration: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          content: string;
          order?: number;
          duration?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          content?: string;
          order?: number;
          duration?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Course = Database['public']['Tables']['courses']['Row'];
export type Section = Database['public']['Tables']['sections']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
