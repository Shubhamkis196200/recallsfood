import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export const useMedia = () => {
  return useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as MediaItem[];
    }
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Get image dimensions if it's an image
      let width: number | null = null;
      let height: number | null = null;
      
      if (file.type.startsWith('image/')) {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Insert into media table
      const { data, error: insertError } = await supabase
        .from('media')
        .insert({
          file_name: file.name,
          file_path: publicUrl,
          file_type: file.type,
          file_size: file.size,
          width,
          height,
          uploaded_by: user?.id
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (media: MediaItem) => {
      // Extract storage path from public URL
      const url = new URL(media.file_path);
      const pathParts = url.pathname.split('/storage/v1/object/public/media/');
      const storagePath = pathParts[1];

      if (storagePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove([storagePath]);
        
        if (storageError) console.error('Storage delete error:', storageError);
      }

      // Delete from media table
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', media.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });
};

export const useBulkDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaItems: MediaItem[]) => {
      // Extract storage paths from public URLs
      const storagePaths: string[] = [];
      const ids: string[] = [];

      for (const media of mediaItems) {
        ids.push(media.id);
        const url = new URL(media.file_path);
        const pathParts = url.pathname.split('/storage/v1/object/public/media/');
        if (pathParts[1]) {
          storagePaths.push(pathParts[1]);
        }
      }

      // Bulk delete from storage
      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('media')
          .remove(storagePaths);
        
        if (storageError) console.error('Storage bulk delete error:', storageError);
      }

      // Bulk delete from media table
      const { error } = await supabase
        .from('media')
        .delete()
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, alt_text, caption }: { id: string; alt_text?: string; caption?: string }) => {
      const { data, error } = await supabase
        .from('media')
        .update({ alt_text, caption })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    }
  });
};

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
}
