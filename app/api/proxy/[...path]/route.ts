import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://hackathon-api.aheadafrica.org/v1';
const API_TOKEN = 'ND3T27IJ4D:whNhkiyAjxE0YQYvybTzfm_BvUXFzWK6VrE88nKgFVw';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const queryString = url.search;
  
  try {
    const response = await fetch(`${API_BASE_URL}/${path}${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const body = await request.json();
  
  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}