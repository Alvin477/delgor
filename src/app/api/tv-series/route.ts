import { NextResponse } from 'next/server';
import { fetchTvShows } from '@/app/lib/fetchTvShows';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') ?? 'en';
  const genre = searchParams.get('genre') ? parseInt(searchParams.get('genre') ?? '') : undefined;
  const year = searchParams.get('year') ?? undefined;
  const page = parseInt(searchParams.get('page') ?? '1');

  try {
    // Fetch TV shows based on the locale, genre, year, and page
    const tvData = await fetchTvShows(locale, genre, year, page);
    return NextResponse.json(tvData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch TV shows' }, { status: 500 });
  }
}
