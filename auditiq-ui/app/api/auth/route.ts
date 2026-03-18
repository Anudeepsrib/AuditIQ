import { NextRequest, NextResponse } from 'next/server';

// Server-side auth handler for setting cookies
export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json();

    // Set cookies with httpOnly flag
    const response = NextResponse.json({ success: true });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set auth cookies' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Clear auth cookies on logout
  const response = NextResponse.json({ success: true });

  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');

  return response;
}
