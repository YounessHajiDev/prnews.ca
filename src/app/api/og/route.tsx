import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ fontSize: 48, color: 'white', background: '#14161C', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        PR NEWS
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
