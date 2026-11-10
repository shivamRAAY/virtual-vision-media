import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount) || 49;
    const receipt = body.receipt || `vvm_${Date.now()}`;

    const key_id =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('Razorpay credentials missing in environment variables');
      return NextResponse.json(
        { error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel settings.' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt,
      notes: {
        product: 'Virtual Vision Media — 100GB Master Video Editor Vault',
        customer_email: body.email || '',
        customer_name: body.name || '',
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order, keyId: key_id });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    const errorMsg =
      error?.error?.description ||
      error?.message ||
      'Failed to create Razorpay order. Check your Razorpay Key ID and Secret.';
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
