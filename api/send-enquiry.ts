
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { lead, adminEmail } = await req.json();

    if (!lead || !lead.id || !lead.email) {
      return new Response(JSON.stringify({ error: 'Missing lead data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Supabase configuration missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check for duplicates in email_logs
    const { data: existingLogs, error: logError } = await supabase
      .from('email_logs')
      .select('id')
      .eq('lead_id', lead.id)
      .eq('type', 'user_confirmation')
      .eq('status', 'sent');

    if (logError) {
        console.error('Error checking email logs:', logError);
    }

    if (existingLogs && existingLogs.length > 0) {
      return new Response(JSON.stringify({ message: 'Email already sent' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!resendApiKey) {
        console.warn('RESEND_API_KEY is missing. Skipping email sending.');
        return new Response(JSON.stringify({ error: 'Resend API key missing' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 2. Prepare Email Content
    const userName = lead.name || 'Valued User';
    const requirementId = lead.id;
    const productName = lead.service || 'Requirement';
    const submissionDate = lead.date || new Date().toISOString().split('T')[0];

    const userHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">Your Requirement Has Been Received | BANTConfirm</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for submitting your requirement. Our AI matching engine is currently processing your request to find the best verified partners for you.</p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Requirement ID:</strong> ${requirementId}</p>
          <p><strong>Product/Service:</strong> ${productName}</p>
          <p><strong>Submission Date:</strong> ${submissionDate}</p>
        </div>

        <h3>Next Steps:</h3>
        <ol>
          <li>Our AI engine matches your requirement with top-rated vendors.</li>
          <li>Verified partners will review your BANT parameters.</li>
          <li>Up to 3 partners will contact you with customized quotes.</li>
        </ol>

        <p>You can track the status of your enquiry in your dashboard.</p>
        <a href="https://bantconfirm.com/dashboard" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>

        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          Best Regards,<br>
          Team BANTConfirm
        </p>
      </div>
    `;

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4f46e5;">New Enquiry Received</h2>
        <p>A new BANT-qualified enquiry has been submitted.</p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Lead ID:</strong> ${lead.id}</p>
          <p><strong>User:</strong> ${lead.name} (${lead.email})</p>
          <p><strong>Company:</strong> ${lead.company}</p>
          <p><strong>Mobile:</strong> ${lead.mobile}</p>
          <p><strong>Location:</strong> ${lead.location}</p>
          <p><strong>Product/Service:</strong> ${lead.service}</p>
          <p><strong>Budget:</strong> ${lead.budget}</p>
          <p><strong>Authority:</strong> ${lead.authority}</p>
          <p><strong>Timing:</strong> ${lead.timing}</p>
          <p><strong>Requirement:</strong> ${lead.requirement}</p>
        </div>

        <a href="https://bantconfirm.com/admin" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Lead</a>
      </div>
    `;

    // 3. Send Email to User
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'BANTConfirm <notifications@bantconfirm.com>',
        to: lead.email,
        subject: 'Your Requirement Has Been Received | BANTConfirm',
        html: userHtml,
      }),
    });

    const userData = await userRes.json();

    if (userRes.ok) {
      // Log success
      await supabase.from('email_logs').insert({
        lead_id: lead.id,
        recipient_email: lead.email,
        subject: 'Your Requirement Has Been Received | BANTConfirm',
        type: 'user_confirmation',
        status: 'sent'
      });
    } else {
      // Log failure
      await supabase.from('email_logs').insert({
        lead_id: lead.id,
        recipient_email: lead.email,
        subject: 'Your Requirement Has Been Received | BANTConfirm',
        type: 'user_confirmation',
        status: 'failed',
        error_message: JSON.stringify(userData)
      });
    }

    // 4. Send Email to Admin
    if (adminEmail) {
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: 'BANTConfirm Alerts <notifications@bantconfirm.com>',
                to: adminEmail,
                subject: `New Lead: ${lead.service} from ${lead.company}`,
                html: adminHtml,
            }),
        });
    }

    return new Response(JSON.stringify({ success: true, userData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
