
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
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
        name: name,
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
      name,
      role: 'vendor'
    });

    // 3. Create a registration record for persistence of company details and status
    await supabase.from('vendor_registrations').upsert({
      id: `man_${userId}`,
      name: name,
      company_name: company || 'Partner',
      email: email,
      mobile: mobile,
      location: location,
      product_name: products?.[0] || 'Managed Partner',
      message: 'Manually onboarded by admin',
      status: 'Verified', // Manual onboarding usually implies verified
      date: new Date().toISOString().split('T')[0]
    });

    // 4. Save logo to vendor_assets if provided
    if (logoUrl) {
      // Note: vendor_assets.id is a UUID in the schema, so we omit it to let Supabase generate one
      // We link via the 'name' field which is used for lookups in the Dashboard
      await supabase.from('vendor_assets').insert({
        name: company || name,
        logo_url: logoUrl
      });
    }

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
