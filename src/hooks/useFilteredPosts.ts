import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PostFilters {
  status?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  minViews?: number | null;
  maxViews?: number | null;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export const useFilteredPosts = (filters: PostFilters = {}) => {
  const {
    status,
    categoryId,
    authorId,
    dateFrom,
    dateTo,
    minViews,
    maxViews,
    searchQuery,
    page = 1,
    pageSize = 10,
  } = filters;

  return useQuery({
    queryKey: ['filtered-posts', filters],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(id, name, slug),
          author:authors!posts_author_name_id_fkey(id, name, avatar_url)
        `, { count: 'exact' });

      // Status filter
      if (status && status !== 'all') {
        query = query.eq('status', status as 'draft' | 'published' | 'scheduled' | 'archived');
      }

      // Category filter
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // Author filter
      if (authorId) {
        query = query.eq('author_name_id', authorId);
      }

      // Date range filter
      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }

      // Views filter
      if (minViews !== null && minViews !== undefined) {
        query = query.gte('view_count', minViews);
      }
      if (maxViews !== null && maxViews !== undefined) {
        query = query.lte('view_count', maxViews);
      }

      // Search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Order by created_at desc
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;
      return { posts: data || [], totalCount: count || 0 };
    },
  });
};
