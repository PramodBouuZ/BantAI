import { createClient } from '@supabase/supabase-js';

// Access environment variables safely (supports Vite)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Only create the client if keys are present
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

/*
========================================================================
CRITICAL: GOOGLE SEARCH & EMAIL DELIVERY CONFIGURATION
========================================================================

1. GOOGLE SEARCH ICON:
   Google Search requires a high-resolution favicon (multiples of 48px).
   Ensure your uploaded favicon in the Admin Panel is 192x192px or larger.

2. FIXING "EMAIL NOT RECEIVED" (Supabase Dashboard Settings):
   - Go to: Authentication -> URL Configuration
   - SITE_URL: https://bantconfirm.com
   - REDIRECT_URLS: 
      - https://bantconfirm.com/#/login
      - https://bantconfirm.com/

3. EMAIL SENDER LIMITS:
   By default, Supabase allows only 3 emails per hour. 
   To handle more users, go to:
   Authentication -> Providers -> SMTP
   And connect a provider like Resend (resend.com) or SendGrid.

4. UPDATED EMAIL TEMPLATE (Confirm Sign Up):
   Go to: Authentication -> Email Templates -> Confirm Sign Up
   
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; }
    .logo { height: 48px; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 16px; font-weight: bold; margin-top: 24px; }
    .footer { margin-top: 32px; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://bantconfirm.com/favicon.ico" class="logo" />
    <h2 style="color: #0f172a;">Verify your email</h2>
    <p style="color: #64748b;">Welcome to BantConfirm. Please verify your email to start accessing verified B2B leads.</p>
    <a href="{{ .ConfirmationURL }}" class="btn">Verify Account</a>
    <p class="footer">© 2025 BantConfirm India Pvt Ltd</p>
  </div>
</body>
</html>

========================================================================
*/