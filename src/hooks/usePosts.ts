import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type Category = Database['public']['Tables']['categories']['Row'];
type Author = Database['public']['Tables']['authors']['Row'];

export interface PostWithRelations extends Post {
  category?: Category | null;
  author?: Author | null;
}

const enrichPostsWithRelations = async (posts: Post[]): Promise<PostWithRelations[]> => {
  if (!posts || posts.length === 0) return [];

  // Fetch categories
  const categoryIds = posts.map(p => p.category_id).filter((id): id is string => !!id);
  const uniqueCategoryIds = [...new Set(categoryIds)];
  
  let categories: Category[] = [];
  if (uniqueCategoryIds.length > 0) {
    const { data } = await supabase.from('categories').select('*').in('id', uniqueCategoryIds);
    categories = data || [];
  }

  // Fetch authors via author_name_id from authors table
  const authorNameIds = posts.map(p => p.author_name_id).filter((id): id is string => !!id);
  const uniqueAuthorNameIds = [...new Set(authorNameIds)];
  
  let authors: Author[] = [];
  if (uniqueAuthorNameIds.length > 0) {
    const { data } = await supabase.from('authors').select('*').in('id', uniqueAuthorNameIds);
    authors = data || [];
  }

  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));
  const authorMap = new Map<string, Author>(authors.map(a => [a.id, a]));

  return posts.map(post => ({
    ...post,
    category: post.category_id ? categoryMap.get(post.category_id) || null : null,
    author: post.author_name_id ? authorMap.get(post.author_name_id) || null : null,
  }));
};

export const usePosts = (status?: 'draft' | 'published' | 'scheduled') => {
  return useQuery({
    queryKey: ['posts', status],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    }
  });
};

export const usePublishedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    }
  });
};

export const useFeaturedPosts = () => {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    }
  });
};

export const useTrendingPosts = () => {
  return useQuery({
    queryKey: ['posts', 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_trending', true)
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    }
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!post) return null;

      // Fetch category
      let category: Category | null = null;
      if (post.category_id) {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('id', post.category_id)
          .single();
        category = data;
      }

      // Fetch author from authors table
      let author: Author | null = null;
      if (post.author_name_id) {
        const { data } = await supabase
          .from('authors')
          .select('*')
          .eq('id', post.author_name_id)
          .maybeSingle();
        author = data;
      }

      return { ...post, category, author } as PostWithRelations;
    },
    enabled: !!slug
  });
};

export const usePostsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['posts', 'category', categorySlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!category) return [];

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    },
    enabled: !!categorySlug
  });
};

export const usePaginatedPostsByCategory = (categorySlug: string, page: number, pageSize: number = 9) => {
  return useQuery({
    queryKey: ['posts', 'category', categorySlug, 'page', page, pageSize],
    queryFn: async () => {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (!category) return { posts: [], totalCount: 0 };

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      const posts = await enrichPostsWithRelations(data || []);
      return { posts, totalCount: count || 0 };
    },
    enabled: !!categorySlug
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: PostInsert) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: PostUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    },
    enabled: query.length >= 2,
  });
};

export const useRelatedPosts = (postId: string, categoryId: string | null) => {
  return useQuery({
    queryKey: ['posts', 'related', postId, categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .neq('id', postId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return enrichPostsWithRelations(data || []);
    },
    enabled: !!categoryId && !!postId,
  });
};

export const useIncrementViewCount = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.rpc('increment_view_count', { post_slug: slug });
      if (error) throw error;
    },
  });
};
