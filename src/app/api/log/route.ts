import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, message, metadata, timestamp } = body;
    
    // IP address extraction (Vercel provides this via headers)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const logEntry = JSON.stringify({
      level: type === 'ERROR' || type === 'SECURITY_EVENT' ? 'error' : 'info',
      event: type,
      timestamp: timestamp || new Date().toISOString(),
      message,
      ip,
      userAgent,
      ...metadata
    });

    // In a Vercel environment, standard console.log/error writes to the Runtime Logs (AWS CloudWatch/Datadog equivalent)
    if (type === 'ERROR' || type === 'SECURITY_EVENT') {
      console.error(`[SECURITY/ERROR] ${logEntry}`);
    } else {
      console.log(`[AUDIT] ${logEntry}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to parse incoming log', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
