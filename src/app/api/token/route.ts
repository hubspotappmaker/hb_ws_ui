import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

export async function POST(request: Request) {
    try
    {
        const creds = await request.json();
        const auth = new GoogleAuth({
            credentials: creds,
            scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const client = await auth.getClient();
        const res = await client.getAccessToken();
        if (!res.token) throw new Error('No token received');

        return NextResponse.json({ token: res.token });
    } catch (err: any)
    {
        return NextResponse.json(
            { error: err.message || 'Failed to fetch token' },
            { status: 500 }
        );
    }
}
