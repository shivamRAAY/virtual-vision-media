import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY || 're_6PQhhtzc_95r8tb2FV1EPMx3sakidkXf8';
    const fromAddress = process.env.RESEND_FROM || 'Virtual Vision Media <onboarding@resend.dev>';
    const ownerEmail = 'virtualvisionmed@gmail.com';

    // Dispatch notification email to studio owner via Resend REST API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [ownerEmail],
        reply_to: email,
        subject: `[VVM Contact] ${subject || 'New Creator Inquiry'} from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0E; color: #FFFFFF; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="color: #A78BFA; margin: 0; font-size: 20px;">Virtual Vision Media — Direct Contact Dispatch</h2>
              <p style="color: #9CA3AF; margin: 4px 0 0 0; font-size: 12px; font-family: monospace;">New message received from your website contact card</p>
            </div>

            <div style="background: rgba(255,255,255,0.04); padding: 18px; border-radius: 12px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #A78BFA;">${email}</a></p>
              <p style="margin: 0; font-size: 13px;"><strong>Inquiry Subject:</strong> ${subject || 'General Creative Collaboration'}</p>
            </div>

            <div style="background: rgba(167, 139, 250, 0.08); border-left: 3px solid #8B5CF6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #C4B5FD; text-transform: uppercase; font-family: monospace;">Message Content:</h4>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E5E7EB; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px;">
              <a href="mailto:${email}?subject=Re:%20Virtual%20Vision%20Media%20Inquiry" style="display: inline-block; background: #6D28D9; color: #FFFFFF; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">
                Reply Directly to ${name}
              </a>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been successfully transmitted to Virtual Vision Media.',
      id: data?.id,
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch inquiry' },
      { status: 500 }
    );
  }
}
