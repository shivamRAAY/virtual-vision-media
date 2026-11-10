import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { verified: false, error: 'RAZORPAY_KEY_SECRET is not configured' },
        { status: 500 }
      );
    }

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      return NextResponse.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        message: 'Payment verified successfully by Virtual Vision Media',
      });
    } else {
      return NextResponse.json(
        { verified: false, error: 'Invalid HMAC signature verification' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Razorpay payment verification error:', error);
    return NextResponse.json(
      { verified: false, error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
