import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUser = process.env.ADMIN_USERNAME || 'vvm_admin';
    const expectedPass =
      process.env.ADMIN_PASSWORD || 'vvm_master_vault_2026!';

    const isMatch =
      username.trim() === expectedUser && password.trim() === expectedPass;

    if (isMatch) {
      // Create secure authorization token
      const token = `vvm_auth_token_${Buffer.from(
        `${expectedUser}:${Date.now()}`
      ).toString('base64')}`;

      return NextResponse.json({
        success: true,
        token,
        user: { username: expectedUser, role: 'Super Administrator' },
        message: 'Administrator authentication verified',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid Administrator Username or Password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
