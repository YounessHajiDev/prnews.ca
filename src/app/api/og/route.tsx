import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'PR NEWS';
  const safeTitle = title.length > 120 ? title.slice(0, 117) + '...' : title;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#14161C',
          color: '#F7F5EF',
          padding: 64,
        }}
      >
        <div style={{ fontSize: 28, color: '#B8924A', fontWeight: 700, letterSpacing: '0.1em' }}>
          PR NEWS
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
          {safeTitle}
        </div>
        <div style={{ fontSize: 24, color: '#B8924A', marginTop: 32 }}>
          Canadian Press Release Distribution
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
