import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;

    console.log('Admin users action:', action);

    // Accept invitation doesn't require auth (user doesn't exist yet)
    if (action === 'accept_invitation') {
      const { token, password } = body;

      if (!token || !password) {
        return new Response(
          JSON.stringify({ error: 'Missing token or password' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (password.length < 8) {
        return new Response(
          JSON.stringify({ error: 'Password must be at least 8 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Hash the token to compare
      const encoder = new TextEncoder();
      const data = encoder.encode(token);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Find invitation
      const { data: invitation, error: inviteError } = await supabaseAdmin
        .from('user_invitations')
        .select('*')
        .eq('token_hash', tokenHash)
        .single();

      if (inviteError || !invitation) {
        return new Response(
          JSON.stringify({ error: 'Invalid or expired invitation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (invitation.accepted_at) {
        return new Response(
          JSON.stringify({ error: 'Invitation already used' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(invitation.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Invitation expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: invitation.full_name }
      });

      if (createError) {
        console.error('Create user error:', createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Assign role
      await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: newUser.user.id, role: invitation.role });

      // Mark invitation as accepted
      await supabaseAdmin
        .from('user_invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id);

      // Log activity
      await supabaseAdmin
        .from('activity_logs')
        .insert([{
          user_id: newUser.user.id,
          action: 'user.accepted_invitation',
          entity_type: 'user',
          entity_id: newUser.user.id,
          details: { email: invitation.email, role: invitation.role },
        }]);

      console.log('User created from invitation:', newUser.user.id);
      return new Response(
        JSON.stringify({ success: true, user_id: newUser.user.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All other actions require admin auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'invite': {
        const { email, full_name, role } = body;

        if (!email || !full_name || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUsers?.users?.some(u => u.email === email);
        
        if (userExists) {
          return new Response(
            JSON.stringify({ error: 'A user with this email already exists' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Generate secure token
        const tokenBytes = new Uint8Array(32);
        crypto.getRandomValues(tokenBytes);
        const token = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Hash token for storage
        const encoder = new TextEncoder();
        const data = encoder.encode(token);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const tokenHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Create invitation (expires in 48 hours)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        const { error: insertError } = await supabaseAdmin
          .from('user_invitations')
          .insert({
            email,
            full_name,
            role,
            token_hash: tokenHash,
            invited_by: user.id,
            expires_at: expiresAt.toISOString(),
          });

        if (insertError) {
          console.error('Insert invitation error:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create invitation' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get site URL from referrer or default
        const referer = req.headers.get('referer') || '';
        const baseUrl = referer ? new URL(referer).origin : 'https://lovable.dev';
        const inviteLink = `${baseUrl}/accept-invite?token=${token}`;

        // Try to send email via send-email function
        try {
          const { error: emailError } = await supabaseAdmin.functions.invoke('send-email', {
            body: {
              to: email,
              subject: "You've been invited to LUXE EDITORIAL",
              html: `
                <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <h1 style="font-size: 28px; margin-bottom: 20px;">Welcome to LUXE EDITORIAL</h1>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Hi ${full_name},
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    You've been invited to join LUXE EDITORIAL as an <strong>${role}</strong>.
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; color: #333;">
                    Click the button below to set your password and activate your account:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${inviteLink}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 16px; display: inline-block;">
                      Accept Invitation
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #666;">
                    This invitation expires in 48 hours.
                  </p>
                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    If you didn't expect this invitation, you can safely ignore this email.
                  </p>
                </div>
              `,
            },
          });

          if (emailError) {
            console.warn('Email send failed:', emailError);
          }
        } catch (emailErr) {
          console.warn('Email function not available or failed:', emailErr);
        }

        // Log activity
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            action: 'user.invited',
            entity_type: 'invitation',
            details: { email, role, invited_by: user.id },
          }]);

        console.log('Invitation created for:', email);
        return new Response(
          JSON.stringify({ success: true, invite_link: inviteLink }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { email, password, full_name, role } = body;

        if (!email || !password || !full_name || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (password.length < 8) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 8 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name }
        });

        if (createError) {
          console.error('Create user error:', createError);
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: roleInsertError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: newUser.user.id, role });

        if (roleInsertError) {
          console.error('Role insert error:', roleInsertError);
          await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
          return new Response(
            JSON.stringify({ error: 'Failed to assign role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log activity
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            action: 'user.created',
            entity_type: 'user',
            entity_id: newUser.user.id,
            details: { email, role },
          }]);

        console.log('User created successfully:', newUser.user.id);
        return new Response(
          JSON.stringify({ success: true, user_id: newUser.user.id }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update_role': {
        const { user_id, role } = body;

        if (!user_id || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing user_id or role' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', user_id);

        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id, role });

        if (roleError) {
          console.error('Update role error:', roleError);
          return new Response(
            JSON.stringify({ error: 'Failed to update role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log activity
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            action: 'user.role_changed',
            entity_type: 'user',
            entity_id: user_id,
            details: { new_role: role },
          }]);

        console.log('Role updated successfully for user:', user_id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { user_id } = body;

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: 'Missing user_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (user_id === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete your own account' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

        if (deleteError) {
          console.error('Delete user error:', deleteError);
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log activity
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            action: 'user.deleted',
            entity_type: 'user',
            entity_id: user_id,
          }]);

        console.log('User deleted successfully:', user_id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset_password': {
        const { user_id, password } = body;

        if (!user_id || !password) {
          return new Response(
            JSON.stringify({ error: 'Missing user_id or password' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (password.length < 8) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 8 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user_id,
          { password }
        );

        if (updateError) {
          console.error('Reset password error:', updateError);
          return new Response(
            JSON.stringify({ error: updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Log activity
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            user_id: user.id,
            action: 'user.password_reset',
            entity_type: 'user',
            entity_id: user_id,
          }]);

        console.log('Password reset successfully for user:', user_id);
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
