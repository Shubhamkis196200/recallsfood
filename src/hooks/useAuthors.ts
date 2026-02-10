import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  email: string | null;
  social_links: Record<string, string> | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Helper to strip email from author data for public access
const stripEmailFromAuthor = (author: Author): Author => ({
  ...author,
  email: null
});

export const useAuthors = () => {
  return useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      // Check if user is authenticated (admin/editor can see email)
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      // Hide email from unauthenticated users
      if (!user) {
        return (data as Author[]).map(stripEmailFromAuthor);
      }
      
      return data as Author[];
    }
  });
};

export const useAuthorById = (id: string) => {
  return useQuery({
    queryKey: ['author', id],
    queryFn: async () => {
      // Check if user is authenticated (admin/editor can see email)
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      // Hide email from unauthenticated users
      if (!user) {
        return stripEmailFromAuthor(data as Author);
      }
      
      return data as Author | null;
    },
    enabled: !!id
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (author: {
      name: string;
      slug?: string;
      bio?: string;
      avatar_url?: string;
      email?: string;
      social_links?: Record<string, string>;
      is_active?: boolean;
      display_order?: number;
    }) => {
      // Generate slug if not provided
      const slug = author.slug || author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('authors')
        .insert({
          name: author.name,
          slug,
          bio: author.bio,
          avatar_url: author.avatar_url,
          email: author.email,
          social_links: author.social_links || {},
          is_active: author.is_active !== false,
          display_order: author.display_order || 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    }
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Author> & { id: string }) => {
      const { data, error } = await supabase
        .from('authors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    }
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Check if author has posts
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_name_id', id);
      
      if (count && count > 0) {
        throw new Error(`Cannot delete author with ${count} assigned posts. Reassign posts first.`);
      }
      
      const { error } = await supabase
        .from('authors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    }
  });
};