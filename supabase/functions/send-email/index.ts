import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  isTest?: boolean;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get API key from Cloud Secrets (not database)
    const emailApiKey = Deno.env.get("EMAIL_API_KEY");

    // Get email settings from database (provider, from_email, from_name only - no credentials)
    const { data: settings, error: settingsError } = await supabase
      .from("email_settings")
      .select("provider, from_email, from_name, is_active")
      .eq("is_active", true)
      .limit(1)
      .single();

    if (settingsError || !settings) {
      console.error("Email settings error:", settingsError);
      return new Response(
        JSON.stringify({ error: "Email settings not configured or inactive" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!emailApiKey) {
      console.error("EMAIL_API_KEY not configured in Cloud Secrets");
      return new Response(
        JSON.stringify({ error: "Email API key not configured. Please add EMAIL_API_KEY in Cloud Secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { to, subject, html }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;

    if (settings.provider === "resend") {
      // Send via Resend
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${emailApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: settings.from_name 
            ? `${settings.from_name} <${settings.from_email}>` 
            : settings.from_email,
          to: [to],
          subject,
          html,
        }),
      });

      result = await response.json();
      
      if (!response.ok) {
        console.error("Resend error:", result);
        throw new Error(result.message || "Failed to send email via Resend");
      }
    } else if (settings.provider === "sendgrid") {
      // Send via SendGrid
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${emailApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { 
            email: settings.from_email,
            name: settings.from_name || undefined,
          },
          subject,
          content: [{ type: "text/html", value: html }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("SendGrid error:", errorText);
        throw new Error("Failed to send email via SendGrid");
      }

      result = { success: true };
    } else if (settings.provider === "brevo") {
      // Send via Brevo (Sendinblue)
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": emailApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            email: settings.from_email,
            name: settings.from_name || undefined,
          },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Brevo error:", errorData);
        throw new Error(errorData.message || "Failed to send email via Brevo");
      }

      result = await response.json();
    } else if (settings.provider === "instantly") {
      // Send via Instantly
      const response = await fetch("https://api.instantly.ai/api/v1/unibox/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: emailApiKey,
          email_account: settings.from_email,
          to_address: to,
          subject,
          body_html: html,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Instantly error:", errorData);
        throw new Error(errorData.message || "Failed to send email via Instantly");
      }

      result = await response.json();
    } else if (settings.provider === "smtp") {
      return new Response(
        JSON.stringify({ error: "SMTP is not yet supported. Please use Resend, SendGrid, Brevo, or Instantly." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent successfully to ${to} via ${settings.provider}`);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
