import { NextResponse } from 'next/server';

const PAID_VAULT_DRIVE_LINK =
  'https://drive.google.com/drive/folders/1GaOl2Ha0AII8QSIhiuOCyA7380DVfQVl?usp=sharing&mcp_token=eyJwaWQiOjkyNzcyOSwic2lkIjoxNzE2MzIxNjI0LCJheCI6ImViNTQ5YzRiZDJkMjBkMTVkZWUxMGMwNGNlMmJlYTNkIiwidHMiOjE3MzgwNTIxNzgsImV4cCI6MTc0MDQ3MTM3OH0.hJ55soOk95b_4z0GzUsTHEiIs3x7BSqUJ-NlZ8sXnLI';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      email,
      name = 'Valued Creator',
      orderId = `VVM-${Date.now().toString().slice(-6)}`,
      paymentId = 'pay_rzp_live',
      amount = 49,
      date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    // HTML Email Template matching Virtual Vision Media Branding
    const htmlEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Congratulations & Welcome to Virtual Vision Media!</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F7F5; margin: 0; padding: 24px; color: #151515; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #E5E7EB; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .header { background: #0A0A0C; padding: 36px 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 12px 0 4px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 0; color: #9CA3AF; font-size: 13px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 36px 32px; }
    .note-box { background: #F8F9FA; border-left: 4px solid #6C56D4; padding: 20px; border-radius: 12px; margin: 24px 0; }
    .btn { display: block; width: fit-content; margin: 28px auto; background: #6C56D4; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 14px; text-align: center; font-family: monospace; letter-spacing: 0.5px; box-shadow: 0 8px 20px rgba(108,86,212,0.35); }
    .details-table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 13px; }
    .details-table td { padding: 12px 0; border-bottom: 1px solid #F3F4F6; }
    .details-table td:last-child { text-align: right; font-weight: 600; font-family: monospace; }
    .footer { background: #FAFAFA; padding: 24px 32px; text-align: center; font-size: 11px; color: #6B7280; border-top: 1px solid #E5E7EB; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p>Virtual Vision Media • Official Delivery</p>
      <h1>🎉 You're In! Welcome to the 100GB Vault</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6;">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #4B5563;">
        Congratulations on unlocking the <strong>100GB Master Video Editor Assets Vault</strong>! We are thrilled to welcome you to our exclusive creator family.
      </p>

      <div class="note-box">
        <h4 style="margin: 0 0 8px; font-size: 14px; color: #111827;">A Personal Note from the VVM Team:</h4>
        <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #4B5563;">
          We spent thousands of studio hours scanning real 35mm film stock, recording surgical 96kHz sound design, and engineering calibrated LUT color science. We believe high-tier production assets shouldn't cost thousands of rupees. May this 100GB vault empower you to create beyond limits!
        </p>
      </div>

      <h3 style="font-size: 15px; margin: 24px 0 8px; text-transform: uppercase; font-family: monospace; color: #111827;">
        🔗 Your Permanent Google Drive Access Link:
      </h3>
      
      <a href="${PAID_VAULT_DRIVE_LINK}" class="btn" target="_blank">
        OPEN 100GB GOOGLE DRIVE VAULT →
      </a>
      
      <p style="font-size: 11px; text-align: center; color: #9CA3AF; font-family: monospace;">
        Direct link: <br>${PAID_VAULT_DRIVE_LINK}
      </p>

      <h3 style="font-size: 14px; margin: 32px 0 12px; text-transform: uppercase; font-family: monospace; color: #111827;">
        🧾 Purchase & License Summary:
      </h3>
      
      <table class="details-table">
        <tr>
          <td style="color: #6B7280;">Order ID</td>
          <td>${orderId}</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">Razorpay Payment ID</td>
          <td>${paymentId}</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">Licensee</td>
          <td>${name} (${email})</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">Order Date</td>
          <td>${date}</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">Amount Paid</td>
          <td style="color: #059669; font-size: 15px;">₹${amount} (Inclusive of all taxes)</td>
        </tr>
        <tr>
          <td style="color: #6B7280;">License Type</td>
          <td style="color: #6C56D4;">Perpetual Commercial Royalty-Free</td>
        </tr>
      </table>

      <div style="background: #ECFDF5; border: 1px solid #A7F3D0; padding: 16px; border-radius: 12px; margin-top: 24px;">
        <h4 style="margin: 0 0 4px; font-size: 13px; color: #065F46;">💡 Quick Pro-Tip for Editors:</h4>
        <p style="margin: 0; font-size: 12px; color: #047857; line-height: 1.5;">
          Click "Add shortcut to Drive" inside Google Drive to stream the full 102.4 GB directly in Premiere Pro or DaVinci Resolve without filling your computer hard drive!
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px;">
        © ${new Date().getFullYear()} Virtual Vision Media (VVM). All rights reserved.
      </p>
      <p style="margin: 0;">
        Need assistance? Reply directly to this email or contact <a href="mailto:support@virtualvisionmedia.com" style="color: #6C56D4;">support@virtualvisionmedia.com</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // 1. Deliver via Official Resend REST API (zero npm dependencies, native fetch)
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM || 'Virtual Vision Media <onboarding@resend.dev>';

    if (!resendApiKey) {
      console.warn('[Resend API]: RESEND_API_KEY is not defined in environment variables.');
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY is not configured in Vercel environment variables. Please add your Resend API key.',
        recipient: email,
        orderId,
      }, { status: 400 });
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: `🎉 Congratulations ${name}! Your 100GB Video Editor Vault is Ready (Order #${orderId})`,
          html: htmlEmail,
        }),
      });

      const resendResult = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn('[Resend API Error]:', resendResult);
        return NextResponse.json({
          success: false,
          error: resendResult?.message || `Resend error (${response.status})`,
          statusCode: response.status,
          resendResult,
          recipient: email,
          orderId,
        }, { status: 400 });
      }

      console.log('[Resend API Success]:', resendResult);
      return NextResponse.json({
        success: true,
        recipient: email,
        orderId,
        resendResult,
        message: `Congratulatory email and download access link dispatched to ${email}`,
      });
    } catch (fetchErr: any) {
      console.warn('[Resend API Fetch Error]:', fetchErr);
      return NextResponse.json({
        success: false,
        error: fetchErr?.message || 'Network error reaching Resend API',
        recipient: email,
        orderId,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Email dispatch error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Email dispatch failed' },
      { status: 500 }
    );
  }
}
