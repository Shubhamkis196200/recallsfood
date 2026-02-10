import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

// Static rate limit configuration
const RATE_LIMITS = {
  read: { requests: 10, windowMs: 1000 },   // 10 req/sec for GET
  write: { requests: 2, windowMs: 1000 },   // 2 req/sec for POST/PUT/DELETE
};

// In-memory rate limit store (per API key)
const rateLimitStore = new Map<string, { read: number[], write: number[] }>();

// Clean old entries from rate limit store
function cleanOldEntries(entries: number[], windowMs: number): number[] {
  const now = Date.now();
  return entries.filter(timestamp => now - timestamp < windowMs);
}

// Check rate limit with static limits
function checkRateLimit(
  keyHash: string, 
  type: 'read' | 'write'
): { 
  allowed: boolean; 
  remaining: number; 
  resetMs: number;
  limit: number;
} {
  const limit = RATE_LIMITS[type].requests;
  const windowMs = RATE_LIMITS[type].windowMs;
  const now = Date.now();
  
  if (!rateLimitStore.has(keyHash)) {
    rateLimitStore.set(keyHash, { read: [], write: [] });
  }
  
  const keyStore = rateLimitStore.get(keyHash)!;
  keyStore[type] = cleanOldEntries(keyStore[type], windowMs);
  
  const currentCount = keyStore[type].length;
  const allowed = currentCount < limit;
  
  if (allowed) {
    keyStore[type].push(now);
  }
  
  const oldestEntry = keyStore[type][0] || now;
  const resetMs = oldestEntry + windowMs - now;
  
  return {
    allowed,
    remaining: Math.max(0, limit - currentCount - (allowed ? 1 : 0)),
    resetMs: Math.max(0, resetMs),
    limit,
  };
}

// Add rate limit headers to response
function addRateLimitHeaders(
  headers: Record<string, string>, 
  rateLimit: { remaining: number; resetMs: number; limit: number }
): Record<string, string> {
  return {
    ...headers,
    'X-RateLimit-Limit': rateLimit.limit.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + rateLimit.resetMs / 1000).toString(),
  };
}

// Hash API key using SHA-256
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if string is UUID
function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

