import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the client's IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || request.headers.get('x-real-ip') || '';
    
    // Use ip-api.com for geolocation (free, no API key needed)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,regionName,country`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return NextResponse.json({
        city: data.city || 'Unknown',
        region: data.regionName || '',
        country: data.country || '',
      });
    }
    
    // Fallback for localhost/development
    return NextResponse.json({
      city: 'Local',
      region: '',
      country: '',
    });
  } catch (error) {
    console.error('Location error:', error);
    return NextResponse.json({
      city: 'Unknown',
      region: '',
      country: '',
    });
  }
}

