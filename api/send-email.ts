
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SENDER = 'BANTConfirm <noreply@bantconfirm.com>';

type EmailType =
  | 'user_welcome'
  | 'enquiry_confirmation'
  | 'vendor_welcome'
  | 'vendor_approval'
  | 'vendor_rejected'
  | 'manual_vendor_welcome'
  | 'admin_new_vendor'
  | 'vendor_lead_assignment'
  | 'user_vendor_assigned'
  | 'lead_status_change'
  | 'admin_new_lead';

interface EmailPayload {
  to: string;
  type: EmailType;
  data: any;
  userId?: string;
  vendorId?: string;
  referenceId?: string;
}

const getEmailTemplate = (type: EmailType, data: any) => {
  switch (type) {
    case 'user_welcome':
      return {
        subject: 'Welcome to BANTConfirm 🎉',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Welcome to BANTConfirm, ${data.userName}!</h2>
            <p>Thank you for joining India's most trusted B2B IT marketplace.</p>
            <p>With BANTConfirm, you can:</p>
            <ul>
              <li>Find verified IT vendors and service providers.</li>
              <li>Get AI-matched quotes based on your BANT requirements.</li>
              <li>Manage all your business enquiries in one place.</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="https://www.bantconfirm.com/user/dashboard" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
            <p>Visit our website: <a href="https://www.bantconfirm.com">www.bantconfirm.com</a></p>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'admin_new_lead':
      return {
        subject: `New Lead: ${data.lead.service} from ${data.lead.company}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Enquiry Received</h2>
            <p>A new BANT-qualified enquiry has been submitted.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Lead ID:</strong> ${data.lead.id}</p>
              <p><strong>User:</strong> ${data.lead.name} (${data.lead.email})</p>
              <p><strong>Company:</strong> ${data.lead.company}</p>
              <p><strong>Product/Service:</strong> ${data.lead.service}</p>
              <p><strong>Budget:</strong> ${data.lead.budget}</p>
              <p><strong>Timing:</strong> ${data.lead.timing}</p>
            </div>
            <a href="https://www.bantconfirm.com/admin" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Lead</a>
          </div>
        `
      };
    case 'enquiry_confirmation':
      return {
        subject: 'Your Requirement Has Been Received | BANTConfirm',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Requirement Received</h2>
            <p>Hi ${data.userName},</p>
            <p>We have received your requirement. Our AI engine is matching it with the best partners.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Requirement ID:</strong> ${data.referenceId}</p>
              <p><strong>Product/Service:</strong> ${data.serviceName}</p>
              <p><strong>Submission Date:</strong> ${data.date}</p>
            </div>
            <p><strong>Next Steps:</strong> Verified partners will review your request and contact you shortly.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'vendor_welcome':
      return {
        subject: 'Welcome to BANTConfirm Partner Network',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Welcome to BANTConfirm!</h2>
            <p>Hi ${data.vendorName},</p>
            <p>Thank you for joining the BANTConfirm Partner Network as <strong>${data.companyName}</strong>.</p>
            <p>Your vendor registration has been received successfully. Our team will review and verify your profile shortly.</p>
            <p><strong>Platform Benefits:</strong></p>
            <ul>
              <li>Access to AI-qualified business leads</li>
              <li>Verified BANT requirements</li>
              <li>Direct dashboard for enquiry management</li>
              <li>Performance tracking and analytics</li>
            </ul>
            <p>Once approved, you will start receiving qualified business enquiries from BANTConfirm.</p>
            <div style="margin: 30px 0;">
              <a href="https://www.bantconfirm.com/dashboard" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'vendor_approval':
      return {
        subject: 'Your Vendor Account Has Been Approved | BANTConfirm',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981;">Congratulations!</h2>
            <p>Dear ${data.vendorName},</p>
            <p>Your vendor account for <strong>${data.companyName}</strong> has been verified and activated.</p>
            <p>You can now:</p>
            <ul>
              <li>Receive Business Leads</li>
              <li>Manage Enquiries</li>
              <li>Update Products & Services</li>
              <li>Track Lead Status</li>
            </ul>
            <div style="margin: 30px 0;">
              <a href="https://www.bantconfirm.com/login" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Dashboard Login</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'vendor_rejected':
      return {
        subject: 'Update Regarding Your Vendor Registration | BANTConfirm',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #ef4444;">Registration Update</h2>
            <p>Hi ${data.vendorName},</p>
            <p>Thank you for your interest in joining BANTConfirm. After reviewing your application for <strong>${data.companyName}</strong>, we regret to inform you that we cannot approve your vendor account at this time.</p>
            <p>Reason: ${data.reason || 'Does not meet our current partner criteria.'}</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'manual_vendor_welcome':
      return {
        subject: 'Your BANTConfirm Vendor Account Credentials',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Welcome to BANTConfirm!</h2>
            <p>Hi ${data.vendorName},</p>
            <p>An administrator has created a vendor account for <strong>${data.companyName}</strong> on BANTConfirm.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Login Email:</strong> ${data.email}</p>
              <p><strong>Temporary Password:</strong> ${data.password}</p>
            </div>
            <p><strong>Note:</strong> You will be required to change your password upon your first login.</p>
            <div style="margin: 30px 0;">
              <a href="https://www.bantconfirm.com/login" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'admin_new_vendor':
      return {
        subject: 'New Vendor Registration Received',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Vendor Registration</h2>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.vendorName}</p>
              <p><strong>Company:</strong> ${data.companyName}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Mobile:</strong> ${data.mobile}</p>
              <p><strong>Date:</strong> ${data.date}</p>
            </div>
            <a href="https://www.bantconfirm.com/admin" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Registration</a>
          </div>
        `
      };
    case 'vendor_lead_assignment':
      return {
        subject: 'New Business Enquiry Assigned | BANTConfirm',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">New Lead Assigned</h2>
            <p>Hi ${data.vendorName},</p>
            <p>You have been assigned a new qualified business enquiry on BANTConfirm.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Requirement ID:</strong> ${data.referenceId}</p>
              <p><strong>Customer Name:</strong> ${data.customerName}</p>
              <p><strong>Product/Service:</strong> ${data.serviceName}</p>
              <p><strong>Assignment Date:</strong> ${data.date}</p>
            </div>
            <p>Please login to your vendor dashboard to review and respond.</p>
            <div style="margin: 30px 0;">
              <a href="https://www.bantconfirm.com/dashboard" style="background: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Lead</a>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'user_vendor_assigned':
      return {
        subject: 'A Vendor Has Been Assigned To Your Requirement',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Partner Assigned</h2>
            <p>Hi ${data.userName},</p>
            <p>We have assigned a verified partner to your requirement.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Requirement ID:</strong> ${data.referenceId}</p>
              <p><strong>Product/Service:</strong> ${data.serviceName}</p>
              <p><strong>Vendor Company:</strong> ${data.vendorCompanyName}</p>
            </div>
            <p>They will be getting in touch with you shortly.</p>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    case 'lead_status_change':
      return {
        subject: `Lead Status Updated: ${data.newStatus} | BANTConfirm`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5;">Status Update</h2>
            <p>Hi ${data.name},</p>
            <p>The status of the lead has been updated to <strong>${data.newStatus}</strong>.</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Requirement ID:</strong> ${data.referenceId}</p>
              <p><strong>Product/Service:</strong> ${data.serviceName}</p>
            </div>
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Team BANTConfirm</p>
          </div>
        `
      };
    default:
      return { subject: 'Notification from BANTConfirm', html: '<p>You have a new notification.</p>' };
  }
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { to, type, data, userId, vendorId, referenceId } = await req.json() as EmailPayload;

    if (!to || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Supabase configuration missing' }), { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Duplicate Prevention
    let query = supabase
      .from('email_logs')
      .select('id')
      .eq('email', to)
      .eq('email_type', type)
      .eq('status', 'sent');

    if (referenceId) {
      query = query.eq('reference_id', referenceId);
    } else {
      query = query.is('reference_id', null);
    }

    const { data: existingLogs } = await query;

    if (existingLogs && existingLogs.length > 0) {
      // For some types like status change, we might want to allow duplicates if it's a different status
      // But for welcome emails, definitely only once.
      if (type === 'user_welcome' || type === 'vendor_welcome' || type === 'enquiry_confirmation') {
         return new Response(JSON.stringify({ message: 'Email already sent recently' }), { status: 200 });
      }
    }

    const template = getEmailTemplate(type, data);

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is missing.');
      return new Response(JSON.stringify({ error: 'Resend API key missing' }), { status: 500 });
    }

    // 2. Send Email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER,
        to: to,
        subject: template.subject,
        html: template.html,
      }),
    });

    const resData = await res.json();

    // 3. Log Email
    const { data: logData } = await supabase.from('email_logs').insert({
      user_id: userId,
      vendor_id: vendorId,
      email: to,
      email_type: type,
      reference_id: referenceId || null,
      status: res.ok ? 'sent' : 'failed',
      error_message: res.ok ? null : JSON.stringify(resData),
      metadata: data
    }).select().single();

    if (!res.ok && logData) {
       // Retry once if failed
       console.log('Attempting retry for failed email...');
       const retryRes = await fetch('https://api.resend.com/emails', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${RESEND_API_KEY}`,
         },
         body: JSON.stringify({
           from: SENDER,
           to: to,
           subject: template.subject,
           html: template.html,
         }),
       });
       if (retryRes.ok) {
         await supabase.from('email_logs').update({ status: 'sent', error_message: 'Fixed via retry' }).eq('id', logData.id);
       }
    }

    return new Response(JSON.stringify({ success: res.ok, data: resData }), {
      status: res.ok ? 200 : 500,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Email API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