serve(async (req) => {
  const startTime = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const url = new URL(req.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const resource = pathParts[1] || 'unknown';
  const resourceId = pathParts[2];
  const subResource = pathParts[3];
  const subResourceId = pathParts[4];
  const endpoint = `/${resource}${resourceId ? '/' + resourceId : ''}${subResource ? '/' + subResource : ''}${subResourceId ? '/' + subResourceId : ''}`;

  const logAndReturn = async (response: Response, apiKeyId: string | null): Promise<Response> => {
    const responseTime = Date.now() - startTime;
    
    if (apiKeyId) {
      try {
        await supabase.from('api_key_usage').insert({
          api_key_id: apiKeyId,
          endpoint,
          method: req.method,
          status_code: response.status,
          response_time_ms: responseTime,
        });
      } catch (logError) {
        console.error('Failed to log API usage:', logError);
      }
    }
    
    return response;
  };

  // Validate API key
  const providedKey = req.headers.get('x-api-key');
  
  if (!providedKey) {
    console.error('Missing API key');
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Missing API key' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let isValidKey = false;
  let apiKeyId: string | null = null;
  const keyHash = await hashApiKey(providedKey);
  
  const { data: apiKeyRecord, error: apiKeyError } = await supabase
    .from('api_keys')
    .select('id, is_active, expires_at')
    .eq('key_hash', keyHash)
    .maybeSingle();

  if (apiKeyRecord) {
    apiKeyId = apiKeyRecord.id;
    
    if (apiKeyRecord.is_active) {
      if (apiKeyRecord.expires_at) {
        const expiresAt = new Date(apiKeyRecord.expires_at);
        if (expiresAt > new Date()) {
          isValidKey = true;
        }
      } else {
        isValidKey = true;
      }
    }

    if (isValidKey) {
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', apiKeyRecord.id);
    }
  }

  if (!isValidKey) {
    console.error('Invalid or expired API key');
    return logAndReturn(
      new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid or expired API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      ),
      apiKeyId
    );
  }

  const isWriteMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  const rateLimitType = isWriteMethod ? 'write' : 'read';
  const rateLimit = checkRateLimit(keyHash, rateLimitType);
  
  if (!rateLimit.allowed) {
    console.warn(`Rate limit exceeded for API key (${rateLimitType}): ${keyHash.substring(0, 8)}...`);
    return logAndReturn(
      new Response(
        JSON.stringify({ 
          error: 'Too Many Requests', 
          message: `Rate limit exceeded. Limit: ${rateLimit.limit} requests per second for ${rateLimitType} operations.`,
          retry_after_ms: rateLimit.resetMs,
        }),
        { 
          status: 429, 
          headers: addRateLimitHeaders(
            { ...corsHeaders, 'Content-Type': 'application/json' },
            rateLimit
          )
        }
      ),
      apiKeyId
    );
  }

  console.log(`CMS API: ${req.method} ${endpoint} [${rateLimitType}: ${rateLimit.remaining}/${rateLimit.limit} remaining]`);

  const responseHeaders = addRateLimitHeaders(
    { ...corsHeaders, 'Content-Type': 'application/json' },
    rateLimit
  );

  const createResponse = (data: unknown, status: number = 200): Promise<Response> => {
    return logAndReturn(
      new Response(JSON.stringify(data), { status, headers: responseHeaders }),
      apiKeyId
    );
  };

  try {
    // ========== POSTS ENDPOINTS ==========
    if (resource === 'posts') {
      // Handle post-tags sub-resource: /posts/:id/tags
      if (resourceId && subResource === 'tags') {
        if (req.method === 'GET') {
          const { data, error } = await supabase
            .from('post_tags')
            .select('tag_id, tags(*)')
            .eq('post_id', resourceId);
          
          if (error) throw error;
          const tags = data?.map(pt => pt.tags).filter(Boolean) || [];
          return createResponse(tags);
        }
        
        if (req.method === 'POST') {
          const body = await req.json();
          const tagIds: string[] = body.tag_ids || [];
          
          console.log(`Setting tags for post ${resourceId}:`, tagIds);
          
          // Delete existing tags
          await supabase.from('post_tags').delete().eq('post_id', resourceId);
          
          // Insert new tags
          if (tagIds.length > 0) {
            const { error } = await supabase.from('post_tags').insert(
              tagIds.map(tagId => ({ post_id: resourceId, tag_id: tagId }))
            );
            if (error) throw error;
          }
          
          // Return updated tags
          const { data } = await supabase
            .from('post_tags')
            .select('tag_id, tags(*)')
            .eq('post_id', resourceId);
          
          const tags = data?.map(pt => pt.tags).filter(Boolean) || [];
          return createResponse({ success: true, tags });
        }
        
        if (req.method === 'DELETE' && subResourceId) {
          console.log(`Removing tag ${subResourceId} from post ${resourceId}`);
          
          const { error } = await supabase
            .from('post_tags')
            .delete()
            .eq('post_id', resourceId)
            .eq('tag_id', subResourceId);
          
          if (error) throw error;
          return createResponse({ success: true, message: 'Tag removed from post' });
        }
      }
      
      // Standard post endpoints
      if (req.method === 'GET') {
        if (resourceId && !subResource) {
          let query = supabase.from('posts').select('*, categories(id, name, slug), authors(id, name, slug)');
          
          if (isUUID(resourceId)) {
            query = query.eq('id', resourceId);
          } else {
            query = query.eq('slug', resourceId);
          }
          
          const { data, error } = await query.maybeSingle();
          if (error) throw error;
          if (!data) {
            return new Response(
              JSON.stringify({ error: 'Not found', message: 'Post not found' }),
              { status: 404, headers: responseHeaders }
            );
          }
          return createResponse(data);
        } else if (!resourceId) {
          const status = url.searchParams.get('status');
          const categoryId = url.searchParams.get('category_id');
          const authorId = url.searchParams.get('author_name_id');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const offset = parseInt(url.searchParams.get('offset') || '0');
          const search = url.searchParams.get('search');

          let query = supabase.from('posts')
            .select('*, categories(id, name, slug), authors(id, name, slug)', { count: 'exact' });
          
          if (status) query = query.eq('status', status);
          if (categoryId) query = query.eq('category_id', categoryId);
          if (authorId) query = query.eq('author_name_id', authorId);
          if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
          
          query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
          
          const { data, error, count } = await query;
          if (error) throw error;
          
          return createResponse({ data, count, limit, offset });
        }
      }
      
      if (req.method === 'POST' && !subResource) {
        const body = await req.json();
        console.log('Creating post:', body.title);
        
        const { data, error } = await supabase.from('posts').insert({
          title: body.title,
          subtitle: body.subtitle,
          slug: body.slug,
          excerpt: body.excerpt,
          content: body.content,
          category_id: body.category_id,
          author_name_id: body.author_name_id,
          featured_image: body.featured_image,
          featured_image_alt: body.featured_image_alt,
          meta_title: body.meta_title,
          meta_description: body.meta_description,
          is_featured: body.is_featured || false,
          is_trending: body.is_trending || false,
          status: body.status || 'draft',
          scheduled_at: body.scheduled_at,
          published_at: body.status === 'published' ? new Date().toISOString() : null,
        }).select().single();
        
        if (error) throw error;
        console.log('Post created:', data.id);
        
        return createResponse(data, 201);
      }
      
      if (req.method === 'PUT' && resourceId && !subResource) {
        const body = await req.json();
        console.log('Updating post:', resourceId);
        
        const updateData: Record<string, unknown> = {};
        const allowedFields = ['title', 'subtitle', 'slug', 'excerpt', 'content', 'category_id', 
          'author_name_id', 'featured_image', 'featured_image_alt', 'meta_title', 'meta_description', 
          'is_featured', 'is_trending', 'status', 'scheduled_at'];
        
        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        }
        
        if (body.status === 'published') {
          const { data: existing } = await supabase.from('posts').select('status').eq('id', resourceId).single();
          if (existing?.status !== 'published') {
            updateData.published_at = new Date().toISOString();
          }
        }
        
        const { data, error } = await supabase.from('posts')
          .update(updateData)
          .eq('id', resourceId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('Post updated:', data.id);
        
        return createResponse(data);
      }
      
      if (req.method === 'DELETE' && resourceId && !subResource) {
        console.log('Deleting post:', resourceId);
        
        // Delete post_tags first
        await supabase.from('post_tags').delete().eq('post_id', resourceId);
        
        const { error } = await supabase.from('posts').delete().eq('id', resourceId);
        if (error) throw error;
        
        return createResponse({ success: true, message: 'Post deleted' });
      }
    }

    // ========== TAGS ENDPOINTS ==========
    if (resource === 'tags') {
      if (req.method === 'GET') {
        if (resourceId) {
          let query = supabase.from('tags').select('*');
          
          if (isUUID(resourceId)) {
            query = query.eq('id', resourceId);
          } else {
            query = query.eq('slug', resourceId);
          }
          
          const { data, error } = await query.maybeSingle();
          if (error) throw error;
          if (!data) {
            return new Response(
              JSON.stringify({ error: 'Not found', message: 'Tag not found' }),
              { status: 404, headers: responseHeaders }
            );
          }
          return createResponse(data);
        } else {
          const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('name', { ascending: true });
          
          if (error) throw error;
          return createResponse(data);
        }
      }
      
      if (req.method === 'POST') {
        const body = await req.json();
        console.log('Creating tag:', body.name);
        
        const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const { data, error } = await supabase.from('tags').insert({
          name: body.name,
          slug: slug,
        }).select().single();
        
        if (error) throw error;
        console.log('Tag created:', data.id);
        
        return createResponse(data, 201);
      }
      
      if (req.method === 'PUT' && resourceId) {
        const body = await req.json();
        console.log('Updating tag:', resourceId);
        
        const updateData: Record<string, unknown> = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.slug !== undefined) updateData.slug = body.slug;
        
        const { data, error } = await supabase.from('tags')
          .update(updateData)
          .eq('id', resourceId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('Tag updated:', data.id);
        
        return createResponse(data);
      }
      
      if (req.method === 'DELETE' && resourceId) {
        console.log('Deleting tag:', resourceId);
        
        // Check if tag is assigned to posts
        const { count } = await supabase
          .from('post_tags')
          .select('*', { count: 'exact', head: true })
          .eq('tag_id', resourceId);
        
        if (count && count > 0) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete', message: `Tag is assigned to ${count} posts. Remove from posts first.` }),
            { status: 400, headers: responseHeaders }
          );
        }
        
        const { error } = await supabase.from('tags').delete().eq('id', resourceId);
        if (error) throw error;
        
        return createResponse({ success: true, message: 'Tag deleted' });
      }
    }

    // ========== AUTHORS ENDPOINTS ==========
    if (resource === 'authors') {
      if (req.method === 'GET') {
        if (resourceId) {
          let query = supabase.from('authors').select('*');
          if (isUUID(resourceId)) {
            query = query.eq('id', resourceId);
          } else {
            query = query.eq('slug', resourceId);
          }
          
          const { data, error } = await query.maybeSingle();
          if (error) throw error;
          if (!data) {
            return new Response(
              JSON.stringify({ error: 'Not found', message: 'Author not found' }),
              { status: 404, headers: responseHeaders }
            );
          }
          return createResponse(data);
        } else {
          const includeInactive = url.searchParams.get('include_inactive') === 'true';
          let query = supabase.from('authors').select('*');
          if (!includeInactive) {
            query = query.eq('is_active', true);
          }
          query = query.order('display_order', { ascending: true });
          
          const { data, error } = await query;
          if (error) throw error;
          
          return createResponse(data);
        }
      }
      
      if (req.method === 'POST') {
        const body = await req.json();
        console.log('Creating author:', body.name);
        
        const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const { data, error } = await supabase.from('authors').insert({
          name: body.name,
          slug: slug,
          bio: body.bio,
          avatar_url: body.avatar_url,
          email: body.email,
          social_links: body.social_links || {},
          is_active: body.is_active !== false,
          display_order: body.display_order || 0,
        }).select().single();
        
        if (error) throw error;
        console.log('Author created:', data.id);
        
        return createResponse(data, 201);
      }
      
      if (req.method === 'PUT' && resourceId) {
        const body = await req.json();
        console.log('Updating author:', resourceId);
        
        const updateData: Record<string, unknown> = {};
        const allowedFields = ['name', 'slug', 'bio', 'avatar_url', 'email', 'social_links', 'is_active', 'display_order'];
        
        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        }
        
        const { data, error } = await supabase.from('authors')
          .update(updateData)
          .eq('id', resourceId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('Author updated:', data.id);
        
        return createResponse(data);
      }
      
      if (req.method === 'DELETE' && resourceId) {
        console.log('Deleting author:', resourceId);
        
        const { count } = await supabase.from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_name_id', resourceId);
        
        if (count && count > 0) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete', message: `Author has ${count} posts assigned. Reassign or delete posts first.` }),
            { status: 400, headers: responseHeaders }
          );
        }
        
        const { error } = await supabase.from('authors').delete().eq('id', resourceId);
        if (error) throw error;
        
        return createResponse({ success: true, message: 'Author deleted' });
      }
    }

    // ========== CATEGORIES ENDPOINTS ==========
    if (resource === 'categories') {
      if (req.method === 'GET') {
        if (resourceId) {
          let query = supabase.from('categories').select('*');
          
          if (isUUID(resourceId)) {
            query = query.eq('id', resourceId);
          } else {
            query = query.eq('slug', resourceId);
          }
          
          const { data, error } = await query.maybeSingle();
          if (error) throw error;
          if (!data) {
            return new Response(
              JSON.stringify({ error: 'Not found', message: 'Category not found' }),
              { status: 404, headers: responseHeaders }
            );
          }
          return createResponse(data);
        } else {
          const { data, error } = await supabase.from('categories')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) throw error;
          return createResponse(data);
        }
      }
      
      if (req.method === 'POST') {
        const body = await req.json();
        console.log('Creating category:', body.name);
        
        const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const { data, error } = await supabase.from('categories').insert({
          name: body.name,
          slug: slug,
          description: body.description,
          image_url: body.image_url,
          display_order: body.display_order || 0,
        }).select().single();
        
        if (error) throw error;
        console.log('Category created:', data.id);
        
        return createResponse(data, 201);
      }
      
      if (req.method === 'PUT' && resourceId) {
        const body = await req.json();
        console.log('Updating category:', resourceId);
        
        const updateData: Record<string, unknown> = {};
        const allowedFields = ['name', 'slug', 'description', 'image_url', 'display_order'];
        
        for (const field of allowedFields) {
          if (body[field] !== undefined) {
            updateData[field] = body[field];
          }
        }
        
        const { data, error } = await supabase.from('categories')
          .update(updateData)
          .eq('id', resourceId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('Category updated:', data.id);
        
        return createResponse(data);
      }
      
      if (req.method === 'DELETE' && resourceId) {
        console.log('Deleting category:', resourceId);
        
        // Check if category has posts
        const { count } = await supabase.from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', resourceId);
        
        if (count && count > 0) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete', message: `Category has ${count} posts. Reassign or delete posts first.` }),
            { status: 400, headers: responseHeaders }
          );
        }
        
        const { error } = await supabase.from('categories').delete().eq('id', resourceId);
        if (error) throw error;
        
        return createResponse({ success: true, message: 'Category deleted' });
      }
    }

    // ========== MEDIA ENDPOINTS ==========
    if (resource === 'media') {
      if (req.method === 'GET') {
        if (resourceId) {
          const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('id', resourceId)
            .maybeSingle();
          
          if (error) throw error;
          if (!data) {
            return new Response(
              JSON.stringify({ error: 'Not found', message: 'Media not found' }),
              { status: 404, headers: responseHeaders }
            );
          }
          return createResponse(data);
        } else {
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const offset = parseInt(url.searchParams.get('offset') || '0');
          
          const { data, error, count } = await supabase.from('media')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
          
          if (error) throw error;
          return createResponse({ data, count, limit, offset });
        }
      }
      
      if (req.method === 'POST') {
        const body = await req.json();
        console.log('Uploading media:', body.file_name);
        
        const base64Data = body.file_data.replace(/^data:.*?;base64,/, '');
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        const filePath = `uploads/${Date.now()}-${body.file_name}`;
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, binaryData, {
            contentType: body.file_type || 'application/octet-stream',
          });
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
        
        const { data, error } = await supabase.from('media').insert({
          file_name: body.file_name,
          file_path: urlData.publicUrl,
          file_type: body.file_type,
          file_size: binaryData.length,
          alt_text: body.alt_text,
          caption: body.caption,
          width: body.width,
          height: body.height,
        }).select().single();
        
        if (error) throw error;
        console.log('Media uploaded:', data.id);
        
        return createResponse(data, 201);
      }
      
      if (req.method === 'PUT' && resourceId) {
        const body = await req.json();
        console.log('Updating media:', resourceId);
        
        const updateData: Record<string, unknown> = {};
        if (body.alt_text !== undefined) updateData.alt_text = body.alt_text;
        if (body.caption !== undefined) updateData.caption = body.caption;
        
        const { data, error } = await supabase.from('media')
          .update(updateData)
          .eq('id', resourceId)
          .select()
          .single();
        
        if (error) throw error;
        console.log('Media updated:', data.id);
        
        return createResponse(data);
      }
      
      if (req.method === 'DELETE' && resourceId) {
        console.log('Deleting media:', resourceId);
        
        // Get media record to find storage path
        const { data: mediaRecord, error: fetchError } = await supabase
          .from('media')
          .select('file_path')
          .eq('id', resourceId)
          .single();
        
        if (fetchError) throw fetchError;
        
        // Extract storage path from URL
        if (mediaRecord?.file_path) {
          const storageUrl = mediaRecord.file_path;
          const pathMatch = storageUrl.match(/\/media\/(.+)$/);
          if (pathMatch) {
            const storagePath = pathMatch[1];
            await supabase.storage.from('media').remove([storagePath]);
          }
        }
        
        // Delete from database
        const { error } = await supabase.from('media').delete().eq('id', resourceId);
        if (error) throw error;
        
        return createResponse({ success: true, message: 'Media deleted' });
      }
    }

    // Unknown endpoint
    return new Response(
      JSON.stringify({ error: 'Not found', message: `Unknown endpoint: /${resource}` }),
      { status: 404, headers: responseHeaders }
    );

  } catch (error) {
    console.error('CMS API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal error', message: errorMessage }),
      { status: 500, headers: responseHeaders }
    );
  }
});
