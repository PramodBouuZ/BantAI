
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { name, email, company, mobile, location, products, services, logoUrl } = await req.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Name and Email are required' }), { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Supabase configuration missing' }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        company,
        role: 'vendor'
      }
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
    }

    const userId = authData.user.id;

    // 2. Insert/Update Public User Record
    // The auth trigger might already create this, but we upsert to be sure and add vendor fields
    const { error: dbError } = await supabase.from('users').upsert({
      id: userId,
      email,
      full_name: name,
      company,
      mobile,
      location,
      role: 'vendor',
      status: 'Verified',
      verification_date: new Date().toISOString(),
      verified_by: 'info.bouuz@gmail.com',
      products,
      services,
      logo_url: logoUrl,
      is_first_login: true
    });

    if (dbError) {
      // Cleanup auth user if DB insert fails? Maybe not strictly necessary if we want to allow retry
      console.error('DB Insert Error:', dbError);
    }

    // 3. Send Manual Welcome Email
    await fetch(new URL('/api/send-email', req.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        type: 'manual_vendor_welcome',
        vendorId: userId,
        data: {
          vendorName: name,
          companyName: company || 'Your Company',
          email: email,
          password: tempPassword
        }
      })
    });

    return new Response(JSON.stringify({ success: true, userId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Create Vendor API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
