import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Checking for scheduled posts to publish...')

    // Find all posts that are scheduled and whose scheduled_at time has passed
    const now = new Date().toISOString()
    
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, scheduled_at')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now)

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError)
      throw fetchError
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      console.log('No scheduled posts ready to publish')
      return new Response(
        JSON.stringify({ 
          message: 'No scheduled posts ready to publish',
          publishedCount: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`Found ${scheduledPosts.length} posts to publish:`, scheduledPosts.map(p => p.title))

    // Update each post to published status
    const postIds = scheduledPosts.map(p => p.id)
    
    const { data: updatedPosts, error: updateError } = await supabase
      .from('posts')
      .update({ 
        status: 'published',
        published_at: now,
        scheduled_at: null
      })
      .in('id', postIds)
      .select('id, title')

    if (updateError) {
      console.error('Error updating posts:', updateError)
      throw updateError
    }

    console.log(`Successfully published ${updatedPosts?.length || 0} posts`)

    return new Response(
      JSON.stringify({ 
        message: `Published ${updatedPosts?.length || 0} scheduled posts`,
        publishedCount: updatedPosts?.length || 0,
        posts: updatedPosts
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in publish-scheduled-posts function:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
