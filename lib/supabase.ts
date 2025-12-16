import { createClient } from '@supabase/supabase-js';

// Access environment variables safely (supports Vite)
// Casting import.meta to any to resolve TypeScript error: Property 'env' does not exist on type 'ImportMeta'
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
SUPABASE EMAIL TEMPLATE INSTRUCTIONS (For Logo & Redirect)
========================================================================

To add your logo to the confirmation email and ensure the button looks professional:

1. Go to Supabase Dashboard -> Authentication -> Email Templates
2. Select "Confirm Sign Up"
3. Paste the following HTML into the "Body" section:

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 3px solid #facc15; }
    .logo { height: 50px; width: auto; }
    .content { padding: 40px 30px; color: #334155; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- REPLACE THIS URL WITH YOUR ACTUAL LOGO URL -->
      <img src="https://bantconfirm.com/logo.png" alt="BantConfirm" class="logo" />
    </div>
    <div class="content">
      <h2 style="color: #0f172a; margin-top: 0;">Verify your account</h2>
      <p>Hello,</p>
      <p>Thank you for joining <strong>BantConfirm</strong>, India's #1 B2B Marketplace.</p>
      <p>Please confirm your email address to access verified vendor leads and post requirements.</p>
      <center>
        <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email Address</a>
      </center>
    </div>
    <div class="footer">
      &copy; 2025 BantConfirm India Pvt Ltd.<br/>
      Noida, Uttar Pradesh, India
    </div>
  </div>
</body>
</html>

========================================================================
*/