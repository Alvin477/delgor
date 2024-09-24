import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { id, year } = await req.json();

    const filePath = path.join(process.cwd(), 'public', 'json', year, 'tv.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const tvSeries = JSON.parse(fileContents);

    // Find the TV series to delete
    const updatedTvSeries = tvSeries.filter((tv: any) => tv.id !== id);

    if (updatedTvSeries.length === tvSeries.length) {
      return NextResponse.json({ message: 'TV series not found' }, { status: 404 });
    }

    // Write the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(updatedTvSeries, null, 2));

    return NextResponse.json({ message: 'TV series deleted successfully' });
  } catch (error) {
    console.error('Error deleting TV series:', error);
    return NextResponse.json({ message: 'Error deleting TV series' }, { status: 500 });
  }
}
